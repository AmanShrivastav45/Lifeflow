import React, { useState } from "react";
import Navigation from "./Navigation.jsx";
import DropdownMenu from "../DropdownMenu.jsx";
import "../../fonts/stylesheet.css";
import LR from "../../data/LR.jsx";

const Learn = () => {
  const [selectedTopic, setSelectedTopic] = useState("Welcome");

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const renderContent = () => {
    switch (selectedTopic) {
      case "Logical Reasoning":
        return <LR/>;
      case "Quantitative Ability":
        return <p>This is the content for Quantitative Ability.</p>;
      case "Data Interpretation":
        return <p>This is the content for Data Interpretation.</p>;
      case "Analytical Ability":
        return <p>This is the content for Analytical Ability.</p>;
      case "Verbal Ability":
        return <p>This is the content for Verbal Ability.</p>;
      case "Arrays":
        return <p>This is the content for Arrays.</p>;
      case "Hashmaps":
        return <p>This is the content for Hashmaps.</p>;
      default:
        return <p>Select a topic to view the content.</p>;
    }
  };


  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <div className="w-full mt-20 xl:w-[1280px] 2xl:w-[1440px] flex">
        <div className="hidden lg:block h-screen lg:w-[25%] xl:w-[20%] flex-col text-[#868686] text-md p-3 overflow-y-auto">
          <ul className="space-y-2 pl-2 mt-2">
            <DropdownMenu
              title="Aptitude"
              topics={[
                "Logical Reasoning",
                "Quantitative Ability",
                "Data Interpretation",
                "Analytical Ability",
                "Verbal Ability",
              ]}
              onSelect={handleTopicSelect}
            />
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
            />
            <li className="cursor-pointer h-8 hover:text-white">Pattern Printing</li>
            <DropdownMenu
              title="Algorithms & Techniques"
              topics={[
                "Searching Techniques",
                "Sorting Techniques",
                "Recursion",
                "Backtracking",
                "Dynamic Programming",
                "Bit Manipulation",
                "Two Pointers",
                "Sliding Window",
                "Greedy Techniques",
              ]}
              onSelect={handleTopicSelect}
            />
            <DropdownMenu
              title="OOPs Concepts"
              topics={[
                "Quantitative Ability",
                "Data Interpretation",
                "Analytical Ability",
                "Verbal Ability",
              ]}
              onSelect={handleTopicSelect}
            />
            <li className="cursor-pointer h-8 hover:text-white">Database Management</li>
            <li className="cursor-pointer h-8 hover:text-white">Operating Systems</li>
            <li className="cursor-pointer h-8 hover:text-white">Computer Networks</li>
            <li className="cursor-pointer h-8 hover:text-white">Development Lifecycles</li>
            <li className="cursor-pointer h-8 hover:text-white">Computer Architecture</li>
          </ul>
        </div>
        <div className="p-4 w-full md:w-[75%] xl:w-[60%] text-white Geist px-6 overflow-y-auto hide-scrollbar">
          <h1 className="text-4xl mb-2 Geist-semibold">{selectedTopic}</h1>
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

export default Learn;
