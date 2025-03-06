import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";

const Donation = ({
  city,
  bloodGroup,
  address,
  pincode,
  donationType,
  date,
  onClick,
  phone,
  postedBy
}) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });
  const year = formattedDate.getFullYear();

  let donationColor;
  let initialColor;
  if (donationType === "plasma") {
    initialColor = "green-500"
    donationColor = "bg-green-200";
  } else if (donationType === "blood") {
    initialColor = "red-600"
    donationColor = "bg-red-200";
  } else {
    initialColor = "orange-600"
    donationColor = "bg-orange-200";
  }

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-[5px] p-4 shadow-sm mb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex">
          <div
            className={`h-10 w-10 flex border  border-${initialColor} font-semibold text-${initialColor} items-center justify-center ${donationColor} rounded-[50%] mr-4`}
          >
            {bloodGroup}
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-xs text-gray-500">
              {donationType.toUpperCase()}
            </h2>
            <h3 className="text-lg font-medium">{address.charAt(0).toUpperCase() + address.slice(1).toLowerCase()}, {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <button
            className="px-2 py-0.5 rounded-[5px] bg-red-500 text-white flex items-center justify-center text-sm"
            onClick={onClick}
          >
            Request
          </button>
        </div>
      </div>
      <div className="flex gap-3 mt-3 font-medium text-xs">
        <p className=" px-2 p-1 text-blue-700 flex items-center justify-center border border-blue-600 bg-blue-100 rounded-[5px]">
          <span className="">{city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}</span>
        </p>
        <p className=" px-2 p-1 text-blue-700 flex items-center justify-center border border-blue-600 bg-blue-100 rounded-[5px]">
          <span className="">{phone}</span>
        </p>
        <p className=" px-2 p-1 text-blue-700 flex items-center justify-center border border-blue-600 bg-blue-100 rounded-[5px]">
          <span className="mr-1 mb-0.5">
            <IoLocationSharp />
          </span>
          {pincode}
          {}
        </p>
        <p className=" px-2 p-1 text-blue-700 flex items-center justify-center border border-blue-600 bg-blue-100 rounded-[5px]">
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
