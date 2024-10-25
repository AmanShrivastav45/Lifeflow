import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoLocationSharp } from "react-icons/io5";
import { MdAccessTimeFilled } from "react-icons/md";

const Hospital = ({ name, address, city, bloodBank, distance }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleViewClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Blood group display names
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

  // Function to format the date (assuming lastUpdated is a date string)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the format as needed
  };

  // Function to handle quantity changes
  const handleRequest = () => {
    setTimeout(() => {
      toast.success("Request has been sent!");
    }, 500); // 1000 milliseconds = 1 second
  };

  return (
    <div className="bg-[#1a1a1a] Geist border border-[#2a2a2a] h-[200px] mb-6 overflow-hidden shadow-md rounded-[10px] p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <div className="h-16 w-16 bg-orange-600 rounded-[50%] mr-4"></div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-md text-gray-400">{city}</h2>
            <div className="flex items-center">
              <h3 className="text-3xl font-semibold">{name}</h3>
              <div className="h-2 w-2 bg-green-600 rounded-[50%] ml-2"></div>
              <span className="ml-1 Geist text-green-500">Live</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={handleViewClick}
            className="h-10 w-[100px] rounded-[5px] bg-purple-600 flex items-center justify-center font-semibold"
          >
            View
          </button>
        </div>
      </div>
      <div className="flex gap-3 flex-col items-start">
        <p className="text-sm flex items-center px-2 justify-center">
          <span className="mr-3">
            <IoLocationSharp />
          </span>
          {address}
        </p>
        <p className="text-sm bg-[#2a2a2a] h-8 flex items-center px-2 justify-center border rounded-[4px] border-[#3a3a3a]">
          <span className="mr-2">
            <MdAccessTimeFilled />
          </span>
          {distance} away
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black ">
          <div className=" rounded-lg p-6 w-[50%] bg-[#2e2e2e] bg-opacity-50 border border-[#3e3e3e]">
            <div className="flex">
              <div className="h-16 w-16 bg-orange-600 rounded-[50%] mr-4"></div>
              <div className="flex flex-col items-start justify-center">
                <h2 className="text-md text-gray-400">{city}</h2>
                <div className="flex items-center">
                  <h3 className="text-3xl font-semibold">{name}</h3>
                  <div className="h-2 w-2 bg-green-600 rounded-[50%] ml-2"></div>
                  <span className="ml-1 Geist text-green-500">Live</span>
                </div>
              </div>
            </div>
            <p className="mb-2 mt-4">
              <strong>Address:</strong> {address}
            </p>
            <p className="mb-2">
              <strong>City :</strong> {city}
            </p>
            <p className="mb-2">
              <strong>Distance:</strong> {distance} away
            </p>
            <h3 className="text-2xl text-center font-medium mb-4">Blood Bank Available</h3>
            <div className="w-full text-white grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 Geist  gap-6 overflow-y-auto hide-scrollbar">
              {Object.keys(bloodBank).map((bloodGroup, index) => (
                <div
                  key={index}
                  className={`h-[200px] w-auto bg-[#1a1a1a] flex flex-col items-center p-2 rounded-[7px] border border-[#2e2e2e]`}
                >
                  <div
                    className={`h-[100px] rounded-[5px] flex items-center justify-center flex-col w-full bg-${
                      bloodGroup.includes("plus") ? "green" : "red"
                    }-600`}
                  >
                    <h1 className="text-white text-center text-3xl Geist-semibold">
                      {bloodGroupDisplay[bloodGroup] || bloodGroup}
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
                    onClick={handleRequest}
                    className="text-white px-2 py-1 my-2 text-center text-md bg-blue-600 rounded-[5px] w-[80px]"
                  >
                    Request
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleCloseModal}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 my-6 rounded"
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
