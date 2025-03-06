import { useState } from "react";
import { IoClose } from "react-icons/io5";
import React from 'react'

const VerifyDonor =  ({ setVerificationModel }) => {
    const [selectedFile, setSelectedFile] = useState(null);
  
    const handleFileChange = (e) => {
      if (e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
  
  return (
    <div
    style={{ zIndex: 10000 }}
    className="absolute top-0 bg-black bg-opacity-85 inset-0 left-0 h-screen w-full flex items-center justify-center"
  >
    <div className="relative rounded-[7px] w-[95%] md:w-[520px] bg-white border border-[#2a2a2a] p-6">
      {/* Close Button */}
      <button
        onClick={() => setVerificationModel(false)}
        className="text-2xl absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <IoClose />
      </button>

      {/* File Upload */}
      <h2 className="text-xl font-semibold mb-4">Upload Verification Document</h2>
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer hover:bg-gray-100">
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-gray-600">
          {selectedFile ? "File Selected: " : "Click to upload or drag & drop"}
        </span>
        {selectedFile && (
          <span className="text-sm text-blue-600 mt-1">{selectedFile.name}</span>
        )}
        <span className="text-xs text-gray-400">Only JPG, PNG, PDF allowed</span>
      </label>

      {/* Submit Button */}
      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        disabled={!selectedFile}
      >
        Submit
      </button>
    </div>
  </div>
  )
}

export default VerifyDonor