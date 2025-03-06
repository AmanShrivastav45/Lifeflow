import React from "react";
import logo from "../../assets/logo.png";

const UserType = () => {
  return (
    <div className="w-full flex items-center justify-start flex-col h-full">
      <div className="w-full sm:hidden flex items-center justify-center my-6">
        <img src={logo} className="h-12 w-12" />
      </div>

      <div className="w-[360px] sm:w-[380px] bg-white rounded-[8px] shadow-xl border border-gray-300 p-6 py-8 sm:mt-10">
        <h1 className="my-6 mb-4 text-center sm:mt-0 text-xl font-semibold text-black">
          How Would You Like to Proceed?
        </h1>
        <div style={{ zIndex: 1001 }} className="w-full flex justify-center">
          <button
            type="submit"
            className="h-9 w-[45%] mr-1 text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
          >
            Reciever
          </button>
          <button
            type="submit"
            className="h-9 w-[45%] ml-1 text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
          >
            Donor
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserType;
