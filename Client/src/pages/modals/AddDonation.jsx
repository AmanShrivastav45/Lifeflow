import React, { useState } from "react";
import axios, { toFormData } from "axios";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "../../store/auth";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AddDonation = ({ donorId, onCancel, userDetails }) => {
  const prevDonationDate = userDetails.donations[userDetails.donations.length-1]?.createdAt
  const [donationType, setDonationType] = useState("blood");
  const [address, setAddress] = useState(userDetails.address);
  const [city, setCity] = useState(userDetails.city);
  const [pincode, setPincode] = useState(userDetails.pincode);
  const [quantity, setQuantity] = useState("0.5");
  const [phone, setPhone] = useState(userDetails.phone);
  const [bloodGroup, setBloodGroup] = useState(userDetails.bloodGroup);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();

  const bloodGroupOptions = [
    "Select blood group",
    "A+",
    "A-",
    "AB+",
    "AB-",
    "B+",
    "B-",
    "O+",
    "O-",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (quantity <= 0) {
      setError("Please enter a valid quantity (greater than 0)");
      setLoading(false);
      return;
    }

    if (prevDonationDate) {
      const lastDonation = new Date(prevDonationDate);
      const today = new Date();
  
      const diffInTime = today.getTime() - lastDonation.getTime();
      const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
  
      if (diffInDays < 180) {
        const remainingDays = Math.ceil(180 - diffInDays);
        setError(`You must wait ${remainingDays} more day(s) before donating again.`);
        toast.error(`You must wait ${remainingDays} days before donating again.`);
        setLoading(false);
        onCancel()
        return;
      }
    }

    try {
      const response = await axios.post(
        `http://localhost:5050/lifeflow/api/donors/donations/:${donorId}`,
        {
          donorId,
          donationType,
          city,
          phone,
          address,
          pincode,
          bloodGroup,
          quantity,
        }
      );
      console.log(response)
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        const existingDonations = storedUser.donations || [];
        const updatedUser = {
          ...storedUser,
          donations: [...existingDonations, response.data.donation],
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }        
      toast.success("New donation created!")
      window.location.reload()
    } catch (error) {
      setError("Error adding donation. Please try again later.");
      console.error(error);
    } finally {
      resetForm();
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDonationType("blood");
    setCity("");
    setPincode("");
    setPhone("");
    setAddress("");
    setBloodGroup("Select blood group");
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-65 flex items-center justify-center z-50">
      <div className="w-[360px] sm:w-[380px] bg-white rounded-[8px] h-auto shadow-xl border border-gray-300 relative p-5 sm:p-6 sm:mt-10 py-0 mb-24">
        <button onClick={onCancel} className="text-2xl absolute top-4 right-4 text-gray-500" >
          <IoClose />
        </button>
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex items-center justify-center flex-col"
        >
          <h1 className="my-4 sm:mt-0 text-xl text-center font-semibold text-black">
            Add a donation
          </h1>
          <div className="space-y-4 flex flex-col w-full">
            <div className="w-full flex">
              <select
                value={donationType}
                onChange={(e) => {
                  setDonationType(e.target.value);
                }}
                className="border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
              >
                <option hidden>Select donation type</option>
                <option value="blood">Blood Donation</option>
                <option value="plasma">Plasma Donation</option>
              </select>
            </div>
            <div className="w-full flex my-4 justify-center">
              <select
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                }}
                className="border border-gray-400 w-[50%] caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
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
              <div className="w-[50%] flex items-center justify-center ml-1">
                <button
                  disabled={isLoading}
                  type="button"
                  className="h-9 w-9 text-sm mx-1 font-semibold bg-gray-400 text-white rounded-[5px] flex items-center justify-center"
                  onClick={() => {
                    if (parseFloat(quantity) - 0.5 < 0.5) {
                      toast.error("Minimum of 0.5 liters is allowed");
                    } else {
                      setQuantity((prev) =>
                        (parseFloat(prev) - 0.5).toFixed(1)
                      );
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="5"
                  className="border border-gray-400 w-[50%] caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center"
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);
                    if (!isNaN(value) && value % 0.5 === 0) {
                      if (value > 5) {
                        toast.error("Maximum of 5 liters is allowed");
                      } else {
                        setQuantity(value);
                      }
                    }
                  }}
                  value={quantity}
                />
                <button
                  disabled={isLoading}
                  type="button"
                  className="h-9 w-9 text-sm ml-1 font-semibold bg-gray-400 text-white rounded-[5px] flex items-center justify-center"
                  onClick={() => {
                    if (parseFloat(quantity) + 0.5 > 5) {
                      toast.error("Maximum of 5 liters is allowed");
                    } else {
                      setQuantity((prev) =>
                        (parseFloat(prev) + 0.5).toFixed(1)
                      );
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <input
              maxLength={10}
              type="text"
              placeholder="Enter your contact number"
              className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center`}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setPhone(value);
                }
              }}
              value={phone}
            />
            <textarea
              maxLength={100}
              type="text"
              rows={2}
              placeholder="Enter your address"
              className={`resize-none border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 p-2 text-xs text-black rounded-[5px] flex items-center justify-center`}
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </div>
          <div style={{ zIndex: 1001 }} className="w-full flex mt-4">
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              className="border border-gray-400 w-[50%] mr-1 caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
            >
              <option hidden>Select your city</option>
              <option value="andheri">Andheri</option>
              <option value="bandra">Bandra</option>
              <option value="bhayandar">Bhayandar</option>
              <option value="borivali">Borivali</option>
              <option value="vasai">Vasai</option>
              <option value="virar">Virar</option>
            </select>
            <input
              maxLength={6}
              type="text"
              placeholder="Enter your pincode"
              className={`border border-gray-400 w-[50%] ml-1 caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center`}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setPincode(value);
                }
              }}
              value={pincode}
            />
          </div>
          <div className="w-full flex items-center justify-center mb-6 sm:mb-0">
            <button
              disabled={isLoading}
              type="submit"
              className="h-9 mt-4 w-[50%] text-xs mr-1 font-medium bg-red-600 text-white rounded-[5px] flex items-center justify-center"
            >
              {isLoading ? <Loader size={18} /> : "Cancel"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              type="submit"
              className="h-9 mt-4 w-[50%] text-xs ml-1 font-medium bg-green-600 text-white rounded-[5px] flex items-center justify-center"
            >
              {isLoading ? <Loader size={18} /> : "Add Donation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDonation;
