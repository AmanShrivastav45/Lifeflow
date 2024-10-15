import React from "react";
import { Link } from "react-router-dom";
import { MdAccessTimeFilled } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";

const Donation = ({
  city,
  bloodGroup,
  address,
  pincode,
  donationType,
  date,
  postedBy,
  onClick, // Add the onClick prop
}) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });
  const year = formattedDate.getFullYear();

  let donationColor;
  if (donationType === "plasma") {
    donationColor = "bg-green-700"; // plasma color
  } else if (donationType === "blood") {
    donationColor = "bg-red-600"; // blood color
  } else {
    donationColor = "bg-orange-600"; // default color
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] h-[190px] mb-6 overflow-hidden shadow-md rounded-[10px] p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <div
            className={`h-14 w-14 flex text-xl Geist-semibold items-center justify-center ${donationColor} rounded-[50%] mr-4`}
          >
            {bloodGroup}
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-md text-gray-400">
              {donationType.toUpperCase()}
            </h2>
            <h3 className="text-xl font-semibold">{city}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <button
            className="h-10 w-[100px] rounded-[5px] bg-purple-600 flex items-center justify-center "
            onClick={onClick} // Call the onClick function
          >
            Request
          </button>
        </div>
      </div>
      <p className="text-md line-clamp-4 my-4 Geist text-gray-400">{address}</p>
      <div className="flex gap-3">
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="">
            {postedBy[0].toUpperCase() + postedBy.slice(1)}
          </span>
        </p>
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="mr-1">
            <IoLocationSharp />
          </span>
          {pincode}
          {}
        </p>
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="mr-2">
            <FaCalendar />
          </span>
          {`${day} ${month}, ${year}`}
        </p>
      </div>
    </div>
  );
};

export default Donation;
