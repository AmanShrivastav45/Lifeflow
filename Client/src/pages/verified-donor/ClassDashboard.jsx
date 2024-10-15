import React, { useEffect, useState } from "react";
import "../../fonts/stylesheet.css";
import DropdownMenu from "../../components/DropdownMenu";
import logo from "../../assets/logo.png";
import { NavLink, Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import Lectures from "./components/Lectures";
import Assignments from "./components/Assignments";
import Practicals from "./components/Practicals";
import Tests from "./components/Tests";
import Results from "./components/Results";
import Resources from "./components/Resources.jsx";
import Overview from "./components/Overview.jsx";

const ClassDashboard = () => {
  const classId = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Welcome");
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const userId = val?._id || null;

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  useEffect(() => {
    console.log(classId);
  }, [])

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

  const renderContent = () => {
    switch (selectedTopic) {
      case "Lectures":
        return <Lectures />;
      case "Assignments":
        return <Assignments />;
      case "Practicals":
        return <Practicals />;
      case "Tests":
        return <Tests classId={classId}/>;
      case "Results":
        return <Results />;
      case "Resources":
        return <Resources classId={classId} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="Geist h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-black">
      <div
        style={{ zIndex: "11001" }}
        className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]"
      >
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-md p-2">
            <div className="flex">
              <div className="relative w-[60px] flex items-center mx-4">
                <NavLink exact to="/" className={`getNavLinkClass w-full`}>
                  <img src={logo} className="h-7" alt="logo" />
                </NavLink>
              </div>
            </div>
            <div className="flex relative">
              <button
                onClick={handleLogout}
                className="px-4 mr-4 bg-purple-600 py-2 text-md hover:bg-purple-500 rounded-[7px]"
                role="menuitem"
              >
                Logout
              </button>
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
                        {user?.userName || "Unknown User"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-20 xl:w-[1280px] 2xl:w-[1440px] flex">
        <div className="hidden lg:block h-screen lg:w-[25%] xl:w-[15%] flex-col text-[#868686] text-md p-3 overflow-y-auto">
          <ul className="space-y-2 pl-2 mt-2">
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Overview" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Overview")}
            >
              Overview
            </li>
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Lectures" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Lectures")}
            >
              Lectures
            </li>
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Assignments"
                  ? "text-white"
                  : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Assignments")}
            >
              Assignments
            </li>
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Practicals" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Practicals")}
            >
              Practicals
            </li>
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Tests" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Tests")}
            >
              Tests
            </li>
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Results" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Results")}
            >
              Results
            </li>
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Resources" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Resources")}
            >
              Resources
            </li>
          </ul>
        </div>
        <div className="p-4 w-full md:w-[75%] xl:w-[85%] text-white Geist px-6 overflow-y-auto hide-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ClassDashboard;
