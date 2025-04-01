import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth.js";
import { Link, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import AddDonation from "../pages/modals/AddDonation.jsx";
import axios from "axios";
import { CONSTANTS } from "../../../constants.js";
import toast from "react-hot-toast";
import Email from "../components/Email.jsx";

const LaboratoryProfile = () => {
  const { user, logout } = useAuthStore();
  const userDetails = JSON.parse(localStorage.getItem("user")) || null;
  const laboratory = useParams().userId || null;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const [isEditModeOn, setIsEditModeOn] = useState(false);

  const [isUpdatePasswordModeOn, setUpdatePasswordModeOn] = useState(false);
  const [isAddDonationModalOpen, setIsAddDonationModalOpen] = useState(false);
  const [role, setRole] = useState("");

  const [name, setName] = useState(userDetails.name);
  const [updateName, setUpdateName] = useState(false);
  const [disableName, setDisableName] = useState(false);

  const [email, setEmail] = useState(userDetails.email);
  const [phone, setPhone] = useState(userDetails.phone);
  const [address, setAddress] = useState(userDetails.address);
  const [gender, setGender] = useState(userDetails.gender);
  const [bloodGroup, setBloodGroup] = useState(userDetails.bloodGroup);
  const [city, setCity] = useState(userDetails.city);
  const [pincode, setPincode] = useState(userDetails.pincode);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [modifiedFields, setModifiedFields] = useState({});

  const handleLogout = () => {
    logout();
  };

  const [passwordLengthErrorColor, setPasswordLengthErrorColor] =
    useState("text-[#303030]");
  const [passwordMatchErrorColor, setPasswordMatchErrorColor] =
    useState("text-[#303030]");

  useEffect(() => {
    if (password.length > 0 && password.length >= 8) {
      setPasswordLengthErrorColor("text-green-600");
    } else {
      setPasswordLengthErrorColor("text-[#303030]");
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length > 0 && password === confirmPassword) {
      setPasswordMatchErrorColor("text-green-600");
    } else {
      setPasswordMatchErrorColor("text-[#303030]");
    }
  }, [confirmPassword]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdateProfile = async () => {
    if (isEditModeOn) {
      let updatedFields = {};
      if (name !== userDetails.name) updatedFields.name = name;
      if (email !== userDetails.email) updatedFields.email = email;
      if (phone !== userDetails.phone) updatedFields.phone = phone;
      if (address !== userDetails.address) updatedFields.address = address;
      if (city !== userDetails.city) updatedFields.city = city;
      if (pincode !== userDetails.pincode) updatedFields.pincode = pincode;

      if (Object.keys(updatedFields).length === 0) {
        setIsEditModeOn(!isEditModeOn);
        toast.success("No changes to make!");
        return;
      }
      updatedFields._id = userDetails._id;
      updatedFields.role = CONSTANTS.SCHEMA.LABORATORY;

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
                <Link
                  to={`/laboratory/${laboratory}`}
                  className="text-sm px-1 text-gray-500 hover:text-gray-800"
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
                className="absolute right-0 top-full mt-1 w-auto min-w-48 bg-white shadow-xl border border-gray-300 rounded-[5px]"
                style={{ right: "10px", top: "25px" }}
                >
                  <div
                    className="text-gray-600"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      to={`/laboratory/${userDetails._id}/profile`}
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
                          <h1 className="text-xs mb-1 ml-0.5 mr-1">
                            Laboratory Name
                          </h1>
                        </div>
                        <input
                          disabled={!isEditModeOn}
                          maxLength={16}
                          type="text"
                          placeholder="Enter your username"
                          className={`Geist border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center ${
                            !isEditModeOn
                              ? "cursor-not-allowed text-gray-400 bg-gray-100"
                              : ""
                          }`}
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                      <div className="w-[33%] flex flex-col mx-1">
                        <div className="flex items-center">
                          <h1 className="text-xs mb-1 ml-0.5 mr-1">
                            Laboratory Email
                          </h1>
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
                            Laboratory Phone
                          </h1>
                        </div>
                        <input
                          disabled={!isEditModeOn}
                          maxLength={10}
                          type="text"
                          placeholder="Enter your phone number"
                          className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center ${
                            !isEditModeOn
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
                    <div className="w-[50%] flex flex-col mr-1">
                      <div className="flex items-center">
                        <h1 className="text-xs mb-1 ml-0.5 mr-1">
                          Laboratory Address
                        </h1>
                      </div>
                      <input
                        disabled={!isEditModeOn}
                        maxLength={50}
                        type="text"
                        placeholder="Enter your username"
                        className={`Geist border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center ${
                          !isEditModeOn
                            ? "cursor-not-allowed text-gray-400 bg-gray-100"
                            : ""
                        }`}
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                      />
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
                        className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center ${
                          !isEditModeOn
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
                        className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center ${
                          !isEditModeOn
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
          </div>
          <div className=" w-[25%] h-full text-md overflow-y-hidden mt-4">
            <Email />
          </div>
        </div>
      </div>
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

export default LaboratoryProfile;
