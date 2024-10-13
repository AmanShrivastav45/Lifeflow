import React from "react";
import "../fonts/stylesheet.css";
import { IoCloseOutline } from "react-icons/io5";

const Boolean = ({heading, body, cancelTitle, proceedTitle, onProceed, onCancel }) => {
  return (
    <div
      style={{ zIndex: 1000 }}
      className="fixed inset-0 z-50 bg-[black] bg-opacity-75 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none"
    >
      <div className="relative w-auto mx-auto  max-w-sm">
        {/* Content */}
        <div className="border-0 rounded-lg shadow-xl relative px-2 flex flex-col w-full bg-[#1e1e1e] outline-none focus:outline-none">
          {/* Header */}
          <div className="Geist flex items-start justify-between p-4 pb-0 rounded-t">
            <h3 className="text-xl text-gray-300">{heading}</h3>
            <button
              className=" bg-transparent border-0 text-3xl leading-none  outline-none focus:outline-none"
              onClick={onCancel}
            >
              <span className="bg-transparent text-gray-200 h-6 w-6 text-2xl block outline-none focus:outline-none">
                <IoCloseOutline />
              </span>
            </button>
          </div>
          {/* Body */}
          <div className="relative p-4 flex-auto">
            <p className="Geist my-2 text-[#68686f] text-base leading-relaxed">
              {body}
            </p>
          </div>
          {/* Footer */}
          <div className="Geist flex items-center justify-end p-2 rounded-b">
            <button
              className="text-[#68686f] bg-[#2a2a2a] mr-2 rounded-[7px] Geist uppercase px-4 py-2 text-sm outline-none focus:outline-none mb-1"
              type="button"
              onClick={onCancel}
            >
              {cancelTitle}
            </button>
            <button
              className="bg-red-600 Geist text-white active:bg-red-700 Geist uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={onProceed}
            >
              {proceedTitle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boolean;
