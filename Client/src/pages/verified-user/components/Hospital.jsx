import React from "react";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";

const Hospital = ({ name, address, city, bloodGroup, distance }) => {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] h-[200px] mb-6 overflow-hidden shadow-md rounded-[10px] p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <div className="h-16 w-16 bg-orange-600 rounded-[50%] mr-4"></div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-md text-gray-400">{city}</h2>
            <div className="flex items-center">
              <h3 className="text-xl font-semibold">{name}</h3>
              <div className="h-2 w-2 bg-green-600 rounded-[50%] ml-2"></div><span className="ml-1 Geist text-green-500">Live</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Link
            to={`/hospitals/${name}`}
            className="h-10 w-[100px] rounded-[5px] bg-purple-600 flex items-center justify-center font-semibold"
          >
            View
          </Link>
        </div>
      </div>
      <div className="flex gap-3 flex-col items-start">
        <p className="text-sm flex items-center  px-2 justify-center">
          <span className="mr-3">
            <IoLocationSharp />
          </span>
          {address}
        </p>
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="mr-2">
            <MdAccessTimeFilled />
          </span>
          {distance} away
        </p>
      </div>
    </div>
  );
};

export default Hospital;
