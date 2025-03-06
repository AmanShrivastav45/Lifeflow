import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="p-6 max-h-screen overflow-y-auto hide-scrollbar relative">
      <div style={{zIndex: 100}} className="h-10 w-full top-0 absolute flex items-center justify-end">
        <Link
          to={`/`}
          className="px-4 py-3 tex-black hover:bg-gray-100 hover:text-gray-800 text-left mt-10 mr-10"
        >
          Back
        </Link>
      </div>
      <div className="p-6 h-full  max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-6">About Lifeflow</h1>

        <p className="text-lg text-gray-500 text-center mb-6">
          Lifeflow is dedicated to bridging the gap between blood donors and
          recipients, empowering communities with a streamlined, supportive
          system to save lives.
        </p>

        <section className="my-10">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg leading-7 text-gray-600">
            Lifeflow’s mission is to make blood donation accessible to all,
            ensuring requests are met efficiently and quickly. We strive to be a
            vital lifeline for those in critical need.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-lg leading-7 text-gray-600 mb-4">
            Lifeflow connects users with nearby hospitals holding specific blood
            units, allowing easy request submissions. Donors and recipients can
            interact directly to fulfill requests swiftly and transparently.
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-500">
            <li>Locate hospitals with available blood supplies</li>
            <li>Request specific blood types directly</li>
            <li>Real-time request tracking</li>
            <li>Direct connections between donors and hospitals</li>
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <p className="text-lg leading-7 text-gray-600">
            Compassion, transparency, and community define Lifeflow’s values.
            Together, we create a responsive support system that fosters trust
            and support.
          </p>
          <ul className="list-disc list-inside ml-4 mt-4 text-gray-500">
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
