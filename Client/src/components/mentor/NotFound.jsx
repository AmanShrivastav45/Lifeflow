import React from "react";
import nonotes from "../../assets/nonotes.png";

const NotFound = () => {
  return (
    <div className="z-0 Geist fixed top-0 left-0 flex items-center justify-center h-screen w-full  text-white">
      <div className="flex items-center  flex-col justify-center">
        <img src={nonotes} className="h-[150px] sm:h-[200px] opacity-25" />
        <div className="text-center mt-8">
          <h1>No Notes found!</h1>
          <h2>Click the <span className="Geist-semibold text-yellow-500">'Add'</span> button to note down your thoughts!</h2>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
