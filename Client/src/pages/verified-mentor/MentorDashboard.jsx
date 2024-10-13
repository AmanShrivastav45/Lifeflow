import React, { useEffect, useState } from "react";
import axios from "axios";
import Attendance from "../../components/mentor/Attendance.jsx";
import Overview from "../../components/mentor/Overview.jsx";
import Assignments from "../../components/mentor/Assignments.jsx";
import Tests from "../../components/mentor/Tests.jsx";
import Results from "../../components/mentor/Results.jsx";
import Resources from "../../components/mentor/Resources.jsx";
import { useAuthStore } from "../../store/auth.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import NewLoader from "../../components/NewLoader.jsx";
import "../../fonts/stylesheet.css";

const MentorsDashboard = ({ selectedClass }) => {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [isLoadingg, setisLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("Overview");
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const mentor = val?._id || null;

  const handleLogout = () => {
    logout();
  };

  const handleOptionClick = (option) => {
    setSelectedTopic(option);
  };

  const getClassInfo = async (classId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/coderoom/auth/get-class/${classId}`,
        {
          params: { classId: classId },
        }
      );
      setClassInfo(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setisLoading(false);
    }, 3000);
    getClassInfo(classId);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [classId]);

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const truncateText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  // Render content based on the selected topic
  const renderContent = () => {
    switch (selectedTopic) {
      case "Attendance":
        return <Attendance />;
      case "Assignments":
        return <Assignments selectedClass={classId}/>;
      case "Tests":
        return <Tests selectedClass={classId}/>;
      case "Results":
        return <Results />;
      case "Resources":
        return <Resources selectedClass={classId}/>;
      default:
        return <Overview selectedClass={classId} />;
    }
  };

  return (
    <div className="bg-black w-full min-h-screen h-screen pt-24 flex flex-col items-center Geist">
      {/* Top Bar */}
      <div className="h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]">
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-[#868686] text-md p-2">
            <div className="flex px-6">
              {/* Navigation Buttons */}
              {[
                "Overview",
                "Attendance",
                "Assignments",
                "Tests",
                "Results",
                "Resources",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`p-3 mx-2 h-10 flex items-center justify-center rounded-[4px] ${
                    selectedTopic === option
                      ? "text-white bg-[#1e1e1e] border border-[#2a2a2a]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {/* Profile Button */}
            <div className="flex relative mr-6">
              <button onClick={toggleProfileButton}>
                <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[50%]"></div>
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
                      <span> User : </span>
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
              <Link to={`/mentor/${mentor}`}>
                <div className="h-8 bg-purple-700 text-white rounded-[5px] px-3 flex items-center justify-center ml-4">
                  Back to Home
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col justify-start p-6 pt-0">
        <h1 className="Geist text-4xl mb-4 font-semibold text-white ml-4">
          {selectedTopic}
        </h1>
        {renderContent()}
      </div>
      {isLoadingg && <NewLoader />}
    </div>
  );
};

export default MentorsDashboard;
