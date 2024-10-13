import React, { useState } from "react";
import "../../fonts/stylesheet.css";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";

const Navigation = () => {
  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const userId = val?._id || null;

  return (
    <div
      style={{ zIndex: "1000" }}
      className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]"
    >
      <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
        <div className="w-full h-full flex items-center justify-between text-md p-2">
          <div className="flex items-center">
            <div className="relative w-[40px] flex items-center mx-2">
              <NavLink exact to="/" className={`getNavLinkClass w-full`}>
                <img src={logo} className="h-8" alt="logo" />
              </NavLink>
            </div>
            <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
              LIFEFLOW
            </h1>
          </div>
          <div className="flex relative justify-between space-x-4">
            {userId ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="h-8 w-8 rounded-full bg-gradient-to-t from-purple-500 via-orange-400 to-blue-500 transition-all duration-100"
                >
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-md text-white rounded-[7px] bg-red-600 hover:bg-red-800 transition-all duration-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signup"
                  className="px-4 py-2 text-md text-white rounded-[7px] border border-transparent hover:bg-[#1e1e1e] hover:border-[#3a3a3a] transition-all duration-100"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-md text-white rounded-[7px] bg-red-600 hover:bg-red-800 transition-all duration-100"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;