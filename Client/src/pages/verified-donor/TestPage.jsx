import React, { useState, useEffect } from "react";
import { IoIosArrowForward, IoIosArrowBack, IoMdAddCircle } from "react-icons/io";
import NewLoader from "../../components/NewLoader";
import { FaRegCircle } from "react-icons/fa6";

const TestPage = () => {
  const [started, setStarted] = useState(false); // Flag to start the test
  const [isTestFinished, setIsTestFinished] = useState(false); // Flag to track if the test is finished
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Track user's answers
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [score, setScore] = useState(0); // Store the user's score
  const [isReviewMode, setIsReviewMode] = useState(false); // Flag for review mode
  const [isLoading, setIsLoading] = useState(false); // For handling loading state

  const sampleQuestions = [
    {
      question:
        "The length of the bridge, which a train 130 metres long and travelling at 45 km/hr can cross in 30 seconds, is:",
      options: ["200m", "225m", "240m", "250m"],
      ans: "240m",
    },
    {
      question:
        "A man standing at a point P is watching the top of a tower. The angle of elevation from his position is 30°, and after walking closer, it becomes 60°. What is the distance between the base of the tower and the point P?",
      options: ["4√3 units", "8 units", "12 units", "Inadequate data"],
      ans: "Inadequate data",
    },
    {
      question:
        "A grocer has a sale of Rs. 6435, Rs. 6927, Rs. 6855, Rs. 7230 and Rs. 6562 for 5 consecutive months. How much sale must he have in the sixth month to average Rs. 6500?",
      options: ["Rs.4991", "Rs.5991", "Rs.6001", "Rs.6991"],
      ans: "Rs.4991",
    },
    {
      question:
        "Reena took a loan of Rs. 1200 with simple interest for as many years as the rate of interest. If she paid Rs. 432 as interest at the end of the loan period, what was the rate of interest?",
      options: ["3.6%", "6%", "18%", "Cannot be determined"],
      ans: "6%",
    },
    {
      question:
        "A train passes a station platform in 36 seconds and a man standing on the platform in 20 seconds. If the speed of the train is 54 km/hr, what is the length of the platform?",
      options: ["120m", "240m", "300m", "None of these"],
      ans: "240m",
    },
  ];

  const [questions, setQuestions] = useState(sampleQuestions); // Store the questions

  // Start the timer when the test starts
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [started, timeLeft]);

  // Automatically finish the test when time is up
  useEffect(() => {
    if (timeLeft === 0) {
      handleFinishTest();
    }
  }, [timeLeft]);

  // Format the time left into minutes:seconds format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Function to handle selecting an answer
  const handleSelectAnswer = (option) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
  };

  // Handle test completion logic
  const handleFinishTest = () => {
    if (window.confirm("Are you sure you want to finish the test?")) {
      let newScore = 0;

      selectedAnswers.forEach((answer, index) => {
        if (answer === questions[index].ans) {
          newScore += 10; // Assuming each correct answer gives 10 marks
        }
      });

      setScore(newScore);
      setIsTestFinished(true);
      setIsReviewMode(true); // Enter review mode after finishing the test
      setStarted(false);
      exitFullScreen(); // Exit full-screen mode
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Trigger Full-Screen mode
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  // Exit Full-Screen mode
  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  // Prevent tab switching
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && started) {
      alert("Tab switching is not allowed during the test.");
      handleFinishTest(); // End the test if user tries to switch tabs
    }
  };

  // Start the test and force full-screen
  const handleStartTest = () => {
    setStarted(true);
    enterFullScreen();
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [started]);

  // Modal component for displaying the result
  const ResultModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-4">Test Result</h2>
        <p className="mb-4">
          Your score is {score}/{questions.length * 10}
        </p>
        <button
          onClick={() => setIsTestFinished(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {!started ? (
        // Start screen before the test begins
        <div className="w-full h-[400px] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to the Test!</h1>
          <button
            className="Geist bg-blue-500 px-8 py-3 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            onClick={handleStartTest}
          >
            Start Test
          </button>
        </div>
      ) : (
        <div className="Geist-semibold overflow-hidden h-screen w-screen flex items-center justify-between flex-col md:px-10 xl:px-16 2xl:px-24">
          <div className=" w-full h-[10%] flex justify-between items-center">
            <div className=" w-[25%] h-full flex items-center justify-start text-2xl ml-8">
              Coderoom
            </div>
            <div className=" w-[50%] h-full flex items-center justify-center gap-4">
              <button
                className="h-10 w-10 border border-gray-400 rounded-[7px] flex items-center justify-center text-2xl"
                onClick={handlePreviousQuestion}
              >
                <IoIosArrowBack />
              </button>
              <button
                className="h-10 w-10 border border-gray-400 rounded-[7px] flex items-center justify-center text-2xl"
                onClick={handleNextQuestion}
              >
                <IoIosArrowForward />
              </button>
            </div>
            <div className=" w-[25%] h-full flex items-center justify-end">
              <span className="w-[240px] h-full text-left text-indigo-800 text-xl Geist flex items-center justify-center mr-4">
                Time Left: &nbsp;
                <span className="Geist-semibold ">{formatTime(timeLeft)}</span>
              </span>
            </div>
          </div>
          <div className="bg-gray-100 w-full h-[80%] rounded-[10px] border border-gray-300 flex">
            <div className="w-[60%] h-full bg-gray-100 border-r border-gray-300 flex flex-col items-start justify-start text-blue-900">
              <div className="Geist-semibold text-xl w-full h-16 flex items-center justify-between px-8 border-b border-gray-300">
                <h1 className="Geist-semibold">
                  Question: {currentQuestionIndex + 1}
                </h1>
                <p className="">{"Marks: 10"}</p>
              </div>
              <div className="px-8 Geist text-xl h-[640px]  overflow-y-auto">
                <h1 className="Geist-semibold my-4">Problem Statement:</h1>
                <p>{questions[currentQuestionIndex].question}</p>
              </div>
            </div>
            <div className="w-[40%] h-full bg-gray-50 flex flex-col items-start justify-start">
              <div className="Geist-semibold text-xl w-full h-16 flex items-center justify-between px-8 border-b border-gray-300">
                <h1 className="Geist-semibold">Choose Answer</h1>
              </div>
              <div className="px-8 Geist text-xl h-[640px] w-full overflow-y-auto">
                {questions[currentQuestionIndex].options.map((option, i) => (
                  <div
                    key={i}
                    className={`Geist flex items-center justify-start my-4 p-4 border border-gray-400 rounded-lg cursor-pointer transition duration-300 ${
                      selectedAnswers[currentQuestionIndex] === option
                        ? "bg-blue-400 text-white"
                        : ""
                    }`}
                    onClick={() => handleSelectAnswer(option)}
                  ><span className="mr-3 text-sm"><FaRegCircle/></span>
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full h-[10%] flex justify-between items-center">
            <div className=" w-[25%] h-full flex items-center justify-center"></div>
            <div className=" w-[50%] h-full flex items-center justify-center gap-4">
              <button
                className="Geist-semibold h-10 w-[300px] border border-gray-400 rounded-[7px]"
                onClick={handleFinishTest}
              >
                Submit
              </button>
            </div>
            <div className=" w-[25%] h-full flex items-center justify-end mr-6">
              {isLoading && <NewLoader />}
            </div>
          </div>
        </div>
      )}
      {isTestFinished && <ResultModal />}
    </div>
  );
};

export default TestPage;
