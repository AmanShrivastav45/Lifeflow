import React, { useState, useEffect } from "react";
import Navigation from "./Navigation.jsx";
import DropdownMenu from "../DropdownMenu.jsx";
import "../../fonts/stylesheet.css";
import LR from "../../data/LR.jsx";
import Loader from "../Loader.jsx";
import Test from "../../data/Test.jsx";

const Practice = () => {
  const [selectedTopic, setSelectedTopic] = useState("Operating Systems");
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const renderContent = () => {
    switch (selectedTopic) {
      case "Logical Reasoning":
        return <LR />;
      case "Quantitative Ability":
        return <p>This is the content for Quantitative Ability.</p>;
      case "Data Interpretation":
        return <p>This is the content for Data Interpretation.</p>;
      case "Analytical Ability":
        return <p>This is the content for Analytical Ability.</p>;
      case "Verbal Ability":
        return <p>This is the content for Verbal Ability.</p>;
      case "Operating Systems":
        return <Test/>;
      case "Pattern Printing":
        return <p>This is the content for Pattern Printing.</p>;
      // Add more cases as needed
      default:
        return <Test/>;
    }
  };

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <div className="w-full mt-20 xl:w-[1280px] 2xl:w-[1440px] flex">
        <div className="hidden lg:block h-screen lg:w-[25%] xl:w-[20%] flex-col text-[#868686] text-md p-3 overflow-y-auto">
          <ul className="space-y-2 pl-2 mt-2">
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Operating Systems" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("Operating Systems")}
            >
              Operating Systems
            </li>
            <DropdownMenu
              title="Data Structures"
              topics={[
                "Arrays",
                "Hashmaps",
                "Strings",
                "Linked Lists",
                "Stacks and Queues",
                "Binary Trees",
                "Binary Search Trees",
                "Tries",
                "Graphs",
              ]}
              onSelect={handleTopicSelect}
              selectedTopic={selectedTopic}
            />
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "OOPs Concepts" ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => handleTopicSelect("OOPs Concepts")}
            >
              OOPs Concepts
            </li>
            <li className="cursor-pointer h-8 hover:text-white">Database Management</li>
            <li className="cursor-pointer h-8 hover:text-white">Computer Networks</li>
            <li className="cursor-pointer h-8 hover:text-white">Development Lifecycles</li>
            <li className="cursor-pointer h-8 hover:text-white">Computer Architecture</li>
          </ul>
        </div>
        <div className="p-4 w-full md:w-[75%] xl:w-[60%] text-white Geist px-6 overflow-y-auto hide-scrollbar">
          <h1 className="text-4xl mb-6 Geist-semibold">{selectedTopic}</h1>
          {renderContent()}
        </div>
        <div className="hidden xl:block xl:w-[20%] h-full text-md Geist-semibold p-3 text-white overflow-y-auto">
          <h1 className="text-lg mb-4">On this page</h1>
          <ul className="space-y-2">
            <li className="cursor-pointer text-[#868686]">Sample Link 1</li>
            <li className="cursor-pointer text-[#868686]">Sample Link 2</li>
            <li className="cursor-pointer text-[#868686]">Sample Link 3</li>
            <li className="cursor-pointer text-[#868686]">Sample Link 4</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Practice;
