import React, { useEffect, useState } from "react";
import axios from "axios";

const Tests = ( {selectedClass} ) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctOption: "" },
  ]);
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctOption: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        `http://localhost:8080/coderoom/auth/tests`,
        {
          title,
          description,
          questions,
          classId: selectedClass,
        }
      );
      setSuccessMessage("New test created successfully!");
      console.log("New test created:", response.data);
      // Reset the form after successful submission
      setTitle("");
      setDescription("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctOption: "" },
      ]);
    } catch (error) {
      setErrorMessage("Error creating test. Please try again.");
      console.error("Error creating test:", error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto p-4 bg-gray-800 rounded-lg shadow-lg text-gray-300">
      <h2 className="text-2xl font-bold mb-4">Create New Test</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-600 bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        {questions.map((question, index) => (
          <div
            key={index}
            className="border border-gray-600 p-4 rounded bg-gray-700"
          >
            <input
              type="text"
              name="question"
              placeholder="Question"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, e)}
              required
              className="w-full p-2 rounded border border-gray-600 bg-gray-600 focus:outline-none focus:ring focus:ring-blue-500 mb-2"
            />
            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                name="options"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(index, optionIndex, e.target.value)
                }
                required
                className="w-full p-2 rounded border border-gray-600 bg-gray-600 focus:outline-none focus:ring focus:ring-blue-500 mb-2"
              />
            ))}
            <input
              type="text"
              name="correctOption"
              placeholder="Correct Option (1-4)"
              value={question.correctOption}
              onChange={(e) => handleQuestionChange(index, e)}
              required
              className="w-full p-2 rounded border border-gray-600 bg-gray-600 focus:outline-none focus:ring focus:ring-blue-500 mb-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Question
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Create Test
        </button>
      </form>
      {successMessage && (
        <p className="text-green-400 mt-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-400 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default Tests;
