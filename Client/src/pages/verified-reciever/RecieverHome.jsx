import React, { useEffect, useState } from "react";
import NewLoader from "../../components/NewLoader.jsx";
import "../../fonts/stylesheet.css";
import Navigation from "../../components/reciever/Navigation.jsx";
import logo from "../../assets/logo.png";
import FloatingShape from "../../style/FloatingShapes.jsx";

const RecieverHome = () => {
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

  return (
    <div className="bg-black w-full overflow-hidden h-screen relative flex flex-col items-center justify-center Geist">
      <Navigation />
      <FloatingShape size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape size="w-48 h-48" top="70%" left="80%" delay={3} />
      <FloatingShape size="w-40 h-40" top="40%" left="-10%" delay={1} />

      <img src={logo} className="h-72  mb-8 opacity-25" />
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
