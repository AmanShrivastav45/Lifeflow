import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../fonts/stylesheet.css";
import { NavLink, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";
import toast from "react-hot-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodBank = () => {
  const { user, logout } = useAuthStore();
  const hospitalId = useParams().hospitalId;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [bloodGroupQuantities, setBloodGroupQuantities] = useState({});
  const [quantityInLiters, setQuantityInLiters] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [selectedBloodType, setSelectedBloodType] = useState(bloodGroups[0]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleQuantityChange = (change) => {
    setQuantityInLiters((prevQuantity) => Math.max(0, prevQuantity + change));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5050/lifeflow/auth/hospital/${hospitalId}/bloodbank`,
        {
          bloodType: selectedBloodType,
          quantityInLiters: parseFloat(quantityInLiters),
        }
      );
      toast.success(response.data.message);
      setMessage(response.data.message);
      fetchBloodBankDetails();
      setIsModalOpen(false); // Close the modal after submission
    } catch (error) {
      toast.error("Failed to update blood bank details");
      console.error("Error:", error);
    }
  };

  const fetchBloodBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/lifeflow/auth/${hospitalId}/bloodbank`
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

  useEffect(() => {
    fetchBloodBankDetails();
  }, [hospitalId]);

  return (
    <div>
      <div className="h-full w-full flex items-start justify-center text-white overflow-y-auto bg-[#0a0a0a] hide-scrollbar">
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col items-start text-white sm:p-3 hide-scrollbar">
          <div className="w-full text-white grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 Geist gap-6 overflow-y-auto hide-scrollbar">
            {bloodGroups.map((bloodGroup, index) => (
              <div
                key={index}
                className="h-[240px] w-auto bg-[#1a1a1a] flex flex-col p-2 rounded-[7px] border border-[#2e2e2e]"
              >
                <div
                  className={`h-[140px] rounded-[5px] flex items-center justify-center flex-col w-full bg-${
                    bloodGroup.includes("+") ? "green" : "red"
                  }-600`}
                >
                  <h1 className="text-white text-center text-5xl Geist-semibold">
                    {bloodGroup}
                  </h1>
                  <p className="text-white text-center">Blood</p>
                </div>
                <div className="flex flex-col p-2 ">
                  <div className="flex flex-col items-center justify-center space-x-2 mt-2">
                    <p className="text-white text-center px-2 text-xl mb-2">
                      Quantity:{" "}
                      {bloodGroupQuantities[bloodGroup]?.quantityInLiters}{" "}
                      liters
                    </p>
                    <p className="text-gray-500 text-center px-2 text-sm">
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
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <button
          className="rounded-[6px] bg-green-600 text-white h-12 Geist flex items-center justify-center text-lg px-4"
          onClick={() => setIsModalOpen(true)}
        >
          Update Blood Bank
        </button>
      </div>

      {/* Modal for updating blood bank details */}
      {isModalOpen && (
        <div className="fixed Geist inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-[#1a1a1a]  border border-[#2e2e2e] rounded-lg p-6 w-96">
            <h2 className="text-xl text-white font-semibold text-center mb-4">Update Blood Bank</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-white text-lg">
                <label className="block mb-1">Select Blood Type:</label>
                <select
                  value={selectedBloodType}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
                  className="outline-none bg-[#2a2a2a] rounded w-full p-2"
                >
                  {bloodGroups.map((bloodType) => (
                    <option key={bloodType} value={bloodType}>
                      {bloodType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 text-white text-lg">
                <label className="block mb-1">Quantity in Liters:</label>
                <input
                  type="number"
                  value={quantityInLiters}
                  onChange={(e) => setQuantityInLiters(e.target.value)}
                  className="outline-none bg-[#2a2a2a] rounded w-full p-2"
                />
              </div>
              <div className="w-full flex gap-4 justify-end mt-2">
              <button
                type="submit"
                className="bg-green-600 w-[80px] text-white rounded-lg p-2 "
              >
                Update
              </button>
              <button
                className="bg-red-600 w-[80px] text-white rounded-lg p-2"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBank;