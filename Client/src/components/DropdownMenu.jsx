import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const DropdownMenu = ({ title, topics, onSelect, selectedTopic }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={`cursor-pointer ${isOpen ? "" : "h-8"}`}>
      <div onClick={toggleMenu} className="flex items-center justify-between">
        <span className="flex hover:text-white">{title}</span>
        <RiArrowDropDownLine className={`text-2xl ${isOpen ? "rotate" : ""}`} />
      </div>
      {isOpen && (
        <ul className="space-y-1 my-4 border-l border-[#2a2a2a]  ">
          {topics.map((topic, index) => (
            <li
              key={index}
              className={`cursor-pointer h-8 pl-4 hover:text-white  ${
                selectedTopic === topic ? "text-white" : "text-[#868686]"
              }`}
              onClick={() => onSelect(topic)}
            >
              {topic}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default DropdownMenu;
