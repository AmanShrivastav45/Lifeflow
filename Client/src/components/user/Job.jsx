import React from 'react';
import { Link } from 'react-router-dom';
import { MdAccessTimeFilled } from 'react-icons/md';
import { IoLocationSharp } from 'react-icons/io5';
import { FaCalendar } from 'react-icons/fa';

const Job = ({
  companyImage,
  companyName,
  jobPosition,
  jobType,
  location,
  postedTime,
  jobDescription,
  applyLink,
}) => {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] h-[280px] mb-6 overflow-hidden shadow-md rounded-[10px] p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <div className="h-16 w-16 bg-orange-600 rounded-[50%] mr-4"></div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-md text-gray-400">{companyName}</h2>
            <h3 className="text-xl font-semibold">{jobPosition}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Link
            to={applyLink}
            className="h-10 w-[100px] rounded-[5px] bg-purple-600 flex items-center justify-center font-semibold"
          >
            Apply
          </Link>
        </div>
      </div>
      <div className="flex gap-3">
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="mr-2">
            <MdAccessTimeFilled />
          </span>
          {jobType}
        </p>
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="mr-1">
            <IoLocationSharp />
          </span>
          {location}
        </p>
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center  px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="mr-2">
            <FaCalendar />
          </span>
          {postedTime}
        </p>
      </div>
      <p className="text-md line-clamp-4 my-4 Geist text-gray-400">{jobDescription}</p>
    </div>
  );
};

export default Job;