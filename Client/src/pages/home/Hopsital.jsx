import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";
import toast from "react-hot-toast";
import BloodBank from "./BloodBank";
import Email from "../../components/Email";
import { CONSTANTS } from "../../../../constants";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const Hopsital = () => {
  const { user, logout } = useAuthStore();
  const userDetails = JSON.parse(localStorage.getItem("user")) || null;
  const hospitalId = useParams().userId;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [tab, setTab] = useState("bloodbank");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [bloodGroup, setBloodGroup] = useState([]);
  const handleLogout = () => {
    logout();
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

  const [bloodGroupQuantities, setBloodGroupQuantities] = useState({});
  const [quantityInLiters, setQuantityInLiters] = useState("0.5");
  const [selectedBloodType, setSelectedBloodType] = useState(bloodGroups[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5050/lifeflow/api/hospital/${hospitalId}/bloodbank`,
        {
          bloodType: selectedBloodType,
          quantityInLiters: parseFloat(quantityInLiters),
        }
      );
      toast.success(response.data.message);
      setMessage(response.data.message);
      fetchBloodBankDetails();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update blood bank details");
      console.error("Error:", error);
    }
  };

  const fetchBloodBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/lifeflow/api/${hospitalId}/bloodbank`
      );
      const bloodBank = response.data.bloodBank;
      const initialQuantities = {};
      bloodGroups.forEach((bloodGroup) => {
        const entry = bloodBank.find((entry) => entry.bloodType === bloodGroup);
        initialQuantities[bloodGroup] = entry
          ? {
              quantityInLiters: entry.quantityInLiters,
              lastUpdated: entry.lastUpdated,
            }
          : { quantityInLiters: 0, lastUpdated: null };
      });
      setBloodGroupQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching blood bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/lifeflow/api/${hospitalId}/requests`
      );
      const requests = response.data.requestsReceived;
      console.log("Req: ", requests);
      setRequests(requests);
    } catch (error) {
      console.error("Error fetching blood bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBankDetails();
    fetchRequestDetails();
  }, [hospitalId]);

  const filteredRequests = Array.isArray(requests)
  ? requests.filter((lab) => {
      const categoryMatch =
        selectedCategory === "All" || lab.status === selectedCategory;

      const bloodGroupMatch =
        bloodGroup.length === 0 || bloodGroup.includes(lab.bloodGroup);

      return categoryMatch && bloodGroupMatch;
    })
  : [];

  return (
    <div className="h-screen w-full flex justify-center">
      <div className="fixed top-0 w-full h-14 flex justify-center bg-white border-b border-gray-300">
        <div className="w-full xl:w-[1280px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-sm p-2">
            <div className="flex items-center">
              <div className="relative flex items-center mx-2">
                <button className="flex items-center justify-center mr-4">
                  <img src={logo} className="h-6 mb-1" alt="logo" />
                </button>
                <button
                  onClick={() => setTab("bloodbank")}
                  className={`flex items-center justify-center mx-4 ml-2 ${
                    tab === "bloodbank" ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  Bloodbank
                </button>
                <button
                  onClick={() => setTab("requests")}
                  className={`flex items-center justify-center mx-4 ${
                    tab === "requests" ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  Requests
                </button>
              </div>
            </div>
            <div className="flex relative items-center justify-between space-x-4">
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
                      to={`/hospital/${userDetails._id}/profile`}
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
      {tab === "bloodbank" ? (
        <div className="flex flex-col w-full xl:w-[1280px] px-4 mb-4 gap-6 Geist text-white">
          <div>
            <div className="h-full w-full mt-16 flex items-start justify-center text-white overflow-y-auto hide-scrollbar ">
              <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col items-start text-white sm:p-3 hide-scrollbar">
                <div className="w-full text-white grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 Geist gap-6 overflow-y-auto hide-scrollbar">
                  {bloodGroups.map((bloodGroup, index) => (
                    <div
                      key={index}
                      className="h-auto w-auto bg-gradient-to-l from-[#ffefc9] to-white flex flex-col p-2 rounded-[5px] border border-gray-300 shadow-md"
                    >
                      <div
                        className={`h-[100px] rounded-[5px] flex items-center justify-center flex-col w-full ${
                          bloodGroup.includes("+")
                            ? "bg-green-200 text-green-600 border-green-500 border border-dashed"
                            : "bg-red-200 text-red-600 border-red-500 border border-dashed"
                        }`}
                      >
                        <h1 className="text-center text-3xl Geist-semibold">
                          {bloodGroup}
                        </h1>
                        <p className="text-center">Blood</p>
                      </div>
                      <div className="flex flex-col p-2 ">
                        <div className="flex flex-col items-center justify-center space-x-2 mt-2">
                          <p className="text-gray-700 text-center px-2 mb-2">
                            Quantity:{" "}
                            {bloodGroupQuantities[bloodGroup]?.quantityInLiters}{" "}
                            liters
                          </p>
                          <p className="text-gray-500 text-center px-2 text-xs">
                            Last Updated:{" "}
                            {bloodGroupQuantities[bloodGroup]?.lastUpdated
                              ? new Date(
                                  bloodGroupQuantities[bloodGroup].lastUpdated
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full flex items-center justify-center mt-6">
                  <button
                    className="rounded-[5px] bg-green-600 text-white Geist flex items-center justify-center text-sm px-3 py-1.5"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Update Blood Bank
                  </button>
                </div>
              </div>
            </div>

            {/* Modal for updating blood bank details */}
            {isModalOpen && (
              <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-65 flex items-center justify-center z-50">
                <div className="bg-gradient-to-l from-[#ffefc9] to-white relative p-5 rounded-[5px] border border-gray-300 shadow-lg w-96">
                  <h2 className="text-gray-700 text-start mb-4">
                    Update Blood Bank
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2 text-gray-600 flex text-sm">
                      <div className="w-[50%] mr-1">
                        <label className="block mb-1 ml-0.5">
                          Select Blood Type:
                        </label>
                        <select
                          value={selectedBloodType}
                          onChange={(e) => setSelectedBloodType(e.target.value)}
                          className="border border-gray-400 w-full mr-1 caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
                        >
                          <option hidden>Blood group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="mb-4 ml-1 text-gray-600 w-[50%] text-sm">
                        <label className="block mb-1 ml-0.5">
                          Quantity in Liters:
                        </label>
                        <input
                          type="number"
                          value={quantityInLiters}
                          onChange={(e) => {
                            let value = parseFloat(e.target.value);
                            if (isNaN(value)) value = 0;
                            value = Math.max(0, Math.min(5, value));
                            setQuantityInLiters(value);
                          }}
                          min="0"
                          max="5"
                          step="0.5"
                          className="outline-none bg-white caret-black border border-gray-400 rounded w-full p-2"
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-2 justify-end text-sm">
                      <button
                        className="bg-red-600 text-white rounded-[5px] px-3 py-1"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 text-white rounded-[5px] px-3 py-1"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full w-full mt-16 flex items-start justify-center text-gray-500 overflow-y-auto hide-scrollbar">
          <div className="w-full xl:w-[1280px] flex items-start sm:p-4 hide-scrollbar">
            <div className="h-full w-[20%] flex flex-col">
              <ul className="p-4 shadow-xl border border-gray-300 bg-gradient-to-l text-gray-500 from-[#fff7e4] to-white rounded-[5px] h-auto">
                <h1 className="text-sm text-gray-700">Filters</h1>
                <div className="mt-4">
                  <h1 className="text-sm">Blood Group</h1>
                  <ul className="text-xs flex flex-wrap w-full">
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
            <div className="h-full w-[55%] flex flex-col mx-4">
              <div className="w-full h-[640px] bg-white border border-gray-300 p-4 py-3 rounded-[5px] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-700 text-sm">Blood Requests</h2>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white text-gray-600 border border-gray-300 outline-none text-sm rounded-[7px] h-8 px-2 shadow-sm"
                  >
                    <option value="All">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {filteredRequests.length === 0 ? (
                  <p className="w-full flex items-center justify-center text-sm mt-24">No reports available.</p>
                ) : (
                  filteredRequests.map((lab) => {
                    const dateObj = new Date(lab.requestedAt);

                    // Get formatted date components
                    const day = dateObj.getDate();
                    const month = dateObj.toLocaleString("en-US", {
                      month: "long",
                    });
                    const year = dateObj.getFullYear().toString().slice(-2);
                    const hours = dateObj.getHours();
                    const minutes = dateObj
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    const period = hours >= 12 ? "pm" : "am";

                    const getOrdinal = (n) => {
                      if (n > 3 && n < 21) return `${n}th`;
                      switch (n % 10) {
                        case 1:
                          return `${n}st`;
                        case 2:
                          return `${n}nd`;
                        case 3:
                          return `${n}rd`;
                        default:
                          return `${n}th`;
                      }
                    };

                    const formattedDate = `${getOrdinal(
                      day
                    )} ${month}, ${year}, ${
                      hours % 12 || 12
                    }.${minutes} ${period}`;

                    return (
                      <div
                        key={lab.receiverId}
                        className="flex flex-col items-center justify-between my-2 bg-gray-50 p-2 rounded-[5px] border border-gray-300 pl-3"
                      >
                        <div className="flex justify-between w-full mb-2">
                          <div className="flex space-x-2 items-center">
                            <h3 className="text-sm font-medium">
                              {lab.receiverName}
                            </h3>
                            <h3 className="text-[10px] p-[0.5px] bg-green-100 px-2 rounded-[5px] border border-green-400">
                              {lab.status}
                            </h3>
                          </div>
                          <h3 className="text-xs mt-0.5 mr-0.5">
                            {formattedDate}
                          </h3>
                        </div>
                        <div className="flex w-full text-xs space-x-2 my-1.5">
                          <div className="p-0.5 bg-blue-100 px-2 rounded-[5px] border border-gray-300">
                            Blood Group: {lab.bloodGroup}
                          </div>
                          <div className="p-0.5 bg-blue-100 px-2 rounded-[5px] border border-gray-300">
                            {lab.contactInfo}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="h-full w-[25%] flex flex-col">
              <Email />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hopsital;
