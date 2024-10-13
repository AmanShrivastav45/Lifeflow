import React, { useState, useRef } from "react";
import axios from "axios";
import CodeTemplates from "../../templates/CodeTemplate.js";
import Editor from "../Editor.jsx";
import ThemeTemplates from "../../templates/ThemeTemplate.js";
import "../../fonts/stylesheet.css";
import Navigation from "./Navigation.jsx";
import logo from "../../assets/logo.png";
import "../../fonts/stylesheet.css"

const IDE = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Your Output");
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(CodeTemplates.cpp);
  const [theme, setTheme] = useState("material-darker");

  const codeRef = useRef(code);
  const languageRef = useRef("cpp");
  const editorRef = useRef(null);
  const themeRef = useRef(theme);

  const clearCode = () => {
    const templateCode = CodeTemplates[languageRef.current];
    codeRef.current = templateCode;
    setCode(templateCode);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
  };

  const onLanguageChange = (event) => {
    event.preventDefault();
    const selectedLanguage = event.target.value;
    languageRef.current = selectedLanguage;
    const templateCode = CodeTemplates[selectedLanguage];
    setCode(templateCode);
    codeRef.current = templateCode;
  };

  const onThemeChange = (event) => {
    event.preventDefault();
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    themeRef.current = selectedTheme;
    // Update CodeMirror theme dynamically
    if (editorRef.current) {
      editorRef.current.setOption("theme", selectedTheme);
    }
    // Update CSS variable dynamically
    document.documentElement.style.setProperty(
      "--editor-background-color",
      ThemeTemplates[selectedTheme]
    );
  };

  const runCode = async () => {
    setIsLoading(true);
    const options = {
      method: "POST",
      url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": import.meta.env.VITE_ONECOMPILER_API,
        "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
      },
      data: {
        language: languageRef.current,
        files: [
          {
            name: `index.${languageRef.current}`,
            content: codeRef.current,
          },
        ],
        stdin: input,
      },
    };

    try {
      const response = await axios.request(options);
      let outputText = "";
      if (response.data.status === "success") {
        if (response.data.exception) {
          outputText = response.data.exception;
        } else {
          outputText = response.data.stdout;
        }
      } else {
        outputText = "Error occurred while running the code.";
      }
      setOutput(outputText);
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error occurred while running the code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <div
        className={`Geist mt-20 w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col xl:flex-row items-start`}
      >
        <div className="w-full xl:w-[65%] p-2 xl:p-4 flex justify-end flex-col items-end">
          <div className="h-16 xl:h-20 mb-2 w-full flex items-center justify-between">
            <div>
              <button className="Geist ml-2 text-2xl lg:text-2xl flex items-center text-gray-500 lg:my-2"></button>
            </div>
            <div>
              <select
                onChange={onThemeChange}
                value={theme}
                className="h-10 text-base Geist outline-none border-solid border border-[#3a3a3a] pl-2 rounded-[5px] w-[125px] md:w-[160px] lg:w-[220px] mr-4"
              >
                {Object.keys(ThemeTemplates).map((themeName) => (
                  <option key={themeName} value={themeName.toLowerCase()}>
                    {themeName}
                  </option>
                ))}
              </select>
              <select
                onChange={onLanguageChange}
                className="h-10 text-base Geist outline-none border-solid border border-[#3a3a3a] pl-2 rounded-[5px] w-[125px] md:w-[160px] lg:w-[220px] mr-4"
              >
                <option value="cpp">C++ GCC17</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java 17</option>
                <option value="python">Python 3.12</option>
                <option value="c">C GCC17</option>
              </select>
            </div>
          </div>
          <div className="h-[500px] sm:h-[640px] md:h-[680px] w-full flex lg:pr-4">
            <div className="h-full p-3 bg-[var(--editor-background-color)] border border-[#3a3a3a] rounded-[7px] w-full ">
              <Editor
                value={code}
                theme={theme}
                onCodeChange={handleCodeChange}
                editorRef={editorRef}
              />
            </div>
          </div>
        </div>
        <div className="w-full xl:w-[35%] p-2 pt-0 xl:pt-4 xl:p-4">
          <div className="h-16 xl:h-20 mb-2 w-full flex items-center justify-end xl:justify-start">
            <button
              onClick={clearCode}
              className="h-10 text-lg transition duration-200 ease-in-out hover:text-white bg-[white] hover:border-0 hover:bg-[#3a3a3a] Geist outline-none border-solid border border-[#3a3a3a] rounded-[5px] w-[100px] mr-4"
            >
              Clear
            </button>
            <button
              onClick={runCode}
              className="h-10 text-lg text-white transition duration-200 ease-in-out bg-[#1e1e1e] hover:text-white hover:bg-[#3a3a3a] Geist outline-none border-solid  rounded-[5px] w-[100px] mr-4"
            >
              Run
            </button>
          </div>
          <div className="h-[540px] Geist sm:h-[640px] md:h-[680px] w-full flex flex-col items-start xl:justify-between">
            <textarea
              id="input"
              placeholder="Enter your input here"
              onChange={(e) => setInput(e.target.value)}
              className="Geist p-3 Codemirror whitespace-pre-wrap resize-none overflow-y-auto text-md h-[180px] xl:h-[280px] w-full border border-[#2a2a2a] rounded-[5px] text-gray-300 bg-[#1e1e1e] mb-4 xl:mb-0"
            ></textarea>
            <div
              id="output"
              className="h-[320px] Geist text-md whitespace-pre-wrap overflow-y-auto leading-7 xl:h-[380px]  w-full border border-[#2a2a2a] rounded-[5px] text-gray-300 bg-[#1e1e1e] p-2"
            >
              {isLoading ? (
                <div className="loader-container p-0">
                  <div className="loader"></div>
                </div>
              ):(
                <div className="p-2 py-0 Geist text-md">{output}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDE;
