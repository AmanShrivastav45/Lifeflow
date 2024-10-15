import React from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { MdAccessTimeFilled } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";

const RequestDonation = ({ onCancel, onSuccess, donationDetails }) => {
  const formattedDate = new Date(donationDetails.createdAt);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });
  const year = formattedDate.getFullYear();

  let donationColor;
  if (donationDetails.donationType === "plasma") {
    donationColor = "bg-green-700"; // plasma color
  } else if (donationDetails.donationType === "blood") {
    donationColor = "bg-red-600"; // blood color
  } else {
    donationColor = "bg-orange-600"; // default color
  }
  return (
    <div
      style={{ zIndex: 10000 }}
      className="absolute top-0 bg-black bg-opacity-90 inset-0 left-0 h-screen w-full flex items-center justify-center"
    >
      <div className="relative rounded-[7px] w-[95%] md:w-[420px] bg-[#141414] border border-[#2a2a2a] p-3 px-4">
        <button
          style={{ zIndex: 10001 }}
          onClick={onCancel}
          className="text-2xl absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition duration-200"
        >
          <IoClose />
        </button>
        <div className="w-full h-full flex flex-col items-center justify-center text-white">
          <div
            className={`h-[160px] w-full ${donationColor} relative rounded-[5px] flex flex-col items-center justify-center`}
          >
            <div className={`text-6xl Geist-semibold`}>
              {donationDetails.bloodGroup}ve
            </div>
            <div className={`text-lg Geist`}>
              {donationDetails.donationType.toUpperCase()}
            </div>
          </div>
          <ul className="text-md my-4 w-full">
            <div className="flex">
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-xl font-semibold">
                  {donationDetails.city},{" "}
                  <span className="text-lg">{donationDetails.pincode}</span>
                </h3>
                <h3 className="text-sm text-gray-300 Geist">
                  {donationDetails.address}
                </h3>

              </div>
            </div>
            <div className="flex gap-3 mt-3 items-center justify-between">
              <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
                <span className="">
                  Posted By: {donationDetails.postedBy[0].toUpperCase() +
                    donationDetails.postedBy.slice(1)}
                </span>
              </p>
              <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
                <span className="mr-1">
                  <IoLocationSharp />
                </span>
                {donationDetails.pincode}
              </p>
              <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
                <span className="mr-2">
                  <FaCalendar />
                </span>
                {`${day} ${month}, ${year}`}
              </p>
            </div>
          </ul>
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-600 w-[50%] h-12 mr-2 text-white p-2 rounded hover:bg-red-700 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSuccess}
              className="bg-blue-600 w-[50%] h-12 ml-2 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDonation;
