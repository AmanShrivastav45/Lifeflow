import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../fonts/stylesheet.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Assignments = ({ selectedClass }) => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date()); // State for due date
  const classId = selectedClass;
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/coderoom/auth/assignments/${selectedClass}`
        );
        setAssignments(response.data.assignments);
      } catch (error) {
        console.error("Error fetching assignments", error);
      }
    };
    fetchAssignments();
  }, [selectedClass]);

  const calculateTimeLeft = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;

    if (timeDiff <= 0) {
      return "Due date passed";
    }

    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutesLeft = Math.floor((timeDiff / (1000 * 60)) % 60);

    return `${daysLeft} Days, ${hoursLeft} Hours, ${minutesLeft} Minutes left`;
  };

  const createAssignment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/coderoom/auth/create-assignments`,
        {
          classId: classId,
          title: title,
          description: description,
          dueDate: dueDate.toISOString().split("T")[0],
        }
      );

      setAssignments([...assignments, response.data.assignment]);
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error creating assignment", error);
    }
  };

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  // Add a function to fetch the assignment by ID
  const fetchAssignmentById = async (assignmentId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/coderoom/auth/assignments/${assignmentId}`
      );
      setCurrentAssignment(response.data.assignment);
    } catch (error) {
      console.error("Error fetching assignment", error);
    }
  };

  // Add a function to update the assignment
  const updateAssignment = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/coderoom/auth/assignments/${currentAssignment._id}`,
        {
          title: title,
          description: description,
          dueDate: dueDate.toISOString().split("T")[0],
        }
      );
      setCurrentAssignment(response.data.assignment);
      setAssignments(
        assignments.map((assignment) =>
          assignment._id === currentAssignment._id
            ? response.data.assignment
            : assignment
        )
      );
    } catch (error) {
      console.error("Error updating assignment", error);
    }
  };

  // Add a function to delete the assignment
  const deleteAssignment = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/coderoom/auth/assignments/${currentAssignment._id}/class/${classId}`
      );
      setAssignments(
        assignments.filter(
          (assignment) => assignment._id !== currentAssignment._id
        )
      );
      setCurrentAssignment(null);
    } catch (error) {
      console.error("Error deleting assignment", error);
    }
  };

  // Update the JSX to include the view submission button, edit, and delete functionality
  return (
    <div className="Geist h-[95%] gap-4 w-full p-2 flex rounded-lg shadow-md">
      <div className="h-full w-[50%] gap-4 flex flex-col">
        {/* Upload Section */}
        <div className="h-[40%] flex gap-4">
          <div className="h-full w-[50%] flex flex-col items-center justify-center bg-[#1e1e1e] rounded-[7px] p-3">
            <h1 className=" text-xl w-full text-left Geist-semibold text-white ml-2 mb-2">
              Create Assignment
            </h1>
            <input
              type="text"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="Geist mt-1 w-full pl-3 border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 outline-none h-10 text-base text-white rounded-[7px] mb-3"
              required
            />
            <textarea
              placeholder="Enter assignment description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="Geist w-full h-20 pl-3 border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 outline-none text-base text-white rounded-[7px] mb-3"
              required
            ></textarea>
            <DatePicker
              className="w-full h-10 pl-3 hide-scrollbar border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 outline-none text-base text-white rounded-[7px] mb-3"
              selected={dueDate}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="Pp"
            />
            <button
              onClick={createAssignment}
              className="Geist h-9 mt-3 w-full outline-none text-sm Geist-semibold bg-purple-700 hover:bg-purple-600 text-white rounded-[7px] flex items-center justify-center"
            >
              Create Assignment
            </button>
          </div>
        </div>

        {/* List of Assignments */}
        <div className="h-[60%] flex gap-4 flex-col">
          <div className="h-full w-full bg-[#1e1e1e] rounded-[7px] p-4 overflow-y-auto">
            <h2 className="text-lg text-white">Assignments:</h2>
            {assignments && assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="p-3 h-[120px] flex flex-col items-center justify-center text-white w-full bg-[#2a2a2a] border border-[#1e1e1e] overflow-hidden mb-3 rounded-md shadow"
                >
                  <div className="flex w -full justify-between">
                    <h4 className="text-lg font-semibold">
                      {assignment.title}
                    </h4>
                    <h3 className="text-[14px] mr-2">
                      {calculateTimeLeft(assignment.dueDate)}
                    </h3>
                  </div>
                  <p className="text-[14px] text-gray-500 overflow-hidden line-clamp-2">
                    {assignment.description}
                  </p>
                  <div className="flex justify-between w-full gap-4">
                    <button
                      onClick={() => fetchAssignmentById(assignment._id)}
                      className="Geist h-9 mt-3 w-full outline-none text-sm Geist-semibold bg-purple-700 hover:bg-purple-600 text-white rounded-[7px] flex items-center justify-center"
                    >
                      View Submission
                    </button>
                    <button
                      onClick={() => {
                        setTitle(assignment.title);
                        setDescription(assignment.description);
                        setDueDate(new Date(assignment.dueDate));
                        setCurrentAssignment(assignment);
                      }}
                      className="Geist h-9 mt-3 w-full outline-none text-sm Geist-semibold bg-green-600 hover:bg-purple-600 text-white rounded-[7px] flex items-center justify-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={deleteAssignment}
                      className="Geist h-9 mt-3 w-full outline-none text-sm Geist-semibold bg-red-500 hover:bg-purple-600 text-white rounded-[7px] flex items-center justify-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No assignments available for this class.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File Preview Section */}
      <div className="h-full flex flex-col items-center justify-start w-[50%] bg-[#1e1e1e] rounded-[7px] p-2">
        <div className="h-full text-md text-white Geist w-full flex items-center justify-center">
          {currentAssignment && (
            <div className="h-full w-full bg-[#1e1e1e] rounded-[7px] p-4 overflow-y-auto">
              <h2 className="text-lg">Edit Assignment:</h2>
              <input
                type="text"
                placeholder="Enter assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="Geist mt-1 w-full pl-3 border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 outline-none h-10 text-base text-white rounded-[7px] mb-3"
                required
              />
              <textarea
                placeholder="Enter assignment description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="Geist w-full h-20 pl-3 border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 outline-none text-base text-white rounded-[7px] mb-3"
                required
              ></textarea>
              <DatePicker
                selected={dueDate}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="Pp"
              />
              <button
                onClick={updateAssignment}
                className="Geist h-9 mt-3 w-full outline-none text-sm Geist-semibold bg-purple-700 hover:bg-purple-600 text-white rounded-[7px] flex items-center justify-center"
              >
                Update Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
