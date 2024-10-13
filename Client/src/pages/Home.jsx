import React, { useState, useEffect } from "react";
import "../fonts/stylesheet.css";
import { Link } from "react-router-dom";
import FloatingShape from "../style/FloatingShapes.jsx";
import Navigation from "../components/user/Navigation.jsx";
import { useAuthStore } from "../store/auth.js";
import logo from "../assets/logo.png";
import Loader from "../components/Loader.jsx";

const Home = () => {
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

  if (isLoading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <FloatingShape size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape size="w-48 h-48" top="70%" left="80%" delay={3} />
      <FloatingShape size="w-40 h-40" top="40%" left="-10%" delay={1} />

      <div
        style={{ zIndex: 10 }}
        className="flex items-start justify-center h-[25%] sm:h-[30%] w-full"
      ></div>
      <div
        style={{ zIndex: 10 }}
        className="h-[40%] relative w-full flex flex-col items-center justify-center gap-4"
      >
        <div className="absolute opacity-50">
          <img style={{ zIndex: -1 }} src={logo} className="h-96" />
        </div>
        <h1
          style={{ zIndex: 11 }}
          className="Apercu-Bold text-white text-center text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
        >
          LIFEFLOW
          <p
            className={`md:text-base lg:text-xl px-8 sm:px-2 mt-3 text-sm Geist text-center text-gray-300 fade-text ${
              fade ? "" : "fade-out"
            }`}
          >
            {quotes[quoteIndex]}
          </p>
        </h1>
        <div style={{ zIndex: 11 }} className="flex gap-8">
          <Link
            to="/signup"
            className="h-12 w-[125px] bg-[#1e1e1e] border border-[#3a3a3a] text-gray-100 flex items-center justify-center Geist px-2 text-xl rounded-[7px]"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="h-12 w-[125px] text-white flex border border-red-900 items-center justify-center Geist px-2 text-xl bg-red-600 rounded-[7px]"
          >
            Try
          </Link>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Home;
