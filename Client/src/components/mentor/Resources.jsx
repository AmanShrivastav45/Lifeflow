import React, { useState, useEffect } from "react";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import toast from "react-hot-toast";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Create new plugin instance outside the component

const Resources = ({ selectedClass }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null); // State to store the current PDF URL
  const classId = selectedClass;
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const mentorId = val?._id || null;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/coderoom/auth/resources/${mentorId}/${classId}`
        );
        setResources(response.data.resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to fetch resources");
      }
    };

    fetchResources();
  }, [classId, mentorId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !title) {
      alert("Please provide both a title and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("classId", classId);
    formData.append("mentorId", mentorId);

    try {
      const response = await axios.post(
        "http://localhost:8080/coderoom/auth/upload-resource",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Resource uploaded successfully!");
      setTitle("");
      setFile(null);
      if (response.data.resource) {
        setResources((prevResources) => [
          ...prevResources,
          response.data.resource,
        ]);
        setPdfUrl(`http://localhost:8080/uploads/${response.data.resource.pdf}`);
      }
    } catch (error) {
      console.error("Error uploading resource:", error);
      toast.error("Error uploading resource");
    }
  };

  const handlePdfView = async (resource) => {
    const pdfUrl = `http://localhost:8080/uploads/${resource.pdf}`;
    setPdfUrl(pdfUrl);
  };

  return (
    <div className="Geist h-[95%] gap-4 w-full p-2 flex rounded-lg shadow-md">
      <div className="h-full w-[50%] gap-4 flex flex-col">
        {/* Upload Section */}
        <div className="h-[30%] flex gap-4">
          <div className="h-full w-[50%] flex flex-col items-center justify-center bg-[#1e1e1e] rounded-[7px] p-3">
            <h1 className="text-xl w-full text-left Geist-semibold text-white ml-2 mb-2">
              Upload resources
            </h1>
            <input
              type="text"
              placeholder="Enter resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="Geist mt-1 w-full pl-3 border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 outline-none h-10 text-base text-white rounded-[7px] mb-3"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="Geist file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm  file:bg-purple-700 file:text-gray-200 hover:file:bg-purple-600 border w-full border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 outline-none h-10 text-base text-white rounded-[7px]"
              required
            />
            <button
              onClick={handleUpload}
              className="Geist h-9 mt-3 w-full outline-none text-sm Geist-semibold bg-purple-700 hover:bg-purple-600 text-white rounded-[7px] flex items-center justify-center"
            >
              Upload Resource
            </button>
          </div>
          <div className="h-full w-[50%] bg-[#1e1e1e] rounded-[7px]"></div>
        </div>

        {/* List of Resources */}
        <div className="h-[70%] flex gap-4 flex-col">
          <div className="h-full w-full bg-[#1e1e1e] rounded-[7px] p-4 overflow-y-auto">
            <h2 className="text-lg text-white">Uploaded Resources:</h2>
            {resources.length > 0 ? (
              resources.map((resource) => (
                <div
                  key={resource._id}
                  className="w-full p-2 my-2 bg-[#2A2A2A] rounded-[7px] flex justify-between items-center text-white"
                >
                  <span>{resource.title}</span>
                  <button
                    onClick={() => handlePdfView(resource)}
                    className="text-sm bg-purple-700 hover:bg-purple-600 text-white rounded-[7px] px-4 py-2"
                  >
                    View
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No resources available for this class.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="h-full flex flex-col items-center justify-start w-[50%] bg-[#1e1e1e] rounded-[7px] p-2">
        {pdfUrl ? (
          <div className="h-[700px] w-full hide-scrollbar">
            <iframe className="h-full w-full" src={pdfUrl} />
          </div>
        ) : (
          <div className="h-full text-md text-white Geist w-full flex items-center justify-center">
            Select content to preview
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
