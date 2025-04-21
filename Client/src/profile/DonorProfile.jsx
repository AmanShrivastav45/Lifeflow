import React, { useState } from "react";
import { useAuthStore } from "../store/auth.js";
import { Link, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { VscVerifiedFilled } from "react-icons/vsc";
import { VscUnverified } from "react-icons/vsc";
import AddDonation from "../pages/modals/AddDonation.jsx";
import axios from "axios";
import { IoClose, IoLocationSharp } from "react-icons/io5";
import { CONSTANTS } from "../../../constants.js";
import toast from "react-hot-toast";
import Email from "../components/Email.jsx";

const DonorProfile = () => {
  const { user, logout } = useAuthStore();
  const userDetails = JSON.parse(localStorage.getItem("user")) || null;
  const isVerified = false;
  const donorId = useParams().userId || null;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [isEligible, setIsEligible] = useState(userDetails.isEligible);
  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };
  const [verificationModel, setVerificationModel] = useState(false);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [isAddDonationModalOpen, setIsAddDonationModalOpen] = useState(false);
  const [name, setName] = useState(userDetails.name);
  const [email, setEmail] = useState(userDetails.email);
  const [phone, setPhone] = useState(userDetails.phone);
  const [gender, setGender] = useState(userDetails.gender);
  const [bloodGroup, setBloodGroup] = useState(userDetails.bloodGroup);
  const [city, setCity] = useState(userDetails.city);
  const [pincode, setPincode] = useState(userDetails.pincode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const donor_donations = userDetails.donations;

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = async () => {
    if (isEditModeOn) {
      let updatedFields = {};
      if (name !== userDetails.name) updatedFields.name = name;
      if (phone !== userDetails.phone) updatedFields.phone = phone;
      if (gender !== userDetails.gender) updatedFields.gender = gender;
      if (bloodGroup !== userDetails.bloodGroup)
        updatedFields.bloodGroup = bloodGroup;
      if (city !== userDetails.city) updatedFields.city = city;
      if (pincode !== userDetails.pincode) updatedFields.pincode = pincode;

      if (Object.keys(updatedFields).length === 0) {
        setIsEditModeOn(!isEditModeOn);
        toast.success("No changes to make!");
        return;
      }
      updatedFields._id = userDetails._id;
      updatedFields.role = CONSTANTS.SCHEMA.DONOR;

      try {
        const response = await axios.put(
          `http://localhost:5050/lifeflow/api/${userDetails._id}/update`,
          updatedFields
        );

        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Updated profile successfully!");

        setIsEditModeOn(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error("Failed to update profile. Please try again.");
        console.error("Error updating profile:", error);
      }
    } else {
      setIsEditModeOn(false);
    }
  };

  const handleChangePassword = () => {
    toast.success("An email has been sent!");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  const updateEligibility = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5050/lifeflow/api/${donorId}/update`,
        {
          _id: userDetails._id,
          role: CONSTANTS.SCHEMA.DONOR,
          isEligible: true,
        }
      );

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
        // For PDF files
        const pdfData = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          extractedText += textContent.items.map((item) => item.str).join(" ");
        }
      } else {
        // For image files
        const { data } = await Tesseract.recognize(file, "eng");
        extractedText = data.text;
      }
      const cleanedText = extractedText.replace(/"/g, "") + userDetails;
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

  const formatDateTime = (isoDateStr) => {
    const date = new Date(isoDateStr);
  
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
  
    hours = hours % 12 || 12; // convert 0 → 12
    const formattedHours = hours.toString().padStart(2, "0");
  
    return `${day} ${month}, ${year}, ${formattedHours}:${minutes}${ampm}`;
  };  

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
                <Link to={`/donor/${donorId}`}
                  className="text-sm px-2 p-1 text-gray-500 hover:text-gray-800"
                >
                  Home
                </Link>
              </div>
            </div>
            <div className="flex relative items-center justify-between space-x-4">
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
              </button>
              {isProfileButtonOpen && user ? (
                <div
                  className="absolute right-0 top-full  min-w-48 mt-1 w-auto bg-white shadow-xl border border-gray-300 rounded-[5px]"
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

      <div className="h-full flex justify-center w-full mt-14">
        <div className="w-full xl:w-[1280px] flex px-4">
          <div className=" w-[75%] h-full text-md overflow-y-hidden mx-4 mt-4">
            <div className="w-full h-auto bg-gradient-to-l from-[#fff7e4] to-white shadow-base border border-gray-300 p-4 py-3 rounded-[5px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 p-2">
                <div className="w-full h-full flex items-center justify-center flex-col">
                  <h1 className="my-2 mb-4 sm:mt-0 text-lg text-start w-full text-black">
                    Profile Details
                  </h1>
                  <div className="space-y-4 flex flex-col w-full">
                    <div className="w-full flex items-center justify-between">
                      <div className="w-[33%] flex flex-col mr-1">
                        <div className="flex items-center">
                          <h1 className="text-xs mb-1 ml-0.5 mr-1">Username</h1>
                        </div>
                        <input
                          disabled={!isEditModeOn}
                          maxLength={16}
                          type="text"
                          placeholder="Enter your username"
                          className={`Geist border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center ${!isEditModeOn
                            ? "cursor-not-allowed text-gray-400 bg-gray-100"
                            : ""
                            }`}
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                      <div className="w-[33%] flex flex-col mx-1">
                        <div className="flex items-center">
                          <h1 className="text-xs mb-1 ml-0.5 mr-1">Email</h1>
                        </div>
                        <input
                          disabled={true}
                          type="text"
                          value={email}
                          className={`Geist border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 focus:outline-blue-400 px-2 h-9 text-xs rounded-[5px] flex items-center justify-center cursor-not-allowed text-gray-400 bg-white`}
                        />
                      </div>
                      <div className="w-[33%] flex flex-col ml-1">
                        <div className="flex items-center">
                          <h1 className="text-xs mb-1 ml-0.5 mr-1">
                            Phone number
                          </h1>
                        </div>
                        <input
                          disabled={!isEditModeOn}
                          maxLength={10}
                          type="text"
                          placeholder="Enter your phone number"
                          className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center ${!isEditModeOn
                            ? "cursor-not-allowed text-gray-400 bg-gray-100"
                            : ""
                            }`}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setPhone(value);
                            }
                          }}
                          value={phone}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex my-4 items-center justify-between mt-5">
                    <div className="w-[25%] flex flex-col mr-1">
                      <div className="flex items-center">
                        <h1 className="text-xs mb-1 ml-0.5 mr-1">
                          Blood Group
                        </h1>
                      </div>
                      <select
                        disabled={!isEditModeOn}
                        value={bloodGroup}
                        onChange={(e) => {
                          setBloodGroup(e.target.value);
                        }}
                        className={`border border-gray-400 w-full caret-black sm:placeholder:text-gray-700 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center ${!isEditModeOn
                          ? "cursor-not-allowed text-gray-400 bg-gray-100"
                          : ""
                          }`}
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
                    <div className="w-[25%] flex flex-col mx-1">
                      <div className="flex items-center">
                        <h1 className="text-xs mb-1 ml-0.5 mr-1">Gender</h1>
                      </div>
                      <select
                        disabled={!isEditModeOn}
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                        className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center ${!isEditModeOn
                          ? "cursor-not-allowed text-gray-400 bg-gray-100"
                          : ""
                          }`}
                      >
                        <option hidden>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="w-[25%] flex flex-col mx-1">
                      <div className="flex items-center">
                        <h1 className="text-xs mb-1 ml-0.5 mr-1">City</h1>
                      </div>
                      <select
                        disabled={!isEditModeOn}
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center ${!isEditModeOn
                          ? "cursor-not-allowed text-gray-400 bg-gray-100"
                          : ""
                          }`}
                      >
                        <option hidden>Select your city</option>
                        <option value="andheri">Andheri</option>
                        <option value="bandra">Bandra</option>
                        <option value="bhayandar">Bhayandar</option>
                        <option value="borivali">Borivali</option>
                        <option value="vasai">Vasai</option>
                        <option value="virar">Virar</option>
                      </select>
                    </div>
                    <div className="w-[25%] flex flex-col ml-1">
                      <div className="flex items-center">
                        <h1 className="text-xs mb-1 ml-0.5 mr-1">Pincode</h1>
                      </div>
                      <input
                        disabled={!isEditModeOn}
                        maxLength={6}
                        type="text"
                        placeholder="Enter your pincode"
                        className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center ${!isEditModeOn
                          ? "cursor-not-allowed text-gray-400 bg-gray-100"
                          : ""
                          }`}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setPincode(value);
                          }
                        }}
                        value={pincode}
                      />
                    </div>
                  </div>
                  <div className=" flex w-full items-center justify-between mt-4">
                    <h1 className="text-sm text-gray-500">
                      Last login: {userDetails.lastLogin}
                    </h1>
                    <div className="flex items-center">
                      {!isEditModeOn && (
                        <button
                          onClick={handleChangePassword}
                          className="py-2 px-3 text-xs font-medium bg-blue-500 text-white rounded-[5px] mr-2 flex items-center justify-center"
                        >
                          Change Password
                        </button>
                      )}
                      {isEditModeOn && (
                        <button
                          onClick={() => {
                            setIsEditModeOn(!isEditModeOn);
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          }}
                          className={`py-2 px-3 text-xs mr-2 font-medium  text-white rounded-[5px] flex items-center justify-center 
                            bg-red-600`}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={
                          isEditModeOn
                            ? handleUpdateProfile
                            : () => {
                              setIsEditModeOn(!isEditModeOn);
                            }
                        }
                        className={`py-2 px-3 text-xs font-medium  text-white rounded-[5px] flex items-center justify-center 
                            ${isEditModeOn ? "bg-green-600" : "bg-[#FF6C37]"}`}
                      >
                        {isEditModeOn ? "Confirm Updates" : "Update Profile"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[320px] bg-gradient-to-l my-4 from-[#fff7e4] to-white shadow-base border border-gray-300 p-4 py-3 rounded-[5px] ">
              <div className="flex h-full items-center justify-between mb-4 p-2 ">
                <div className="w-full h-full flex items-center justify-start flex-col my-8">
                  <h1 className="my-2 mb-4 sm:mt-0 text-lg text-start w-full text-black">
                    Your Donations
                  </h1>
                  {(donor_donations.map((donation) => (
                    <div className="bg-white border border-gray-300 rounded-[5px] p-4 shadow-sm mb-4 w-full">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center ">
                        <div className="flex ">
                          <div
                            className={`h-10 w-10 text-red-600 border border-red-600 flex bg-red-100 font-semibold items-center justify-center rounded-[50%] mr-4`}
                          >
                            {donation.bloodGroup}
                          </div>
                          <div className="flex flex-col items-start justify-center">
                            <h2 className="text-xs text-gray-500">
                              {donation.donationType.toUpperCase()}
                            </h2>
                            <h3 className="font-medium">{donation.address.charAt(0).toUpperCase() + donation.address.slice(1).toLowerCase()}, {donation.city.charAt(0).toUpperCase() + donation.city.slice(1).toLowerCase()}</h3>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div
                            className="px-2 py-1 rounded-[4px] bg-blue-500 text-white flex items-center justify-center text-xs"
                          >
                            {formatDateTime(donation.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-3 font-medium text-xs">
                        <p className=" px-2 p-1 text-blue-700 flex items-center justify-center border border-blue-600 bg-blue-100 rounded-[5px]">
                          <span className="">{donation.city.charAt(0).toUpperCase() + donation.city.slice(1).toLowerCase()}</span>
                        </p>
                        <p className=" px-2 p-1 text-blue-700 flex items-center justify-center border border-blue-600 bg-blue-100 rounded-[5px]">
                          <span className="">{donation.phone}</span>
                        </p>
                        <p className=" px-2 p-1 text-blue-700 flex items-center justify-center border border-blue-600 bg-blue-100 rounded-[5px]">
                          <span className="mr-1 mb-0.5">
                            <IoLocationSharp />
                          </span>
                          {donation.pincode}
                        </p>
                      </div>
                    </div>
                  )))}
                </div>
              </div>
            </div>
          </div>
          <div className=" w-[25%] h-full text-md overflow-y-hidden mt-4">
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
              <div className="h-auto flex flex-col items-center justify-center w-full shadow-xl border border-gray-300 bg-gradient-to-l from-[#fff7e4] to-white  p-4 rounded-[5px] mb-4">
                <h1 className="text-base w-full text-left Geist-semibold text-gray-600 ml-1 mb-2">
                  <span className="text-red-500 flex items-center justify-center font-medium">
                    Verify Yourself
                  </span>
                </h1>
                <div className="w-full text-7xl flex justify-center text-red-600">
                  <VscUnverified />
                </div>
                <p className="text-xs text-center text-gray-500 mb-2 mt-2 ml-1 w-full">
                  Please verify yourself to donate!
                </p>
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
              </div>
            )}
            <Email />
          </div>
        </div>
      </div>
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

export default DonorProfile;
