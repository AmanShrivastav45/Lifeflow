import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoLocationSharp } from "react-icons/io5";
import { useAuthStore } from "../../store/auth";
import { useParams } from "react-router-dom";
import axios from "axios";

const Hospital = ({ name, address, city, bloodBank, id }) => {
  const { user } = useAuthStore();
  const recieverId = useParams().recieverId || null;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");

  const handleViewClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const bloodGroupDisplay = {
    "A+": "A+",
    "A-": "A-",
    "B+": "B+",
    "B-": "B-",
    "O+": "O+",
    "O-": "O-",
    "AB+": "AB+",
    "AB-": "AB-",
  };

  const bloodGroupDisplay2 = [
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
    "AB+",
    "AB-",
  ];
  
  const handleClick = (bloodGroup) => {
    setSelectedBloodGroup(bloodGroupDisplay2[bloodGroup]);
    handleRequest(bloodGroupDisplay2[bloodGroup]);
  };

  const handleRequest = async (bloodGroup) => {
    try {
      const requestData = {
        receiverId: user._id,
        receiverName: user.firstName,
        bloodGroup: bloodGroup,
        contactInfo: user.phone,
        city: user.city,
      };
      await axios.post(
        `http://localhost:5050/lifeflow/auth/hospital/${id}/request`,
        requestData
      );

      toast.success("Donation request sent successfully.");
      setSelectedBloodGroup("");
    } catch (error) {
      console.error("Error sending donation request:", error);
      toast.error("Failed to send donation request.");
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] h-[160px] mb-6 overflow-hidden shadow-md rounded-[10px] p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <div className="h-14 w-14 bg-orange-600 rounded-full mr-4"></div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-sm text-gray-400">{city}</h2>
            <div className="flex items-center">
              <h3 className="text-2xl font-medium">{name}</h3>
              <div className="h-2 w-2 bg-green-600 rounded-full ml-3"></div>
              <span className="ml-1 text-green-500">Live</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={handleViewClick}
            className="h-10 w-[100px] rounded-[5px] bg-purple-600 flex items-center justify-center font-semibold text-white"
          >
            View
          </button>
        </div>
      </div>
      <div className="flex gap-3 flex-col items-start">
        <p className="text-md flex items-center px-2 justify-center">
          <span className="mr-3">
            <IoLocationSharp />
          </span>
          {address}
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="rounded-lg p-6 w-[50%] bg-[#2e2e2e] border border-[#3e3e3e]">
            <div className="flex">
              <div className="h-16 w-16 bg-orange-600 rounded-full mr-4"></div>
              <div className="flex flex-col items-start justify-center">
                <h2 className="text-md text-gray-400">{city}</h2>
                <div className="flex items-center">
                  <h3 className="text-3xl font-medium">{name}</h3>
                  <div className="h-2 w-2 bg-green-600 rounded-full ml-3"></div>
                  <span className="ml-1 text-green-500">Live</span>
                </div>
              </div>
            </div>
            <p className="mb-2 mt-4">
              <strong>Address:</strong> {address}
            </p>
            <p className="mb-2">
              <strong>City:</strong> {city}
            </p>
            <h3 className="text-2xl text-center font-medium mb-4">
              Blood Bank Available
            </h3>
            <div className="w-full text-white grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto hide-scrollbar">
              {Object.keys(bloodBank).map((bloodGroup, index) => (
                <div
                  key={index}
                  className={`h-[200px] w-auto bg-[#1a1a1a] flex flex-col items-center p-2 rounded-[7px] border border-[#2e2e2e]`}
                >
                  <div
                    className={`h-[100px] rounded-[5px] flex items-center justify-center flex-col w-full ${
                      bloodGroupDisplay2[bloodGroup].includes("+") ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    <h1 className="text-white text-center text-3xl font-semibold">
                      {bloodGroupDisplay2[bloodGroup]}
                    </h1>
                    <p className="text-white text-center">Blood</p>
                  </div>
                  <div className="flex flex-col p-2">
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <p className="text-white text-center px-2">
                        Quantity: {bloodBank[bloodGroup].quantityInLiters}{" "}
                        liters
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleClick(bloodGroup)}
                    className="text-white px-2 py-1 my-2 text-center text-md bg-blue-600 rounded-[5px] w-[80px]"
                    aria-label="Request Blood"
                  >
                    Request
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleCloseModal}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 my-6 rounded"
              aria-label="Close Modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospital;
