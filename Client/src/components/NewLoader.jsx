import React from "react";

const NewLoader = () => {
  return (
    <div className="h-full w-full">
    <div
      style={{ zIndex: 15000 }}
      className="absolute inset-0 bg-black bg-opacity-95  w-full h-full flex items-center justify-center"
    >
      <svg
        width="300px"
        height="200px"
        viewBox="0 0 187.3 93.7"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <path
          stroke="#c026d3"
          id="outline"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
        />
        <path
          id="outline-bg"
          opacity="0.05"
          fill="none"
          stroke="#c026d3"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
        />
      </svg>
    </div>
    </div>
  );
};

export default NewLoader;
