import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "../store/auth.js";
import toast from "react-hot-toast";

const CreateClass = ({ onCancel, onCreateClass }) => {
  const [className, setClassName] = useState("");
  const [classDesc, setClassDesc] = useState("");
  const { createClass } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newClass = await createClass(className, classDesc);
      onCreateClass(newClass);

      onCancel();
    } catch (error) {
      toast.error("Unable to create class, try again!");
    }
  };

  return (
    <div
      style={{ zIndex: 15000 }}
      className="absolute top-0 bg-black bg-opacity-95 inset-0 left-0 h-screen w-full flex items-center justify-center"
    >
      <form onSubmit={handleSubmit}>
        <div className=" relative rounded-[7px] w-[540px] bg-[#1e1e1e] border border-[#2a2a2a] p-6">
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="text-2xl absolute top-4 right-4 text-gray-300"
          >
            <IoClose />
          </button>

          {/* Modal Header */}
          <h1 className="Geist-semibold flex items-center text-2xl text-[#FAFAFA] mb-6">
            Create New Class
          </h1>

          {/* Class Name Input */}
          <input
            type="text"
            maxLength={30}
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter Class Name"
            className="w-full mb-4 p-3 rounded-[7px] bg-[#2e2e2e] text-white border border-[#3a3a3a]"
          />

          {/* Class Description Input */}
          <textarea
            value={classDesc}
            onChange={(e) => setClassDesc(e.target.value)}
            placeholder="Enter Class Description"
            className="w-full resize-none p-3 rounded-[7px] bg-[#2e2e2e] text-white border border-[#3a3a3a]"
            rows="5"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full p-3 rounded-[7px] bg-[#800080] text-white"
          >
            Create Class
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClass;