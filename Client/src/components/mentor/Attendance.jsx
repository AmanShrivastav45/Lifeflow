import React, { useState, useEffect } from "react";
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
import NewLoader from "../../components/NewLoader.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Attendance = () => {
  // Dummy data

  // const [isLoading, setisLoading] = useState(true);
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

  useEffect(() => {
    // Simulate API call
    setAttendanceData(dummyAttendanceData);
    setStudents(dummyStudents);
  }, []);

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

  // useEffect(() => {
  //   setTimeout(() => {
  //     setisLoading(false);
  //   }, 2000);
  // }, []);

  return (
    // <div className="Geist h-[720px] w-full flex flex-col rounded-lg bg-green-600 shadow-md">
    //   {/* Top section with four columns */}
    //   <div className="h-[25%] w-full grid grid-cols-4 gap-4 p-2">
    //     <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
    //       <h1 className="Geist-semibold text-lg">Total Lectures</h1>
    //       <h1 className="text-[54px] font-bold">17</h1>
    //       <h1 className="Geist text-sm text-gray-400">9 lectures last month</h1>
    //     </div>
    //     <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
    //       <h1 className="Geist-semibold text-lg">Defaulters</h1>
    //       <h1 className="text-[54px] font-bold">12</h1>
    //       <h1 className="Geist text-sm text-gray-400">9 lectures last month</h1>
    //     </div>
    //     <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
    //       <h1 className="Geist-semibold text-lg">Critical Defaulters</h1>
    //       <h1 className="text-[54px] font-bold">3</h1>
    //       <h1 className="Geist text-sm text-gray-400">9 lectures last month</h1>
    //     </div>
    //     <div className="h-full flex flex-col rounded-[7px] bg-[#1e1e1e] text-center items-center justify-center text-white">
    //       <h1 className="Geist-semibold text-lg">Average Attendance</h1>
    //       <h1 className="text-[54px] font-bold">
    //         72<span className="text-lg">%</span>
    //       </h1>
    //       <h1 className="Geist text-sm text-gray-400">+12% from last month</h1>
    //     </div>
    //   </div>

    //   <div className="h-[75%] w-full flex gap-4 ">
    //     <div className="h-full w-[60%] ml-2 my-2 rounded-[7px] flex items-center justify-center p-4 bg-[#1e1e1e]">
    //       {/* <Bar data={chartData} options={options} /> */}
    //     </div>
    //     <div className="h-full w-[40%] mr-2 my-2 rounded-[7px] p-4 bg-[#1e1e1e] text-white">
    //       <div className="text-sm h-full overflow-y-auto hide-scrollbar border-2 border-[#3a3a3a] ">
    //         <table className="w-full text-left ">
    //           <thead className="sticky top-0 bg-[#1e1e1e] border border-gray-400 z-10">
    //             <tr className="outline-none">
    //               <th className="px-4 h-12 py-2 border border-gray-400 bg-[#1e1e1e]">
    //                 Student
    //               </th>
    //               <th className="px-4  h-12 py-2 text-center border border-gray-400 bg-[#1e1e1e]">
    //                 Attended
    //               </th>
    //               <th className="px-4 h-12 py-2 border-b border-gray-400 text-center bg-[#1e1e1e]">
    //                 %
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody className="border-none outline-none">
    //             {/* {attendanceData.map((record, index) => (
    //               <tr key={index}>
    //                 <td className="px-4 py-2 border border-[#3a3a3a]">
    //                   {record.studentName}
    //                 </td>
    //                 <td className="px-4 py-2 border border-[#3a3a3a] text-center">
    //                   {record.classesAttended}
    //                 </td>
    //                 <td className="px-4 py-2 border border-[#3a3a3a] text-center">
    //                   {record.percentage}%
    //                 </td>
    //               </tr>
    //             ))} */}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </div>
    //   {/* {isLoading && <NewLoader/>} */}
    // </div>
    <div className="Geist h-[95%] min-w-[720px] gap-4 w-full p-2 flex flex-col rounded-lg shadow-md">
      <div className="h-[25%] w-full gap-4 grid grid-cols-4">
        <div className="bg-[#1e1e1e] rounded-[6px] "></div>
        <div className="bg-[#1e1e1e] rounded-[6px] "></div>
        <div className="bg-[#1e1e1e] rounded-[6px] "></div>
        <div className="bg-[#1e1e1e] rounded-[6px] "></div>
      </div>
      <div className="h-[75%] w-full flex gap-4">
        <div className="bg-[#1e1e1e] h-full w-[60%] rounded-[6px] "></div>
        <div className="bg-[#1e1e1e] h-full w-[40%] rounded-[6px] "></div>
      </div>
    </div>
  );
};

export default Attendance;

// {/* <h1 className="text-2xl font-bold mb-6">Attendance</h1>

// {/* Graphical View */}
// <div className="mb-6">
//   <h2 className="text-xl font-bold mb-4">Graphical View</h2>
//   <Bar data={chartData} options={options} />
// </div>

{
  /* Tabular View */
}
{
  /* <div className="mt-6">
  <h2 className="text-xl font-bold mb-4">Tabular View</h2>
  <table className="table-auto w-full text-left">
    <thead>
      <tr>
        <th className="px-4 py-2">Student Name</th>
        <th className="px-4 py-2">Total Classes</th>
        <th className="px-4 py-2">Classes Attended</th>
        <th className="px-4 py-2">Attendance (%)</th>
      </tr>
    </thead>
    <tbody>
      {attendanceData.map((record, index) => (
        <tr key={index} className="bg-gray-100">
          <td className="border px-4 py-2">{record.studentName}</td>
          <td className="border px-4 py-2">{record.totalClasses}</td>
          <td className="border px-4 py-2">{record.classesAttended}</td>
          <td className="border px-4 py-2">{record.percentage}%</td>
        </tr>
      ))}
    </tbody>
  </table>
</div> */
}
