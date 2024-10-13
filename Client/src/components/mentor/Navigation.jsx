import React, { useState, useEffect } from "react";
import "../../fonts/stylesheet.css";
import { RiArrowDropDownFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";

const Navigation = ({className}) => {
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-white p-3 flex items-center justify-center h-full rounded-[4px]"
      : "hover:text-white p-3 flex items-center justify-center h-full rounded-[4px] text-[#868686]";
  
  return (
    <div
      style={{ zIndex: "11001" }}
      className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]"
    >
      <div className="w-full xl:w-[1280px] 2xl:w-[1440px] px-3 flex flex-col">
        <div className="w-full h-full flex items-center justify-between text-md p-2">
          <div className="flex">
            <div className="relative w-[50px] flex items-center justify-start mx-4">
              <img src={logo} className="h-7" alt="logo" />
            </div>
            <NavLink exact to="/mentor/:mentorId" className={getNavLinkClass}>
              Overview
            </NavLink>
            <NavLink to="/mentor/:mentorId/:classId" className={getNavLinkClass}>
              Attendance
            </NavLink>
            <NavLink to="/practice" className={getNavLinkClass}>
              Assignments
            </NavLink>
            <NavLink to="/ide" className={getNavLinkClass}>
              Practicals
            </NavLink>
            <NavLink to="/coderoom" className={getNavLinkClass}>
              Results
            </NavLink>
            <NavLink to="/roadmaps" className={getNavLinkClass}>
              Resources
            </NavLink>
          </div>
          <div className="flex relative">
            <button onClick={toggleProfileButton}>
              <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[50%]"></div>
            </button>
            {isProfileButtonOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-[#1e1e1e] rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                style={{ right: "10px", top: "25px" }}
              >
                <div
                  className="text-[#68686f]"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div
                    className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] w-full text-left"
                    role="menuitem"
                  >
                    <span>User: </span>
                    <span className="Geist text-gray-300">
                      {user?.mentorName || "Unknown User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] hover:text-gray-400 w-full text-left"
                    role="menuitem"
                  >
                    Logout Coderoom
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
