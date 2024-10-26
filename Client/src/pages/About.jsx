import React from "react";
import Navigation from "../components/reciever/Navigation.jsx";

const About = () => {
  return (
    <div className="h-screen Geist relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
         <Navigation />
      <div className="max-w-4xl mx-auto mt-24">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-6">
          About Lifeflow
        </h1>
        
        <p className="text-lg text-gray-300 text-center mb-6">
          Lifeflow is dedicated to bridging the gap between blood donors and recipients, empowering communities with a streamlined, supportive system to save lives.
        </p>

        <section className="my-10">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            Our Mission
          </h2>
          <p className="text-lg leading-7 text-gray-400">
            Lifeflow’s mission is to make blood donation accessible to all, ensuring requests are met efficiently and quickly. We strive to be a vital lifeline for those in critical need.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            How It Works
          </h2>
          <p className="text-lg leading-7 text-gray-400 mb-4">
            Lifeflow connects users with nearby hospitals holding specific blood units, allowing easy request submissions. Donors and recipients can interact directly to fulfill requests swiftly and transparently.
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>Locate hospitals with available blood supplies</li>
            <li>Request specific blood types directly</li>
            <li>Real-time request tracking</li>
            <li>Direct connections between donors and hospitals</li>
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            Our Values
          </h2>
          <p className="text-lg leading-7 text-gray-400">
            Compassion, transparency, and community define Lifeflow’s values. Together, we create a responsive support system that fosters trust and support.
          </p>
          <ul className="list-disc list-inside ml-4 mt-4 text-gray-300">
            <li>Compassion: Prioritizing the well-being of every user</li>
            <li>Transparency: Clear processes to build trust</li>
            <li>Community: Fostering a supportive, collaborative network</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
