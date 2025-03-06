import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Landing = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const quotes = [
    "Blood donation is the gift of life. Your simple act can save lives and inspire hope.",
    "Every blood donor is a hero, silently saving lives and giving patients another chance at life.",
    "One donation can save three lives. It's a small act of kindness with massive impact.",
    "Donating blood costs nothing, but it can mean everything to someone who desperately needs it.",
    "Blood donors are lifesavers. Their generosity helps hospitals, patients, and families in times of crisis.",
  ];

  useEffect(() => {
    // Simulate loading time (you can remove this if the content is fetched from API)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Set a 3-second loader

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="h-10 w-full fixed top-0 flex items-center justify-end">
        <Link
          to={`/about`}
          className="px-4 py-3 text-sm hover:text-gray-800 text-left mt-8 mr-10"
          role="menuitem"
        >About Us
        </Link>
      </div>
      <div className="flex flex-col items-center mb-10">
        <img src={logo} alt="Lifeflow Logo" className="w-32 mb-4" />
        <h1 className="text-4xl font-bold text-center text-red-600">
          Welcome to Lifeflow
        </h1>
        <p className="text-lg text-center text-gray-700 mt-2">
          Your contribution can make a difference.
        </p>
      </div>

      <div className="w-[60%] flex flex-col items-center justify-center p-6">
        <div
          className={`transition-opacity duration-1000 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text- italic text-center text-gray-600">
            {quotes[quoteIndex]}
          </p>
        </div>
      </div>

      <div>
        <Link to="/about" className="mt-6">
          <button className="bg-red-600 mr-2 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-700 transition duration-300">
            About us
          </button>
        </Link>
        <Link to="/signup" className="mt-6">
          <button className="bg-red-600 text-white ml-2 px-6 py-2 rounded-lg shadow-lg hover:bg-red-700 transition duration-300">
            Signup Now
          </button>
        </Link>
      </div>

      <footer className="absolute bottom-4 text-gray-600">
        <p>&copy; {new Date().getFullYear()} Lifeflow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
