import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.js";
import { useParams, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const receiverId = JSON.parse(localStorage.getItem("user"))
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileButton = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => logout();

  const navItems = [
    { path: `/receiver/${receiverId._id}`, label: "Blood Bank" },
    { path: `/user/${receiverId._id}/hospitals`, label: "Hospitals" },
  ];

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-gray-700 p-3 flex items-center justify-center h-full rounded-[4px]"
      : "hover:text-gray-800 p-3 flex items-center justify-center h-full rounded-[4px] text-[#868686]";

  return (
    <div className="fixed top-0 w-full h-14 flex justify-center bg-white border-b border-gray-300">
      <div className="w-full xl:w-[1280px] flex flex-col">
        <div className="w-full h-full flex items-center justify-between text-sm p-2">
          <div className="flex items-center">
            <div className="relative flex items-center mx-2">
              <NavLink to="/user/${receiverId}">
                <img src={logo} className="h-6 mb-1" alt="logo" />
              </NavLink>
            </div>
            <div className="flex ml-4">
              <NavLink
                to={`/receiver/${receiverId._id}`}
                className={getNavLinkClass}
              >
                Blood Bank
              </NavLink>
              <NavLink
                to={`/receiver/${receiverId._id}/hospitals`}
                className={getNavLinkClass}
              >
                Hospitals
              </NavLink>
            </div>
          </div>
          <div className="flex relative justify-between space-x-4">
            <button onClick={toggleProfileButton}>
              <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
            </button>
            {isProfileOpen && user ? (
              <div
                className="absolute right-0 top-full mt-1 w-48 bg-white shadow-xl border border-gray-300 rounded-[5px]"
                style={{ right: "10px", top: "25px" }}
              >
                <div
                  className="text-gray-600"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div
                    className="block px-4 py-3 text-xs hover:bg-gray-100 w-full hover:text-gray-800 text-left"
                    role="menuitem"
                  >
                    <span>User: </span>
                    <span>{user?.email || "Unknown User"}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-3 text-xs hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                    role="menuitem"
                  >
                    Logout Lifeflow
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
