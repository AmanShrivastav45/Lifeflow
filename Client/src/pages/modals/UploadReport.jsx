import React, { useState } from 'react'
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoClose } from 'react-icons/io5'
import axios from "axios";
import toast from "react-hot-toast";
import { CONSTANTS } from '../../../../constants';
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";


pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();
const server = import.meta.env.VITE_SERVER_URL;

const UploadReport = ({ laboratoryId, index, onCancel }) => {
    const [apStatus, setApStatus] = useState("");
    const [fileData, setFileData] = useState(null);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadCompleted, setUploadCompleted] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Please upload a PDF file.");
                setFileData(null);
            } else {
                setFileData({
                    file,
                    name: file.name,
                    size: file.size,
                    progress: 0,
                    status: "uploading",
                });
                setError("");
                simulateUpload();
            }
        }
    };

    const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            setFileData((prevFile) => {
                if (!prevFile) return null;
                if (progress >= 100) {
                    clearInterval(interval);
                    return { ...prevFile, progress: 100, status: "completed" };
                }
                return { ...prevFile, progress };
            });
        }, 500);
    };

    const handleDelete = () => {
        setFileData(null);
        setError("");
        setUploadCompleted(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fileData && !apStatus) {
            setError("Please either select a status or upload a file.");
            toast.error("Please either select a status or upload a file.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();

        if (fileData?.file) {
            let extractedText = "";
            if (fileData.file.type === "application/pdf") {
                try {
                    const pdfData = await fileData.file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                    const numPages = pdf.numPages;

                    for (let i = 1; i <= numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        extractedText += textContent.items.map((item) => item.str).join(" ");
                    }
                } catch (err) {
                    console.error("Error extracting text from PDF:", err);
                    toast.error("Error extracting text from PDF.");
                }
            }
            else if (fileData.file.type.startsWith("image/")) {
                try {
                    const { data } = await Tesseract.recognize(fileData.file, "eng");
                    extractedText = data.text;
                } catch (err) {
                    console.error("Error extracting text from image:", err);
                    toast.error("Error extracting text from image.");
                }
            }

            const cleanedText = extractedText.replace(/"/g, "").replace(/\s+/g, ' ').trim();

            formData.append("file", fileData.file);
            formData.append("text", cleanedText);
        }

        if (apStatus) {
            formData.append("status", apStatus);
        }

        formData.append("laboratoryId", laboratoryId);
        formData.append("index", index);

        try {
            const response = await axios.post(`${server}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast.success("File uploaded successfully!");
                setUploadCompleted(true);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("There was an error uploading the file. Please try again.");
        } finally {
            setIsUploading(false);
            window.location.reload();
        }
    };

    const trimFileName = (name, maxLength = 30) => {
        if (name.length <= maxLength) return name;
        const firstPart = name.slice(0, 15);
        const lastPart = name.slice(-12);
        return `${firstPart}...${lastPart}`;
    };


    return (
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-gradient-to-l from-[#ffefc9] to-white relative p-5 rounded-[5px] border border-gray-300 shadow-lg w-[95%] md:w-[320px]">
                <button onClick={onCancel} className="text-2xl absolute top-4 right-4 text-gray-600" >
                    <IoClose />
                </button>
                <div>
                    <h1 className="text-base w-full text-left Geist-semibold text-black ml-1 mb-2">
                        Upload Lab Report
                    </h1>
                    <div className="space-y-4 mb-4 flex flex-col w-full">
                        <select
                            value={apStatus}
                            onChange={(e) => {
                                setApStatus(e.target.value);
                            }}
                            className="border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white  px-2 pl-1.5 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
                        >
                            <option hidden>Update Status</option>
                            <option
                                value={CONSTANTS.APPOINTMENT_STATUS.PENDING}
                                onSelect={() => setApStatus(CONSTANTS.APPOINTMENT_STATUS.PENDING)}
                            >
                                Pending
                            </option>
                            <option
                                value={CONSTANTS.APPOINTMENT_STATUS.INPROGRESS}
                                onSelect={() => setApStatus(CONSTANTS.APPOINTMENT_STATUS.INPROGRESS)}
                            >
                                In Progress
                            </option>
                            <option
                                value={CONSTANTS.APPOINTMENT_STATUS.COMPLETED}
                                onSelect={() => setApStatus(CONSTANTS.APPOINTMENT_STATUS.COMPLETED)}
                            >
                                Completed
                            </option>
                        </select>
                    </div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 mb-4">
                        <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <span className="text-gray-700">
                            {fileData
                                ? "Selected file"
                                : "Click to upload or drag & drop"}
                        </span>
                        {fileData && (
                            <span className="text-[14px] text-blue-600 mt-1">
                                {trimFileName(fileData.name)}
                            </span>
                        )}
                        <span className="text-[10px] mt-1 text-gray-600">
                            Only JPG, PNG, PDF allowed
                        </span>
                    </label>
                    {
                        <button
                            onClick={handleSubmit}
                            className={`w-full text-sm h-10 py-2 rounded-md transition ${uploadCompleted
                                ? "bg-green-600 text-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                }`}
                            disabled={isUploading || uploadCompleted}
                        >
                            {isUploading ? "Uploading..." : uploadCompleted ? "Completed" : "Submit Report"}
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default UploadReport