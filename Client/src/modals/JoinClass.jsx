import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";

const JoinClass = ({ onCancel, onJoinClass }) => {
  const [classCode, setClassCode] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classFound, setClassFound] = useState(false);
  const [error, setError] = useState(null);

  // Search for class by code
  const handleSearchClass = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setClassFound(false);

    try {
      const response = await axios.post("http://localhost:8080/coderoom/auth/search-class", { classCode });
      setClassInfo(response.data.classData);
      setClassFound(true);
      setError(null);
    } catch (error) {
      setError("Class not found, please check the code.");
      setClassInfo(null);
      setClassFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Join the class if it is found
  const handleJoinClass = () => {
    if (classInfo) {
        console.log(classInfo)
      onJoinClass(classInfo.code);
      onCancel(); // Close modal after joining
    }
  };

  return (
    <div className="absolute top-0 bg-black bg-opacity-95 inset-0 left-0 h-screen w-full flex items-center justify-center">
      <div className="relative rounded-[7px] w-[420px] bg-[#1e1e1e] border border-[#2a2a2a] p-6">
        <button onClick={onCancel} className="text-2xl absolute top-4 right-4 text-gray-300">
          <IoClose />
        </button>

        <h1 className="Geist-semibold flex items-center text-2xl text-[#FAFAFA] mb-6">Join Class</h1>

        <form onSubmit={handleSearchClass}>
          <input
            type="text"
            maxLength={6}
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Enter Class Code"
            className="w-full mb-4 p-3 overflow-hidden rounded-[7px] bg-[#2e2e2e] text-white border border-[#3a3a3a]"
            disabled={classFound} // Disable input if class is found
          />
          {error && <div className="text-md text-white text-center w-full">{error}</div>}
          {!classFound && (
            <button type="submit" className="mt-4 w-full p-3 rounded-[7px] bg-[#800080] text-white">
              {isLoading ? "Searching..." : "Search Class"}
            </button>
          )}
        </form>

        {classFound && classInfo && (
          <div className="mt-4 bg-[#2e2e2e] p-4 rounded-[7px]">
            <p className="text-lg text-gray-300 text-center">{classInfo.className}</p>
            <button onClick={handleJoinClass} className="mt-4 w-full p-3 rounded-[7px] bg-[#800080] text-white">
              Join Class
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinClass;
