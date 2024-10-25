import React, { useState } from "react";
import axios from "axios";
import "../../fonts/stylesheet.css";
import { NavLink, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";
import toast from "react-hot-toast";
import BloodBank from "./BloodBank";

const HospitalHome = () => {
  const { user, logout } = useAuthStore();
  const hospitalId = useParams().hospitalId;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("BloodBank");

  const handleLogout = () => {
    logout();
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const handleUpdateData = async () => {
    // Your update logic here
  };

  // Render the selected component
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "BloodBank":
        return <BloodBank />;
      case "Requests":
        return <>sdfafa</>;
      default:
        return <BloodBank />;
    }
  };

  return (
    <div className="h-screen pt-24 relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <div className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a] z-10">
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-md p-2">
            <div className="flex items-center w-[20%]">
              <div className="relative w-[40px] flex items-center mx-2">
                <NavLink to="/">
                  <img src={logo} className="h-8" alt="logo" />
                </NavLink>
              </div>
              <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
                LIFEFLOW
              </h1>
            </div>
            <h1 className="text-white text-xl Geist">
              {user?.name || "Unknown"}
            </h1>
            <div className="flex relative justify-end space-x-4 w-[20%]">
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[50%]"></div>
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
                      className=" block px-4 py-3 text-sm hover:bg-[#1e1e1e] w-full text-left"
                      role="menuitem"
                    >
                      <span>Hospital: </span>
                      <span className="Geist text-gray-300">
                        {user?.name || "Unknown"}
                      </span>
                    </div>
                    <button
                      className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] hover:text-gray-400 w-full text-left"
                      role="menuitem"
                      onClick={handleLogout}
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
      <div className="flex w-full xl:w-[1280px] 2xl:w-[1440px] justify-start px-4 mb-4 gap-6 Geist text-white">
        <button
          className={`px-4 py-2 w-[120px] border border-[#2e2e2e] rounded-md ${
            selectedComponent === "BloodBank" ? "bg-[#3a3a3a]" : "bg-[#212121]"
          }`}
          onClick={() => setSelectedComponent("BloodBank")}
        >
          Blood Bank
        </button>
        <button
          className={`px-4 py-2 w-[120px] border border-[#2e2e2e] rounded-md ${
            selectedComponent === "Requests" ? "bg-[#3a3a3a]" : "bg-[#212121]"
          }`}
          onClick={() => setSelectedComponent("Requests")}
        >
          Requests
        </button>
      </div>
      {renderSelectedComponent()}
    </div>
  );
};

export default HospitalHome;
