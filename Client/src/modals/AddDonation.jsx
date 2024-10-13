import React, { useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const AddDonation = ({ donorId, onSuccess, onCancel }) => {
  const [donationType, setDonationType] = useState("blood");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("Select blood group");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    try {
      await axios.post(`http://localhost:5050/lifeflow/auth/donors/donations/:${donorId}`, {
        donorId,
        donationType, // Ensure this matches "blood" or "plasma"
        city,
        address,
        pincode,
        bloodGroup, // Ensure this matches "A+", "O-", etc.
        quantity, // Must be a positive number
      });
      onSuccess();
      resetForm();
    } catch (error) {
      setError("Error adding donation. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDonationType("blood");
    setCity("");
    setPincode("");
    setEmail("");
    setPhone("");
    setBloodGroup("Select blood group");
    setQuantity("");
  };

  return (
    <div
      style={{ zIndex: 10000 }}
      className="absolute top-0 bg-black bg-opacity-85 inset-0 left-0 h-screen w-full flex items-center justify-center"
    >
      <div className="relative rounded-[7px] w-[95%] md:w-[600px] bg-[#09090b] border border-[#2a2a2a] p-6">
        <button
          onClick={onCancel}
          className="text-2xl absolute top-4 right-4 text-gray-300"
        >
          <IoClose />
        </button>
        <form
          onSubmit={handleSubmit}
          className="py-2 w-full h-full flex items-center justify-center flex-col"
        >
          <h2 className="mb-6 text-3xl Geist-semibold text-white">
            Create Donation
          </h2>

          <div className="relative mb-4 w-full border border-[#2A2A2A] bg-[#09090b] outline-none h-12 rounded-[7px] flex">
            <div
              className={`absolute transition-all duration-300 ease-in-out ${
                donationType === "blood" ? "left-0" : "left-[50%]"
              } w-[50%] h-full bg-[#2a2a2a] rounded-[6px]`}
            />
            <button
              type="button"
              onClick={() => setDonationType("blood")}
              className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] items-center transition-colors duration-300 ease-in-out ${
                donationType === "blood"
                  ? "text-[#d6d6d6] border border-[#3a3a3a]"
                  : "text-[#68686F]"
              }`}
            >
              Blood
            </button>
            <button
              type="button"
              onClick={() => setDonationType("plasma")}
              className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] items-center transition-colors duration-300 ease-in-out ${
                donationType === "plasma"
                  ? "text-[#d6d6d6] border border-[#3a3a3a]"
                  : "text-[#68686F]"
              }`}
            >
              Plasma
            </button>
          </div>
          <div className="w-full flex items-center justify-center">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="Geist border border-[#2A2A2A] w-[50%] mr-2 caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-3 outline-none h-12 text-base text-[#5D5D63] rounded-[7px] flex items-center justify-center"
            >
              {bloodGroupOptions.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <input
              className="Geist border border-[#3a3a3a] w-[50%] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex ml-2 items-center justify-center"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="Enter quantity in ml"
            />
          </div>
          <textarea
            className="Geist border border-[#3a3a3a] w-full caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none my-4 text-base text-white rounded-[7px] py-2 resize-none overflow-y-auto "
            type="text"
            value={address}
            rows={3}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter your address "
            minLength={5}
            maxLength={60}
          />
          <div className="w-full flex items-center justify-center mb-4">
            <select
              style={{ zIndex: 1001 }}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              className="Geist border border-[#2A2A2A] w-[50%] mr-1 caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-3 outline-none h-12 text-base text-[#5D5D63] rounded-[7px] flex items-center justify-center"
            >
              <option value="">Select your city</option>
              <option value="Borivali">Borivali</option>
              <option value="Andheri">Andheri</option>
              <option value="Bandra">Bandra</option>
              <option value="Bhayandar">Bhayandar</option>
              <option value="Vasai">Vasai</option>
              <option value="Virar">Virar</option>
            </select>
            <input
              className="Geist border border-[#3a3a3a] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 h-12 px-4 outline-none text-base text-white rounded-[7px] py-2 resize-none overflow-y-auto w-[50%] ml-2"
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
              placeholder="Enter pincode"
              minLength={6}
              maxLength={6}
              pattern="\d{6}" // Ensure only digits
            />
          </div>
          {/* <div className="w-full flex items-center justify-center mb-4">
            <input
              className="Geist border border-[#3a3a3a] h-12 caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none text-base text-white rounded-[7px] py-2 resize-none overflow-y-auto w-[50%] mr-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
            <input
              className="Geist border border-[#3a3a3a] h-12 caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none text-base text-white rounded-[7px] py-2 resize-none overflow-y-auto w-[50%] ml-2"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} // Allow only digits
              required
              placeholder="Enter phone number"
              minLength={10}
              maxLength={15}
            />
          </div> */}
          {error && (
            <div className="text-red-400 p-2 mb-4 rounded">{error}</div>
          )}
          <div className="w-full flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 w-[50%] h-12 mr-2 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
            >
              {loading ? "Adding Donation..." : "Add Donation"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className=" bg-red-600 w-[50%] h-12 ml-2 text-white p-2 rounded hover:bg-red-700 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDonation;
