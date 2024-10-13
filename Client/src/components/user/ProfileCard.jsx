import React from "react";
import {Link} from "react-router-dom";
import "../../fonts/stylesheet.css";

const ProfileCard = ({ username, profilePicture, profileUrl }) => {
  if (!username) return null;

  return (
    <Link to={profileUrl} className="h-[200px] md:h-[280px] w-[140px] md:w-[240px] bg-[#09090b] rounded-[7px] flex flex-col border-2 border-[#1a1a1a] relative">
      <div className="relative h-[144px] md:h-[180px] w-full rounded-t-[6px] flex items-center justify-center">
        <div
          style={{ zIndex: 10 }}
          className="absolute top-0 bg-[#2a2a2a] rounded-t-md h-[72px] md:h-[90px] w-full"
        ></div>
        <div
          style={{
            zIndex: 11,
            backgroundImage: `url(${profilePicture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute h-[80px] md:h-[140px] w-[80px] md:w-[140px] rounded-full bg-blue-500 border-2 border-white"
        ></div>
      </div>
      <div className="text-center">
        <h1 className="Geist-semibold text-white px-2 text-sm md:text-lg">
          {username}
        </h1>
        <p className="text-gray-400 text-sm mt-1 px-3">Batch of 2025</p>
      </div>
    </Link>
  );
};

export default ProfileCard;
