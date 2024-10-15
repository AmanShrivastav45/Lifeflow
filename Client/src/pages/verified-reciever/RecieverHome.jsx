import React, { useEffect, useState } from "react";
import NewLoader from "../../components/NewLoader.jsx";
import "../../fonts/stylesheet.css";
import Navigation from "../../components/reciever/Navigation.jsx";
import logo from "../../assets/logo.png";
import FloatingShape from "../../style/FloatingShapes.jsx";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

const RecieverHome = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const quotes = [
    "Blood donation is the gift of life. Your simple act can save lives and inspire hope.",
    "Every blood donor is a hero, silently saving lives and giving patients another chance at life.",
    "One donation can save three lives. It's a small act of kindness with massive impact.",
    "Donating blood costs nothing, but it can mean everything to someone who desperately needs it.",
    "Blood donors are lifesavers. Their generosity helps hospitals, patients, and families in times of crisis.",
  ];

  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const recieverId = useParams().recieverId || null;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);

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

  useEffect(() => {
    // Simulate loading time (you can remove this if the content is fetched from API)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Set a 3-second loader

    // Quote change logic
    const quoteInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(true);
      }, 1000);
    }, 5000);

    return () => {
      clearInterval(quoteInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-black w-full overflow-hidden h-screen relative flex flex-col items-center justify-center Geist">
      <div
        style={{ zIndex: "1000" }}
        className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]"
      >
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-md p-2">
            <div className="flex items-center">
              <div className="relative w-[60px] flex items-center mx-2">
                <NavLink to="/" className={getNavLinkClass}>
                  <img src={logo} className="h-8" alt="logo" />
                </NavLink>
              </div>
              <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
                MED-EXPERT
              </h1>
              <div className="flex ml-8">
                <NavLink
                  to={`/user/${recieverId}/bloodbank`}
                  className={getNavLinkClass}
                >
                  Blood Bank
                </NavLink>
                <NavLink
                  to={`/user/${recieverId}/hospitals`}
                  className={getNavLinkClass}
                >
                  Hospitals
                </NavLink>
              </div>
            </div>
            <div className="flex relative justify-between space-x-4">
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
                      Logout Med-Expert
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <FloatingShape size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape size="w-48 h-48" top="70%" left="80%" delay={3} />
      <FloatingShape size="w-40 h-40" top="40%" left="-10%" delay={1} />

      <img src={logo} className="h-72  mb-8 opacity-50" />
      <p
        className={`md:text-base lg:text-xl px-8 sm:px-2 mt-3 text-sm Geist text-center text-gray-300 fade-text ${
          fade ? "" : "fade-out"
        }`}
      >
        {quotes[quoteIndex]}
      </p>
      {isLoading && <NewLoader />}
    </div>
  );
};

export default RecieverHome;
