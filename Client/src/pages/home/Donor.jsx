import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import logo from "../../assets/logo.png";
import { Link, NavLink, useParams } from "react-router-dom";
import { CONSTANTS } from "../../../../constants";
import { VscUnverified } from "react-icons/vsc";
import { VscVerifiedFilled } from "react-icons/vsc";
import Email from "../../components/Email";
import { IoClose } from "react-icons/io5";
import VerifyDonor from "../modals/VerifyDonor";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import AddDonation from "../modals/AddDonation";
import Hospital from "../components/Hospital";
import toast from "react-hot-toast";
import LabComp from "../components/LabComp";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Donor = () => {
  const { user, logout } = useAuthStore();
  const userDetails = JSON.parse(localStorage.getItem("user")) || null;
  const donorId = useParams().userId;
  //const isVerified = JSON.parse(localStorage.getItem("isAuthenticated")) || null;
  const isVerified = false;
  const receiverId = useParams().userId || null;
  const [tab, setTab] = useState("requests");
  const prevDonationDate = userDetails.donations[userDetails.donations.length - 1]?.createdAt
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [bloodGroup, setBloodGroup] = useState([]);
  const [verificationModel, setVerificationModel] = useState(false);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(userDetails.isEligible);

  const [isAddDonationModalOpen, setIsAddDonationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [response, setResponse] = useState("");
  const [filteredLaboratories, setfilteredLaboratories] = useState([]);
  const [donorAppointments, setDonorAppointments] = useState({});
  const [selectedReport, setSelectedReport] = useState("");

  const fetchDonorAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/lifeflow/api/donors/${userDetails._id}/appointments`
      );
      const app = response?.data;
      setDonorAppointments(app);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        const updatedUser = { ...storedUser, appointments: app };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error fetching blood bank details:", error);
    }
  }

  const updateRequest = async (requestId, donationId, receiverId, status) => {
    console.log(status)
    try {
      const response = await axios.put(
        `http://localhost:5050/lifeflow/api/donors/donations/:${donorId}`,
        {
          requestId: requestId,
          receiverId: receiverId,
          donationId: donationId,
          donorId: donorId,
          status: status,
        }
      );
      const updatedUser = response?.data?.donor;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Updated donation!")
      window.location.reload()
    } catch (error) {

      
      console.error(error);
    }
  }

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/lifeflow/api/donors/${userDetails._id}/requests`
      );
      const requests = response.data;
      setRequests(requests);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        const updatedUser = { ...storedUser, requestsReceived: requests.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error fetching blood bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  const appointmentDetails = userDetails.appointments;


  const fetchHospitals = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5050/lifeflow/api/laboratories"
      );

      if (Array.isArray(res.data)) {
        setHospitals(res.data);
        setfilteredLaboratories(res.data);
      } else {
        setResponse(res.data.message || "No hospitals found.");
      }

      setLoading(false);
    } catch (error) {
      setResponse("Failed to fetch hospitals.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
    fetchHospitals();
    fetchDonorAppointments();
  }, [donorId]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setfilteredLaboratories(
        hospitals.filter(
          (hospital) =>
            hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.facilities.some((facility) =>
              facility.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
      );
    } else {
      setfilteredLaboratories(hospitals);
    }
  }, [searchTerm]);

  const handleLogout = () => {
    logout();
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedApCategory, setSelectedApCategory] = useState("All");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  const updateEligibility = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5050/lifeflow/api/${userDetails._id}/update`,
        {
          _id: userDetails._id,
          role: CONSTANTS.SCHEMA.DONOR,
          isEligible: true,
        }
      );
      console.log("Response", response);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userDetails, isEligible: true })
      );
      console.log("Updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating eligibility:", error);
    }
  };

  const extractText = async () => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      let extractedText = "";

      if (file.type === "application/pdf") {
        const pdfData = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          extractedText += textContent.items.map((item) => item.str).join(" ");
        }
      } else {
        const { data } = await Tesseract.recognize(file, "eng");
        extractedText = data.text;
      }
      const cleanedText = extractedText.replace(/"/g, "");
      let hemoglobinLevel;
      try {
        const response = await axios.post(
          "http://localhost:5050/api/extract-hemoglobin",
          {
            extractedText: cleanedText,
          }
        );
        hemoglobinLevel =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        console.log("Extracted Hemoglobin Level:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }

      if (hemoglobinLevel === "null\n") {
        setResult("Hemoglobin level not found in the report.");
        setIsEligible(false);
      } else if (hemoglobinLevel >= 12.5) {
        updateEligibility();
        setIsEligible(true);
        setResult(
          `Your hemoglobin level is ${hemoglobinLevel} g/dL. You are eligible to donate blood!`
        );
      } else {
        setIsEligible(false);
        setResult(
          `Your hemoglobin level is ${hemoglobinLevel} g/dL. You are not eligible to donate blood.`
        );
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setResult("Error processing the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (setter, stateArray, value) => {
    if (stateArray.includes(value)) {
      setter(stateArray.filter((item) => item !== value));
    } else {
      setter([...stateArray, value]);
    }
  };
  const handleSelectAll = () => {
    if (bloodGroup.length === Object.values(CONSTANTS.BLOODGROUP).length) {
      setBloodGroup([]);
    } else {
      setBloodGroup(Object.values(CONSTANTS.BLOODGROUP));
    }
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const trimFileName = (name, maxLength = 30) => {
    if (name.length <= maxLength) return name;

    const firstPart = name.slice(0, 15);
    const lastPart = name.slice(-12);
    return `${firstPart}...${lastPart}`;
  };

  const closeVerificationModal = () => {
    setResult("");
    setFile(null);
    setSelectedFile(null);
    setVerificationModel(false);
  };

  const filteredRequests = Array.isArray(requests?.data)
    ? requests.data.filter((lab) => {
      const categoryMatch =
        selectedCategory === "All" || lab.status === selectedCategory;

      const bloodGroupMatch =
        bloodGroup.length === 0 || bloodGroup.includes(lab.bloodGroup);
      return categoryMatch && bloodGroupMatch;
    })
    : [];

  return (
    <div className="h-screen w-full flex justify-center">
      {/* Navbar */}
      <div className="fixed top-0 w-full h-14 flex justify-center bg-white border-b border-gray-300">
        <div className="w-full xl:w-[1280px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-sm p-2">
            <div className="flex items-center">
              <div className="relative flex items-center mx-2">
                <button className="flex items-center justify-center mr-4">
                  <img src={logo} className="h-6 mb-1" alt="logo" />
                </button>
                <button
                  onClick={() => setTab("requests")}
                  className={`flex items-center justify-center mx-4 ${tab === "requests" ? "text-gray-700" : "text-gray-400"
                    }`}
                >
                  Requests
                </button>
                <button
                  onClick={() => setTab("laboratories")}
                  className={`flex items-center justify-center mx-4 ${tab === "laboratories" ? "text-gray-700" : "text-gray-400"
                    }`}
                >
                  Laboratories
                </button>
                {appointmentDetails.length > 0 &&
                  <button
                    onClick={() => setTab("appointments")}
                    className={`flex items-center justify-center mx-4 ${tab === "appointments" ? "text-gray-700" : "text-gray-400"
                      }`}
                  >
                    Appointments
                  </button>
                }
              </div>
            </div>
            <div className="flex relative items-center justify-between space-x-4">
              {isEligible && (
                <button
                  onClick={() => {
                    setIsAddDonationModalOpen(true);
                  }}
                  className="text-xs px-2 p-1 border border-gray-300 bg-blue-100 rounded-[5px]"
                >
                  Add Donation
                </button>
              )}
              <div className="text-[30px]">
                {isEligible === true ? (
                  <div className="relative group flex items-center">
                    <span className="text-green-500">
                      <VscVerifiedFilled />
                    </span>
                    {/* Tooltip */}
                    <div className="absolute mb-2 right-4 top-6 translate-x-2 w-max px-3 py-1 text-xs text-green-600 bg-green-100 border border-green-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      You're Verified
                    </div>
                  </div>
                ) : (
                  <div className="relative group flex items-center">
                    <span className="text-red-500 animate-pulse">
                      <VscUnverified />
                    </span>
                    {/* Tooltip */}
                    <div className="absolute mb-2 right-4 top-6 translate-x-2 w-max px-3 py-1 text-xs text-red-600 bg-red-100 border border-red-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Please Verify yourself
                    </div>
                  </div>
                )}
              </div>
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
              </button>
              {isProfileButtonOpen && user ? (
                <div
                  className="absolute right-0 top-full mt-1 w-auto min-w-48 bg-white shadow-xl border border-gray-300 rounded-[5px]"
                  style={{ right: "10px", top: "25px" }}
                >
                  <div
                    className="text-gray-600"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      to={`/donor/${userDetails._id}/profile`}
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

      {tab === "requests" ? (
        <div className="h-full flex justify-center w-full mt-14">
          <div className="w-full xl:w-[1280px] flex px-4">
            <div className="hidden overflow-hidden mr-4 md:block w-[20%] h-full text-md overflow-y-hidden ">
              <ul className="p-4 mt-4 shadow-xl border border-gray-300 text-gray-500 bg-gradient-to-l  from-[#fff7e4] to-white rounded-[5px] h-auto">
                <h1 className="text-sm text-gray-700">Filters</h1>
                <div className="mt-4">
                  <h1 className="text-xs text-gray-700">Blood Group</h1>
                  <ul className="text-xs flex flex-wrap w-full text-gray-500">
                    <li className="my-1 mt-3 flex w-full">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={
                          bloodGroup.length ===
                          Object.values(CONSTANTS.BLOODGROUP).length
                        }
                        onChange={handleSelectAll}
                      />
                      <label htmlFor="select-all" className="mx-3 ml-1">
                        Select All
                      </label>
                    </li>
                    {Object.values(CONSTANTS.BLOODGROUP).map((group) => (
                      <li className="my-1 flex " key={group}>
                        <input
                          type="checkbox"
                          id={`blood-group-${group}`}
                          name="bloodGroup"
                          value={group}
                          checked={bloodGroup.includes(group)}
                          onChange={() =>
                            handleCheckboxChange(
                              setBloodGroup,
                              bloodGroup,
                              group
                            )
                          }
                        />
                        <label
                          htmlFor={`blood-group-${group}`}
                          className="mx-3 ml-1"
                        >
                          {group}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </ul>
            </div>
            <div className="h-full w-[55%] flex flex-col mt-4">
              <div className="w-full h-[640px] bg-gradient-to-l from-[#fff7e4] to-white shadow-base border border-gray-300 p-4 py-3 rounded-[5px] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-700 text-sm">Requests</h2>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white text-gray-600 border border-gray-300 outline-none text-xs rounded-[7px] h-8 px-2 shadow-sm"
                  >
                    <option value="All">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {filteredRequests?.length > 0 ? (
                    filteredRequests.map((request, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-300 rounded-[5px] p-4 shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <h1 className="flex items-center">
                            {request.donationType.charAt(0).toUpperCase() +
                              request.donationType.slice(1).toLowerCase()}{" "}
                            Request By&nbsp;
                            <p className="font-medium flex items-center">
                              {request.name.charAt(0).toUpperCase() +
                                request.name.slice(1).toLowerCase()}
                            </p>
                            <span
                              className={`text-[10px] ml-3 font-medium ${request.status === "pending"
                                ? "text-yellow-600 bg-yellow-100 border border-yellow-500 px-2 py-0.5 rounded-[5px]"
                                : request.status === "accepted"
                                  ? "text-green-600 bg-green-100 border border-green-500 px-2 py-0.5 rounded-[5px]"
                                  : "text-red-500 bg-red-100 border border-red-500 px-2 py-0.5 rounded-[5px]"
                                }`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1).toLowerCase()}
                            </span>
                          </h1>
                          <div className="flex gap-2">
                            <button disabled={request.status === "accepted"} onClick={() => updateRequest(request._id, request.donationId, request.receiverId, "accepted")}
                              className={`bg-green-600 text-green-100 py-1 px-3 ${request.status === "rejected" ? "hidden" : ""} text-xs rounded-[4px] ${request.status === "accepted" ? "bg-green-100 text-green-600  border-green-700 cursor-not-allowed" : ""}`}> {request.status === "accepted" ? "Accepted" : "Accept"}</button>
                            <button disabled={request.status === "accepted"} onClick={() => updateRequest(request._id, request.donationId, request.receiverId, "rejected")}
                              className={`bg-red-600 text-red-100 ${request.status === "accepted" ? "hidden" : ""} py-1 px-3 text-xs rounded-[4px] ${request.status === "rejected" ? "bg-green-100 text-green-600  border-green-700 cursor-not-allowed" : ""}`}> {request.status === "rejected" ? "Rejected" : "Reject"}</button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Requested On: &nbsp;
                          {new Date(request.requestedAt).toLocaleString()}
                        </p>
                        <div className="flex space-x-2 mt-2 text-[12px]">
                          <p className="px-2 rounded-[5px] bg-blue-100 text-blue-600 border border-blue-400 py-0.5">
                            Blood Group: {request.bloodGroup}
                          </p>
                          <p className="px-2 rounded-[5px] bg-blue-100 text-blue-600 border border-blue-400 py-0.5">
                            Phone: {request.phone}
                          </p>
                          <p className="px-2 rounded-[5px] bg-blue-100 text-blue-600 border border-blue-400 py-0.5">
                            City:{" "}
                            {request.city.charAt(0).toUpperCase() +
                              request.city.slice(1).toLowerCase()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 mt-48">
                      No requests received.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden overflow-hidden md:block md:w-[25%] h-full text-md p-4 text-white overflow-y-hidden">
              <div className="h-auto flex flex-col items-center justify-center w-full shadow-xl border border-gray-300 bg-gradient-to-l from-[#fff7e4] to-white  p-4 rounded-[5px] mb-4">
                <h1 className="text-base w-full text-left Geist-semibold text-gray-600 ml-1 mb-2">
                  {isEligible ? (
                    "Book an appointment!"
                  ) : (
                    <span>
                      <h1 className="text-base w-full text-left Geist-semibold text-gray-600 mb-2">
                        <span className="text-red-500 flex items-center justify-center font-medium">
                          Verify Yourself
                        </span>
                      </h1>
                      <div className="w-full text-7xl flex justify-center text-red-600">
                        <VscUnverified />
                      </div>
                      <p className="text-xs text-center text-gray-500 mb-2 mt-2 w-full">
                        Please verify yourself to donate!
                      </p>
                    </span>
                  )}
                </h1>
                {isEligible ? (
                  <button
                    onClick={() => {
                      setTab("laboratories");
                    }}
                    className="h-9 w-full text-xs font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setVerificationModel(true);
                    }}
                    className="h-9 w-full text-xs font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
                  >
                    <span className="text-white flex items-center text-sm">
                      <VscVerifiedFilled />
                      <span className="ml-1 text-xs">Verify</span>
                    </span>
                  </button>
                )}
              </div>
              <Email />
            </div>
          </div>
        </div>
      ) : tab === "laboratories" ? (
        <div className="h-full w-full mt-16 flex items-center justify-center text-white overflow-y-auto hide-scrollbar">
          <div className="w-full xl:w-[1280px] flex text-gray-500 sm:p-3 h-full hide-scrollbar">
            <div className="h-full w-full px-2 flex flex-col">
              <div className="mt-4 w-full flex flex-col items-center justify-start text-gray-500">
                <h1 className="text-2xl text-center font-medium">
                  Find your nearest laboratories
                </h1>
                <p className="text-sm text-center leading-6 mt-2 px-2 sm:px-0 text-gray-400">
                  Find the nearest laboratories and get access to quality
                  medical services, expert doctors, and state-of-the-art
                  facilities.
                </p>
                <div className="w-full outline-none mt-6 mb-8 pl-2 md:w-[320px] lg:w-[420px] xl:w-[520px] h-9 text-xs text-white rounded-[5px] flex items-center justify-center">
                  <input
                    maxLength={30}
                    type="text"
                    placeholder="Search for laboratories..."
                    className="w-full border border-gray-400 rounded-[5px] caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white px-2 mr-2 h-9 text-xs text-black outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    required
                  />
                  <button className="bg-gray-700 hover:bg-gray-600 text-white h-full px-3 rounded">
                    Search
                  </button>
                </div>
              </div>
              <div className="w-full text-gray-500 px-6 gap-6 overflow-y-auto pb-24 hide-scrollbar flex justify-center items-start">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    Loading laboratories...
                  </div>
                ) : response ? (
                  <p className="h-full w-full flex items-center justify-center">
                    {response}
                  </p>
                ) : filteredLaboratories.length > 0 ? (
                  <div className="p-4 w-full text-gray-500 px-6 gap-6 overflow-y-auto hide-scrollbar grid grid-cols-3 ">
                    {filteredLaboratories.map((labs) => (
                      <LabComp
                        id={labs._id}
                        name={labs.name}
                        phone={labs.phone}
                        address={labs.address}
                        city={labs.city}
                        bloodGroup={labs.bloodGroup}
                        bloodBank={labs.bloodBank}
                        pincode={labs.pincode}
                        email={labs.email}
                        facilities={labs.facilities}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="h-full w-full flex items-center justify-center">
                    No laboratories found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex justify-center w-full mt-14">
          <div className="w-full xl:w-[1280px] flex px-4">
            <div className="h-full w-[55%] flex flex-col mt-4">
              <div className="w-full h-[640px] bg-gradient-to-l from-[#fff7e4] to-white shadow-base border border-gray-300 p-4 py-3 rounded-[5px] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-700 text-sm">Appointments</h2>
                  <select
                    value={selectedApCategory}
                    onChange={(e) => setSelectedApCategory(e.target.value)}
                    className="bg-white text-gray-600 border border-gray-300 outline-none text-sm rounded-[7px] h-8 px-2 shadow-sm"
                  >
                    <option value="All">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {appointmentDetails?.length > 0 ? (
                    appointmentDetails.map((appointment, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-300 rounded-[5px] p-4 shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <h1 className="flex items-center">
                            {appointment.category.charAt(0).toUpperCase() +
                              appointment.category.slice(1).toLowerCase()}{" "}Test,&nbsp;
                            {appointment.labname}
                          </h1>
                          <span
                            className={`text-[10px] ml-3 font-medium ${appointment.status === "pending"
                              ? "text-red-500 bg-red-100 border border-red-500 px-2 py-0.5 rounded-[5px]"
                              : appointment.status === "completed"
                                ? "text-green-500 bg-green-100 border border-green-500 px-2 py-0.5 rounded-[5px]"
                                : "text-blue-500 bg-blue-100 border border-blue-500 px-2 py-0.5 rounded-[5px]"
                              }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Requested On: &nbsp;
                          {new Date(appointment.date).toLocaleString()}
                        </p>
                        {appointment.report ? (
                          <div>
                            <p className="text-xs text-gray-400 my-2">
                              Feedback: &nbsp;
                              {appointment.feedback}
                            </p>
                            <button
                              onClick={() => setSelectedReport(appointment.filename)}
                              className="h-7 mt-2 text-xs px-3 font-medium bg-green-600 text-white rounded-[5px] flex items-center justify-center"
                            >
                              View Report
                            </button>

                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 mt-48">
                      No Appointments.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="h-full w-[55%] flex flex-col mt-4 ml-4">
              <div className="w-full h-[640px] bg-gradient-to-l from-[#fff7e4] to-white shadow-base border border-gray-300 p-4 py-3 rounded-[5px] overflow-y-auto">
                {selectedReport !== "" ? (
                  <iframe className="h-full w-full" src={`http://localhost:5050/lifeflow/api/view/${selectedReport}`}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">No report to show</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {!isVerified && verificationModel ? (
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-65 flex items-center justify-center z-50">
          <div className="bg-gradient-to-l from-[#ffefc9] to-white relative p-5 rounded-[5px] border border-gray-300 shadow-lg w-[95%] md:w-[320px]">
            {/* Close Button */}
            <button
              onClick={closeVerificationModal}
              className="absolute top-4 right-4 text-gray-700 text-xl"
            >
              <IoClose />
            </button>
            <div>
              <h1 className="text-base w-full text-left Geist-semibold text-black ml-1 mb-2">
                Please verify yourself!
              </h1>
              <p className="text-xs text-start text-gray-700 mb-4 ml-1">
                Upload your blood report (PDF or image) to check if you are
                eligible to donate blood.
              </p>
              {isEligible ? (
                <div className="h-auto flex flex-col items-center justify-center w-full shadow-xl border border-gray-300 bg-gradient-to-l from-[#fff7e4] to-white  p-4 rounded-[5px] mb-4">
                  <h1 className="text-base w-full text-left Geist-semibold text-gray-600 ml-1 mb-2">
                    <span className="text-green-500 flex items-center justify-center font-medium">
                      Verified Donor
                    </span>
                  </h1>
                  <div className="w-full text-7xl flex justify-center text-green-600">
                    <VscVerifiedFilled />
                  </div>
                  <p className="text-xs text-center text-gray-500 mb-2 mt-2 ml-1 w-full">
                    Congratulations you're a verified donor!
                  </p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 mb-4">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="text-gray-700">
                    {selectedFile
                      ? "Selected file"
                      : "Click to upload or drag & drop"}
                  </span>
                  {selectedFile && (
                    <span className="text-[14px] text-blue-600 mt-1">
                      {trimFileName(selectedFile.name)}
                    </span>
                  )}
                  <span className="text-[10px] mt-1 text-gray-600">
                    Only JPG, PNG, PDF allowed
                  </span>
                </label>
              )}
              {result && (
                <div className="text-xs mb-3 mx-1">
                  <h2>{result}</h2>
                </div>
              )}
              {!isEligible ? (
                <button
                  onClick={extractText}
                  disabled={loading}
                  className="h-9 w-full text-xs font-medium bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
                >
                  {loading ? "Processing..." : "Check Eligibility"}
                </button>
              ) : (
                <button
                  onClick={closeVerificationModal}
                  className="h-9 w-full text-xs font-medium bg-green-600 text-white rounded-[5px] flex items-center justify-center"
                >
                  Complete Verification
                </button>
              )}
              <div className="w-full my-3 text-gray-600 justify-center text-xs flex">
                or
              </div>
              <h3 className="text-xs w-full flex items-center justify-center text-gray-800 mb-6 sm:mb-0">
                Don't have a report?
                <button
                  onClick={() => {
                    setVerificationModel(false);
                    setTab("laboratories");
                  }}
                  className="font-medium text-black"
                >
                  &nbsp;&nbsp;Book an appointment!&nbsp;
                </button>
              </h3>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {isAddDonationModalOpen ? (
        <AddDonation
          donorId={userDetails._id}
          onCancel={() => {
            setIsAddDonationModalOpen(false);
          }}
          userDetails={userDetails}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Donor;
