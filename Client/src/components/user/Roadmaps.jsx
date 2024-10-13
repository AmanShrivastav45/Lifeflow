import React, { useState, useEffect } from "react";
import Navigation from "./Navigation.jsx";
import DropdownMenu from "../DropdownMenu.jsx";
import "../../fonts/stylesheet.css";
import PDFviewer from "../../data/PDFViewer.jsx";

const Roadmaps = () => {
  const [selectedTopic, setSelectedTopic] = useState(
    "Data Structures and Algorithms"
  );
  const [email, setEmail] = useState("");
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const renderContent = () => {
    switch (selectedTopic) {
      case "Frontend Developer":
        return <PDFviewer pdfUrl={"/content/frontend.pdf"} />;
      case "User Experience Designer":
        return <PDFviewer pdfUrl={"/content/ux-design.pdf"} />;
      case "Backend Developer":
        return <PDFviewer pdfUrl={"/content/backend.pdf"} />;
      case "Data Analyst":
        return <PDFviewer pdfUrl={"/content/data-analyst.pdf"} />;
      case "DevOps Engineer":
        return <PDFviewer pdfUrl={"/content/devops.pdf"} />;
      case "AI and Data Scientist":
        return <PDFviewer pdfUrl={"/content/ai-data-scientist.pdf"} />;
      case "Android Developer":
        return <PDFviewer pdfUrl={"/content/android.pdf"} />;
      case "Quality Assuarance":
        return <PDFviewer pdfUrl={"/content/qa.pdf"} />;
      case "Javascript":
        return <PDFviewer pdfUrl={"/content/javascript.pdf"} />;
      case "React":
        return <PDFviewer pdfUrl={"/content/react.pdf"} />;
      case "Angular":
        return <PDFviewer pdfUrl={"/content/angular.pdf"} />;
      case "Vue":
        return <PDFviewer pdfUrl={"/content/vue.pdf"} />;
      case "Node.Js":
        return <PDFviewer pdfUrl={"/content/nodejs.pdf"} />;
      case "Java":
        return <PDFviewer pdfUrl={"/content/java.pdf"} />;
      case "Spring Boot":
        return <PDFviewer pdfUrl={"/content/spring-boot.pdf"} />;
      case "Python":
        return <PDFviewer pdfUrl={"/content/python.pdf"} />;
      case "SQL":
        return <PDFviewer pdfUrl={"/content/sql.pdf"} />;
      case "Git & Github":
        return <PDFviewer pdfUrl={"/content/git-github.pdf"} />;
      default:
        return <PDFviewer pdfUrl={"/content/dsa.pdf"} />;
    }
  };
  return (
    <div className="Geist h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <div className="w-full mt-20 xl:w-[1280px] 2xl:w-[1440px] flex">
        <div className="hidden lg:block h-screen lg:w-[25%] xl:w-[20%] flex-col text-[#868686] text-md p-3 overflow-y-auto">
          <ul className="space-y-2 pl-2 mt-2">
            <li
              className={`cursor-pointer h-8 hover:text-white ${
                selectedTopic === "Data Structures and Algorithms"
                  ? "text-white"
                  : "text-[#868686]"
              }`}
              onClick={() =>
                handleTopicSelect("Data Structures and Algorithms")
              }
            >
              Data Structures
            </li>
            <DropdownMenu
              title="Role based Roadmaps"
              topics={[
                "Frontend Developer",
                "User Experience Designer",
                "Backend Developer",
                "Data Analyst",
                "DevOps Engineer",
                "AI and Data Scientist",
                "Android Developer",
                "Quality Assuarance",
              ]}
              onSelect={handleTopicSelect}
              selectedTopic={selectedTopic}
            />
            <DropdownMenu
              title="Skill based Roadmaps"
              topics={[
                "Javascript",
                "React",
                "Angular",
                "Vue",
                "Node.Js",
                "Java",
                "Spring Boot",
                "Python",
                "SQL",
                "Git & Github",
              ]}
              onSelect={handleTopicSelect}
              selectedTopic={selectedTopic}
            />
          </ul>
        </div>
        <div className="p-4 w-full md:w-[75%] xl:w-[60%] text-white Geist px-6 overflow-hidden hide-scrollbar">
          <h1 className="text-4xl mb-4 Geist-semibold">{selectedTopic}</h1>
          {renderContent()}
          <div className="Geist text-sm text-center w-full mt-2">
            This Roadmaps are from{" "}
            <a className="text-blue-500" href="https://roadmap.sh/">
              Roadmaps.sh
            </a>{" "}
            and the whole credit goes to them.
          </div>
        </div>
        <div className="hidden xl:block xl:w-[20%] h-full text-md Geist-semibold p-3 text-white overflow-y-auto">
          <ul className="space-y-2">
            <div className="h-[280px] flex flex-col items-center justify-center w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[6px] p-3 px-4">
              <h1 className="text-xl w-full text-left Geist-semibold text-white ml-2 mb-2">
                Subscribe for roadmaps
              </h1>
              <p className="text-sm Geist  text-start text-gray-400 mb-4 ml-1">
                Get notified about new job postings that match your skills and
                interests so you can stay on top of your job search.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="Geist border w-full border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 px-4 outline-none h-10 text-base text-white rounded-[7px] flex items-center justify-center"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <button
                type="submit"
                className="h-10 mt-4 w-full text-base Geist-semibold bg-gray-100 text-[#1e1e1e] rounded-[7px] flex items-center justify-center"
              >
                Subscribe
              </button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
