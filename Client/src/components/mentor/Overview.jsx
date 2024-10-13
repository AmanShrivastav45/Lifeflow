import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader.jsx";
import { useAuthStore } from "../../store/auth.js";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../fonts/stylesheet.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateClass from "../../modals/CreateClass.jsx";
import NewLoader from "../NewLoader.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const Overview = ({ selectedClass }) => {
  const [isLoadingg, setisLoading] = useState(true);
  const [classInfo, setClassInfo] = useState(null);
  const [error, setError] = useState(null);

  const getClassInfo = async (classId) => {
    try {
      const response = await axios.get(`http://localhost:8080/coderoom/auth/get-class/${classId}`, {
        params: { classId: classId }
      });      
      setClassInfo(response.data);
    } catch (error) {
      setError(error.message);
    }
  };


  const dummyAttendanceData = [
    {
      studentName: "John Doe",
      totalClasses: 20,
      classesAttended: 18,
      percentage: 90,
    },
    {
      studentName: "Jane Smith",
      totalClasses: 20,
      classesAttended: 16,
      percentage: 80,
    },
    {
      studentName: "Michael Johnson",
      totalClasses: 20,
      classesAttended: 15,
      percentage: 75,
    },
    {
      studentName: "Emily Davis",
      totalClasses: 20,
      classesAttended: 19,
      percentage: 95,
    },
    {
      studentName: "David Clark",
      totalClasses: 20,
      classesAttended: 17,
      percentage: 85,
    },
    {
      studentName: "John Doe",
      totalClasses: 20,
      classesAttended: 18,
      percentage: 90,
    },
    {
      studentName: "Jane Smith",
      totalClasses: 20,
      classesAttended: 16,
      percentage: 80,
    },
    {
      studentName: "Michael Johnson",
      totalClasses: 20,
      classesAttended: 15,
      percentage: 75,
    },
    {
      studentName: "Emily Davis",
      totalClasses: 20,
      classesAttended: 19,
      percentage: 95,
    },
    {
      studentName: "David Clark",
      totalClasses: 20,
      classesAttended: 17,
      percentage: 85,
    },
    {
      studentName: "John Doe",
      totalClasses: 20,
      classesAttended: 18,
      percentage: 90,
    },
    {
      studentName: "Jane Smith",
      totalClasses: 20,
      classesAttended: 16,
      percentage: 80,
    },
    {
      studentName: "Michael Johnson",
      totalClasses: 20,
      classesAttended: 15,
      percentage: 75,
    },
    {
      studentName: "Emily Davis",
      totalClasses: 20,
      classesAttended: 19,
      percentage: 95,
    },
    {
      studentName: "David Clark",
      totalClasses: 20,
      classesAttended: 17,
      percentage: 85,
    },
  ];

  const dummyStudents = [
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Michael Johnson" },
    { name: "Emily Davis" },
    { name: "David Clark" },
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Michael Johnson" },
    { name: "Emily Davis" },
    { name: "David Clark" },
  ];

  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);

  // Prepare data for the chart
  const chartData = {
    labels: students.map((student) => student.name), // Student names as labels
    datasets: [
      {
        label: "Attendance Percentage",
        data: attendanceData.map((data) => data.percentage), // Percentage of attendance
        backgroundColor: "#BF40BF",
        borderColor: "#800080",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Attendance Overview",
      },
    },
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setisLoading(false);
    }, 3000);
    setAttendanceData(dummyAttendanceData);
    setStudents(dummyStudents);
    getClassInfo(selectedClass);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [selectedClass]);

  const lectures =
    selectedClass && selectedClass.lectures ? selectedClass.lectures.length : 0;

  if (isLoadingg) {
    return <NewLoader />;
  }

  return (
    <div className="Geist h-full w-full flex flex-col rounded-lg shadow-md">
      {/* Top section with four columns */}
      <div className="h-[25%] w-full grid grid-cols-4 gap-4 p-2">
        <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
          <h1 className="Geist-semibold text-lg">Total Lectures</h1>
          <h1 className="text-[54px] font-bold">{lectures}</h1>
          <h1 className="Geist text-sm text-gray-400">9 lectures last month</h1>
        </div>
        <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
          <h1 className="Geist-semibold text-lg">Defaulters</h1>
          <h1 className="text-[54px] font-bold">12</h1>
          <h1 className="Geist text-sm text-gray-400">9 lectures last month</h1>
        </div>
        <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
          <h1 className="Geist-semibold text-lg">Critical Defaulters</h1>
          <h1 className="text-[54px] font-bold">3</h1>
          <h1 className="Geist text-sm text-gray-400">9 lectures last month</h1>
        </div>
        <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
          <h1 className="Geist-semibold text-lg">Average Attendance</h1>
          <h1 className="text-[54px] font-bold">
            72<span className="text-lg">%</span>
          </h1>
          <h1 className="Geist text-sm text-gray-400">+12% from last month</h1>
        </div>
      </div>

      <div className="h-[70%] w-full flex gap-4 ">
        <div className="h-full w-[60%] ml-2 my-2 rounded-[7px] flex items-center justify-center p-4 bg-[#1e1e1e]">
          {/* {error && <div className="text-red-500">{error}</div>} */}
        </div>
        <div className="h-full w-[40%] mr-2 my-2 rounded-[7px] p-4 bg-[#1e1e1e] text-white">
          <div className="text-sm h-full overflow-y-auto hide-scrollbar border-2 border-[#3a3a3a] ">
            <table className="w-full text-left ">
              <thead className="sticky top-0 bg-[#1e1e1e] border border-gray-400 z-10">
                <tr className="outline-none">
                  <th className="px-4 h-12 py-2 border border-gray-400 bg-[#1e1e1e]">
                    Student
                  </th>
                  <th className="px-4  h-12 py-2 text-center border border-gray-400 bg-[#1e1e1e]">
                    Attended
                  </th>
                  <th className="px-4 h-12 py-2 border-b border-gray-400 text-center bg-[#1e1e1e]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="border-none outline-none">
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-[#3a3a3a]">
                      {record.studentName}
                    </td>
                    <td className="px-4 py-2 border border-[#3a3a3a] text-center">
                      {record.classesAttended}
                    </td>
                    <td className="px-4 py-2 border border-[# 3a3a3a] text-center">
                      {record.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;