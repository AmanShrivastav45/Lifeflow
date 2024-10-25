import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/auth";
import { useParams, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const DonorNav = () => {
  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const recieverId = useParams().donorId || null;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileButtonOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-white p-3 flex items-center justify-center h-full rounded-[4px]"
      : "hover:text-white p-3 flex items-center justify-center h-full rounded-[4px] text-[#868686]";

  return (
    <div className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a] z-50">
      <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
        <div className="w-full h-full flex items-center justify-between text-md p-2">
          <div className="flex items-center">
            <div className="relative w-[60px] flex items-center mx-2">
              <NavLink to="/">
                <img src={logo} className="h-8" alt="logo" />
              </NavLink>
            </div>
            <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
              LIFEFLOW
            </h1>
            <div className="flex ml-8">
              <NavLink
                to={`/donor/${recieverId}/donations`}
                className={getNavLinkClass}
              >
                Donations
              </NavLink>
              <NavLink
                to={`/donor/${recieverId}/bloodbank`}
                className={getNavLinkClass}
              >
                Blood Bank
              </NavLink>
              <NavLink
                to={`/donor/${recieverId}/hospitals`}
                className={getNavLinkClass}
              >
                Hospitals
              </NavLink>
              <NavLink
                to={`/donor/${recieverId}/requests`}
                className={getNavLinkClass}
              >
                Requests
              </NavLink>
            </div>
          </div>
          <div className="flex relative justify-between space-x-4">
            <button onClick={toggleProfileButton}>
              <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
            </button>
            {isProfileButtonOpen && user ? (
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
                      {user?.firstName || "Unknown User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] hover:text-gray-400 w-full text-left"
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

export default DonorNav;
