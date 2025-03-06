import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components-h/Navbar";
import { Link, NavLink, useParams } from "react-router-dom";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";
import Email from "../../components/Email";
import axios from "axios";

const Laboratory = () => {
  const { user, logout } = useAuthStore();
  const userDetails = JSON.parse(localStorage.getItem("user")) || null;
  const laboratoryId = useParams().userId;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const [appointments, setAppointments] = useState([]);

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/lifeflow/api/laboratory/${userDetails._id}/request`
      );

      if (Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          appointments: response.data.appointments,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error fetching blood bank details:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [laboratoryId]);

  const facilities = userDetails.facilities;
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const getLast5Days = () => {
    const dates = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }
    return dates;
  };

  const last5Days = getLast5Days();

  // Initialize a count object for the last 5 days
  const appointmentsByDate = last5Days.reduce((acc, date) => {
    acc[date] = 0;
    return acc;
  }, {});

  // Count appointments created on those dates
  appointments?.forEach((appointment) => {
    const appointmentDate = new Date(appointment.createdAt)
      .toISOString()
      .split("T")[0]; // Extract YYYY-MM-DD

    if (appointmentsByDate.hasOwnProperty(appointmentDate)) {
      appointmentsByDate[appointmentDate]++;
    }
  });
  const dailyAppointmentCounts = Object.values(appointmentsByDate);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (category === "All") {
        return ["All"]; // Reset to only "All"
      } else {
        const newCategories = prev.includes(category)
          ? prev.filter((item) => item !== category) // Remove category
          : [...prev.filter((item) => item !== "All"), category]; // Add new category and remove "All"

        return newCategories.length > 0 ? newCategories : ["All"];
      }
    });
  };

  const filteredAppointments = userDetails.appointments?.filter(
    (appointment) =>
      (selectedStatus === "All" || appointment.status === selectedStatus) &&
      (selectedCategories.includes("All") ||
        selectedCategories.includes(appointment.category))
  );

  const chartData = {
    series: [
      {
        name: "Appointments",
        data: dailyAppointmentCounts,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: last5Days, // Last 5 days dynamically generated
      },
      colors: ["#34D399"],
      title: {
        text: "Appointments in Last 5 Days",
        align: "center",
        margin: 4,
        style: {
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 400,
        },
      },
    },
  };
  const appointmentCategories = {};
  const appointmentStatusCount = { Pending: 0, "In progress": 0, Completed: 0 };

  // Count categories & statuses dynamically
  userDetails.appointments?.forEach((appointment) => {
    // Count categories
    appointmentCategories[appointment.category] =
      (appointmentCategories[appointment.category] || 0) + 1;

    // Count statuses
    appointmentStatusCount[appointment.status] =
      (appointmentStatusCount[appointment.status] || 0) + 1;
  });

  // Extracting category data
  const categoryNames = Object.keys(appointmentCategories);
  const categoryCounts = Object.values(appointmentCategories);

  // Extracting status data
  const statusNames = Object.keys(appointmentStatusCount);
  const statusCounts = Object.values(appointmentStatusCount);

  const chartData2 = {
    series: statusCounts,
    options: {
      chart: {
        type: "pie",
      },
      labels: statusNames,
      colors: ["#FF4560", "#008FFB", "#00E396"],
      title: {
        text: "Appointment Status",
        align: "center",
        margin: 10,
        style: {
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 400,
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
      },
      dataLabels: {
        enabled: false,
      },
    },
  };

  const capitalizeName = (name) => {
    if (!name) return ""; // Handle empty or undefined values
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="h-screen w-full flex justify-center">
      <div className="fixed top-0 w-full h-14 flex justify-center bg-white border-b border-gray-300">
        <div className="w-full xl:w-[1280px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-sm p-2">
            <div className="flex items-center">
              <div className="relative flex items-center mx-2">
                <button className="flex items-center justify-center">
                  <img src={logo} className="h-6 mb-1" alt="logo" />
                </button>
                <h1 className="mx-4">{user?.name}</h1>
              </div>
            </div>
            <div className="flex relative justify-between space-x-4">
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
              </button>
              {isProfileButtonOpen && user ? (
                <div 
                className="absolute right-0 top-full mt-1 w-auto  min-w-48 bg-white shadow-xl border border-gray-300 rounded-[5px]"
                style={{ right: "10px", top: "25px" }}
                >
                  <div
                    className="text-gray-600"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      to={`/laboratory/${userDetails._id}/profile`}
                      className="block px-4 py-3 text-xs hover:bg-gray-100 w-full hover:text-gray-800 text-left"
                      role="menuitem"
                    >
                      <span>User: </span>
                      <span>{user?.email || "Unknown User"}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-3 text-xs hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                      role="menuitem"
                    >
                      Logout Lifeflow
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* Main Section */}
      <div className="h-full w-full mt-16 flex items-start justify-center text-gray-500 overflow-y-auto hide-scrollbar">
        <div className="w-full xl:w-[1280px] flex items-start sm:p-4 hide-scrollbar">
          <div className="h-full w-[25%] flex flex-col">
            <div className="w-full h-[260px] bg-white border border-gray-300 rounded-[5px] shadow-sm p-4 px-3 mb-4 flex flex-col">
              <ReactApexChart
                options={chartData2.options}
                series={chartData2.series}
                type="pie"
                height={180}
              />
              <div className="ml-4 flex text-xs w-full space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="h-3 w-4 border border-gray-300 rounded-[3px] bg-[#FF4560] mr-1.5"></div>
                  Pending
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-4 border border-gray-300 rounded-[3px] bg-[#008FFB] mr-1.5"></div>
                  In Progress
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-4 border border-gray-300 rounded-[3px] bg-[#00E396] mr-1.5"></div>
                  Completed
                </div>
              </div>
            </div>
            <div className="w-full h-[360px] bg-white border border-gray-300 rounded-[5px] shadow-sm p-4 px-3">
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={320}
              />
            </div>
          </div>

          <div className="h-full w-[53%] flex flex-col mx-4">
            <div className="w-full h-[640px] bg-white border border-gray-300 p-4 py-3 rounded-[5px] overflow-y-auto">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-gray-700 text-sm">Appointments</h2>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-white text-gray-600 border border-gray-300 outline-none text-sm rounded-[7px] h-8 px-2 shadow-sm"
                >
                  <option value="All">All</option>
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-center mb-4 text-xs space-x-2 text-gray-600">
                <div className="flex items-center mb-4 text-xs space-x-2 text-gray-600">
                  <button
                    onClick={() => toggleCategory("All")}
                    className={`py-0.5 px-2 rounded-[6px] border ${
                      selectedCategories.includes("All")
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600 border-blue-600"
                    }`}
                  >
                    All
                  </button>

                  {userDetails.facilities?.map((facility) => (
                    <button
                      key={facility}
                      onClick={() => toggleCategory(facility)}
                      className={`py-0.5 px-2 rounded-[6px] border ${
                        selectedCategories.includes(facility)
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-600 border-blue-600"
                      }`}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>
              {filteredAppointments.length == 0 ? (
                <p className="mt-48 flex justify-center">
                  No reports available.
                </p>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div className="flex flex-col items-center justify-between my-2 bg-gray-50 p-2 rounded-[5px] border border-gray-300 pl-3">
                    {/* Name and Status */}
                    <div className="flex justify-between w-full mb-2">
                      <div className="flex space-x-2 items-center w-full justify-between">
                        <h3 className="font-medium">
                          {capitalizeName(appointment.name)}
                        </h3>
                        <h3
                          className={`text-[11px] py-1 px-2 rounded-[5px] border ${
                            appointment.status === "pending"
                              ? "bg-[#FF4560] border-[#FF4560] text-white"
                              : appointment.status === "inprogress"
                              ? "bg-[#008FFB] border-[#008FFB] text-white"
                              : "bg-[#00E396] border-[#00E396] text-white"
                          }`}
                        >
                          {capitalizeName(appointment.status)}
                        </h3>
                      </div>
                    </div>
                    <h3 className="text-xs text-start flex w-full">
                      Appointment on:&nbsp;
                      {new Date(appointment.date).toLocaleDateString("en-GB")}
                      ,&nbsp;between&nbsp;{appointment.timeslot}.
                    </h3>

                    {/* Category, Email, Phone */}
                    <div className="flex w-full text-xs space-x-2 my-2">
                      <div className="p-0.5 bg-blue-100 px-2 rounded-[5px] border border-gray-300">
                        {appointment.category}
                      </div>
                      <div className="p-0.5 bg-blue-100 px-2 rounded-[5px] border border-gray-300">
                        {appointment.email}
                      </div>
                      <div className="p-0.5 bg-blue-100 px-2 rounded-[5px] border border-gray-300">
                        +91 {appointment.phone}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="h-full w-[22%] flex flex-col">
            <Email />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laboratory;
