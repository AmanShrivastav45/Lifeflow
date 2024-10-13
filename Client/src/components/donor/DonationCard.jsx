import React from "react";
import moment from "moment"; // For date formatting
import { Link } from "react-router-dom";

const DonationCard = ({
  donationType,
  bloodGroup,
  address,
  city,
  pincode,
  phone,
  date,
  description,
  id,
}) => {
  return (
    <div className="Geist bg-[#1a1a1a] border border-[#1e1e1e] hover:bg-[#2a2a2a] transition-all shadow-[#121212] hover:shadow-md h-[230px] w-full rounded-[6px] p-6 flex flex-col justify-between">
      <div className="flex flex-col h-full w-full overflow-hidden mb-4">
        <div className="h-14 w-full flex items-center justify-start mb-2">
          <div className="text-yellow-500 h-12 w-12 rounded-full bg-[#1e1e1e] border border-[#3a3a3a] Geist text-xl flex items-center justify-center">
            {bloodGroup || "N/A"}
          </div>
          <h1 className="Geist text-xl ml-3 text-white flex items-center h-full">
            {donationType.toUpperCase() || "Donation Type"}
          </h1>
        </div>
        <p className="text-sm text-gray-500">{}</p>
      </div>
      <div className="flex flex-col mb-2">
        <div className="text-sm text-gray-400">Address: {address || "N/A"}</div>
        <div className="text-sm text-gray-400">City: {city || "N/A"}</div>
        <div className="text-sm text-gray-400">Pincode: {pincode || "N/A"}</div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <Link
          to={`/user/donor/${id}`} // Adjust the link as needed for your routing
          className="px-3 bg-green-700 text-white rounded-[5px] py-1"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default DonationCard;
