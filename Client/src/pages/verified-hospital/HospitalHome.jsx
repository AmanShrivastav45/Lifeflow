import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../fonts/stylesheet.css";
import { NavLink, Link, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";
import toast from "react-hot-toast";

const HospitalHome = () => {
  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const recieverId = useParams().recieverId || null;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const [bloodGroup, setBloodGroup] = useState("");
  const [quantityInLiters, setQuantityInLiters] = useState("");
  const [bloodBank, setBloodBank] = useState([]); // Initialize as an empty array
  const [message, setMessage] = useState("");
  const hospitalId = useParams().hospitalId;

  // Fetch all blood bank details when the component mounts
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11) and pad
    const year = date.getFullYear(); // Get full year
    return `${day}/${month}/${year}`; // Return formatted date
  };

  useEffect(() => {
    const fetchBloodBankDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/lifeflow/auth/${hospitalId}/bloodbank`
        );
        setBloodBank(response.data.bloodBank); // Update your state with the fetched data
      } catch (error) {
        console.error("Error fetching blood bank details:", error);
      }
    };

    fetchBloodBankDetails();
  }, [hospitalId]);

  const handleAddBloodBankDetails = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5050/lifeflow/auth/hospital/${hospitalId}/bloodbank`,
        { bloodGroup, quantityInLiters }
      );

      setMessage("Blood bank details added successfully");
      setBloodGroup("");
      setQuantityInLiters("");
      setBloodBank(response.data.bloodGroups); // Update the blood bank list
    } catch (error) {
      console.error("Error adding blood bank details:", error);
      setMessage("Failed to add blood bank details");
    }
  };

  const [bloodGroupQuantities, setBloodGroupQuantities] = useState({});

  useEffect(() => {
    const fetchBloodBankDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/lifeflow/auth/${hospitalId}/bloodbank`
        );
        const bloodBank = response.data.bloodBank;
        const initialQuantities = {};
        Object.keys(bloodBank).forEach((bloodGroup) => {
          initialQuantities[bloodGroup] =
            bloodBank[bloodGroup].quantityInLiters;
        });
        setBloodGroupQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching blood bank details:", error);
      }
    };

    fetchBloodBankDetails();
  }, [hospitalId]);

  const handleQuantityChange = async (bloodGroup, change) => {
    setBloodGroupQuantities((prevQuantities) => ({
      ...prevQuantities,
      [bloodGroup]: Math.max(0, prevQuantities[bloodGroup] + change),
    }));
  };

  const handleUpdateData = async () => {
    try {
      toast.success("Data updated successfully!");
      const response = await axios.put(
        `http://localhost:5050/lifeflow/auth/hospital/${hospitalId}/bloodbank`,
        JSON.stringify(bloodGroupQuantities),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Blood bank details updated successfully");
    } catch (error) {
      console.error("Error updating blood bank quantities:", error);
      setMessage("Failed to update blood bank details");
    }
  };
  // Function to handle quantity change
  const bloodGroupDisplay = {
    Aplus: "A+",
    Aminus: "A-",
    Bplus: "B+",
    Bminus: "B-",
    Oplus: "O+",
    Ominus: "O-",
    ABplus: "AB+",
    ABminus: "AB-",
  };

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <div
        style={{ zIndex: "1000" }}
        className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]"
      >
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-md p-2">
            <div className="flex items-center">
              <div className="relative w-[40px] flex items-center mx-2">
                <NavLink to="/">
                  <img src={logo} className="h-8" alt="logo" />
                </NavLink>
              </div>
              <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
                LIFEFLOW
              </h1>
            </div>
            <h1 className="text-white text-xl Geist">
              {user?.name || "Unknown"}&nbsp;Hospital
            </h1>
            <div className="flex relative justify-between space-x-4">
              <div className="text-white bg-blue-700 px-2 py-2 rounded-[5px] flex items-center justify-center">
                <button onClick={handleUpdateData}>Update Data</button>
              </div>
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[50%]"></div>
              </button>
              {isProfileButtonOpen && user ? (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-[#1e1e1e] rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                  style={{ right: "10px", top: "25px" }}
                >
                  <div
                    className="text-[#68686f]"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div
                      className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] w-full text-left"
                      role="menuitem"
                    >
                      <span>Hospital: </span>
                      <span className="Geist text-gray-300">
                        {user?.name || "Unknown"}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] hover:text-gray-400 w-full text-left"
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
      <div className="h-full w-full mt-24 flex items-start justify-center text-white overflow-y-auto hide-scrollbar">
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex items-start text-white sm:p-3 hide-scrollbar">
          <div className="w-full text-white grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 Geist  gap-6 overflow-y-auto hide-scrollbar">
            {Object.keys(bloodBank).map((bloodGroup, index) => (
              <div
                key={index}
                className={`h-[280px] w-auto bg-[#1a1a1a] flex flex-col p-2 rounded-[7px] border border-[#2e2e2e]`}
              >
                <div
                  className={`h-[160px] rounded-[5px] flex items-center justify-center flex-col w-full bg-${
                    bloodGroup.includes("plus") ? "green" : "red"
                  }-600`}
                >
                  <h1 className="text-white text-center text-5xl Geist-semibold">
                    {bloodGroupDisplay[bloodGroup] || bloodGroup}ve
                  </h1>
                  <p className="text-white text-center">Blood</p>
                </div>
                <div className="flex flex-col p-2">
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <button
                      onClick={() => handleQuantityChange(bloodGroup, -1)} // Decrease quantity
                      className="bg-[#1e1e1e] border border-[#3a3a3a] h-10 w-10 hover:bg-[#2e2e2e] text-white font-bold py-1 px-2 rounded text-xl"
                    >
                      -
                    </button>
                    <p className="text-white text-center px-2">
                      Quantity: {bloodGroupQuantities[bloodGroup]} liters
                    </p>

                    <button
                      onClick={() => handleQuantityChange(bloodGroup, 1)} // Increase quantity
                      className="bg-[#1e1e1e] border border-[#3a3a3a] h-10 w-10 hover:bg-[#2e2e2e] text-white font-semibold py-1 px-2 rounded text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 my-2 text-center text-sm">
                  Last Updated: {formatDate(bloodBank[bloodGroup].lastUpdated)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalHome;
