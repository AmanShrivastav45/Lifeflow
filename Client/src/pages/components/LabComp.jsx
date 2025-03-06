import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoLocationSharp } from "react-icons/io5";
import { useAuthStore } from "../../store/auth";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPhone } from "react-icons/fa6";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdEmail } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const LabComp = ({
  name,
  address,
  city,
  id,
  phone,
  pincode,
  email,
  facilities,
}) => {
  const { user } = useAuthStore();
  const recieverId = useParams().userId || null;
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

  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const timeSlots = ["9-12", "12-3", "3-6", "6-9"];

  const handleAppointment = async () => {
    console.log("Id: ", id)
    console.log("UserId: ", user._id)
    try {
      const requestData = {
        donorId: user._id,
        category,
        date,
        timeslot,
        phone: phoneNo,
      };
      console.log(requestData);
      await axios.post(
        `http://localhost:5050/lifeflow/api/laboratory/${id}/request`,
        requestData
      );

      toast.success("Appointment request sent successfully.");
      setModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create an appointment.");
      setModalOpen(false);
    }
  };

  return (
    <div className="bg-gradient-to-l from-[#ffefc9] to-white border border-gray-300 h-fit overflow-hidden shadow-sm rounded-[5px] p-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex">
          <div className="text-2xl text-green-500 mr-2">
            <VscVerifiedFilled />
          </div>
          <div className="flex flex-col items-start justify-center">
            <div className="flex items">
              <h3 className="font-medium">
                {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()},{" "}
                {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex mb-2 space-x-2 px-0.5">
        {facilities.slice(0, 3).map((facility, index) => (
          <div
            key={index}
            className="text-[12px] px-2 py-0.5 text-blue-600 border rounded-[5px] border-blue-600 bg-blue-100"
          >
            {facility}
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 flex-col items-start">
        <p className="text-xs flex items-center px-2 justify-center">
          Address:&nbsp;
          {address.charAt(0).toUpperCase() +
            address.slice(1).toLowerCase()}, {" " + pincode}
        </p>
        <p className="text-xs flex items-center px-2 justify-center">
          Contact No:&nbsp;
          {"+91 " + phone}
        </p>
        <p className="text-xs flex items-center px-2 justify-center">
          Email address:&nbsp;
          {email}
        </p>
      </div>
      <div className="flex mt-3">
        <button
          onClick={handleViewClick}
          className="rounded-[5px] bg-orange-500 flex items-center justify-center text-xs px-3 ml-1 py-1 font-medium text-white"
        >
          Book an appointment
        </button>
      </div>
      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-65 flex items-center justify-center z-50">
          <div className="bg-gradient-to-l from-[#ffefc9] to-white p-5 rounded-[5px] relative border border-gray-300 shadow-lg w-[420px] pb-3">
            <button
              onClick={handleCloseModal}
              className="text-2xl absolute top-4 right-4 text-gray-700"
            >
              <IoClose />
            </button>
            <div className="flex">
              <div className="text-3xl text-green-500 mr-2 mb-0.5">
                <VscVerifiedFilled />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-black">
                    {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                    ,&nbsp;
                    {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}
                  </h3>
                </div>
              </div>
            </div>
            <h1 className="text-sm text-gray-600 my-2">
              All available facilities
            </h1>
            <div className="w-full flex flex-wrap mb-2 space-x-2 border-b border-dashed border-gray-400 pb-2.5">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="text-[12px] px-2 py-0.5 text-blue-600 border rounded-[5px] border-blue-600 bg-blue-100"
                >
                  {facility}
                </div>
              ))}
            </div>
            <div className="w-full my-3 text-gray-600 flex flex-col">
              <h1 className="text-base text-gray-700 text-center">
                Book an appointment now
              </h1>
              <div className="w-full mt-4 max-w-md text-sm">
                <label className="block mb-2">
                  <span className="text-gray-500 text-sm">Select Facility</span>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                    required
                    className="mt-1 block w-full p-1.5 border border-gray-300 rounded"
                  >
                    <option hidden value="">
                      Choose a facility
                    </option>
                    {facilities.map((facility, index) => (
                      <option key={index} value={facility}>
                        {facility}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Date Selection */}
                <label className="block mb-2">
                  <span className="text-gray-700">Select Date</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]} 
                    max={
                      new Date(new Date().setDate(new Date().getDate() + 7))
                        .toISOString()
                        .split("T")[0]
                    } 
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </label>

                {/* Time Slot Selection */}
                <label className="block mb-2">
                  <span className="text-gray-700">Select Time Slot</span>
                  <select
                    value={timeslot}
                    onChange={(e) => {
                      setTimeslot(e.target.value);
                    }}
                    required
                    className="mt-1 block w-full p-1.5 border border-gray-300 rounded"
                  >
                    <option hidden value="">
                      Choose a time slot
                    </option>
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>

                {/* phone Number */}
                <label className="block mb-2">
                  <span className="text-gray-700">phone Number</span>
                  <input
                    type="tel"
                    value={phoneNo}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setPhoneNo(e.target.value);
                      }
                    }}
                    required
                    placeholder="Enter your phone number"
                    className="mt-1 block w-full p-1.5 border border-gray-300 rounded"
                  />
                </label>

                {/* Submit Button */}
                <button
                  onClick={handleAppointment}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-3"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabComp;
