import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import moment from "moment";
import { Link } from "react-router-dom";

const ClassCard = ({ title, date, content, mentor, id }) => {
  return (
    <Link to={`/mentor/${mentor}/${id}`} className="Geist bg-[#1a1a1a] border  border-[#1e1e1e] hover:bg-[#2a2a2a] transition-all shadow-[#121212] hover:shadow-md h-[180px] w-full rounded-[8px] p-6 py-3 flex flex-col justify-between">
      <div className="flex flex-col w-full overflow-hidden">
        <div className="h-8 w-full flex items-center justify-between mb-1">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[50%]"></div>
            <button>
              <h1 className="Geist text-base text-white ml-3">
                {title?.slice(0, 25)}
                {title.length > 25 ? <span>...</span> : <span></span>}
              </h1>
            </button>
          </div>
        </div>
        <p className=" text-start text-gray-400">{content}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#b8b8b8]">
          {moment(date).format("DD MMM, YYYY")}
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;