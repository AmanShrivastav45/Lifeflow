import React, { useState } from "react";// Import your quiz data JSON file
import "../fonts/stylesheet.css";

function Test() {
  const [userResponses, setUserResponses] = useState({}); // State to store user responses

  const handleAnswer = (questionId, selectedOption) => {
    const correctAnswer = quizData.questions.find(
      (question) => question.id === questionId
    ).answer;
    setUserResponses({
      ...userResponses,
      [questionId]: {
        selectedOption,
        correct: selectedOption === correctAnswer,
      },
    });
  };

  return (
    <div className="Geist overflow-y-auto h-screen hide-scrollbar">
    <div className="container mx-auto text-white">
      {quizData.questions.map((question) => (
        <div
          key={question.id}
          className="mb-8 p-4 rounded-[5px] bg-[#1a1a1a] border border-[#2a2a2a]"
        >
          <h2 className="text-lg mb-4">{question.question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option) => (
              <button
                key={option}
                className={`p-2 rounded-md bg-[#1e1e1e] border border-[#2a2a2a] h-auto py-4 text-left pl-6 text-lg  outline-none ${
                  userResponses[question.id] !== undefined &&
                  userResponses[question.id].selectedOption === option
                    ? userResponses[question.id].correct
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "hover:bg-[#2a2a2a]"
                } ${
                  userResponses[question.id] !== undefined &&
                  userResponses[question.id].selectedOption === option
                    ? "pointer-events-none"
                    : ""
                }`}
                onClick={() => handleAnswer(question.id, option)}
                disabled={userResponses[question.id] !== undefined}
                style={{
                  backgroundColor:
                    userResponses[question.id] !== undefined &&
                    userResponses[question.id].selectedOption === option
                      ? userResponses[question.id].correct
                        ? "#099a04"
                        : "#EF4444"
                      : "",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {userResponses[question.id] && (
            <div className="mt-4">
              <p
                className={`text-xl ${
                  userResponses[question.id].correct
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {userResponses[question.id].correct
                  ? "Correct Answer!"
                  : "Incorrect Answer!"}
              </p>
              <p className="text-gray-400 text-lg mt-2 Geist">{question.explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

export default Test;
