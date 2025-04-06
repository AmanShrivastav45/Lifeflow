import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BiHide, BiShow } from "react-icons/bi";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import logo from "../../assets/logo.png";
import Loader from "../components/Loader.jsx";
import { useAuthStore } from "../../store/auth.js";
import { CITY } from "../constants/city";
import { BLOODGROUP } from "../constants/bloodGroup";
import { GENDER } from "../constants/gender";
import { CONSTANTS } from "../../../../constants.js";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signup, error, isLoading } = useAuthStore();

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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      name.length === 0 ||
      email.length === 0 ||
      phone.length === 0 ||
      pincode.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 ||
      !Object.values(CITY).includes(city) ||
      !Object.values(BLOODGROUP).includes(bloodGroup) ||
      !Object.values(GENDER).includes(gender)
    ) {
      toast.error("Please fill all the details!");
      return;
    }

    if (password.length === 0) {
      setPasswordLengthErrorColor("text-red-400");
      passwordHasError = true;
    } else {
      if (password.length < 8) {
        setPasswordLengthErrorColor("text-red-400");
        passwordHasError = true;
      } else {
        setPasswordLengthErrorColor("text-green-600");
      }
    }

    if (password !== confirmPassword) {
      setPasswordMatchErrorColor("text-red-400");
      return;
    }

    try {
      const res = await signup(
        role,
        name,
        email,
        phone,
        bloodGroup,
        gender,
        city,
        pincode,
        password
      );
      if (res.success === false){
        toast.error(res.message)
        return;
      } 
      navigate("/verify-email");
    } catch (error) {
      console.log("here");
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      console.error(message);
      toast.error(message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const UserType = () => {
    return (
      <div className="w-full flex justify-center text-base">
        <div className="w-[360px] sm:w-[380px] bg-white rounded-[8px] h-auto shadow-xl border border-gray-300 p-5 sm:p-6 sm:mt-10 py-0 pb-8">
          <h1 className="my-6 mb-4 text-center sm:mt-0 text-lg font-semibold text-black">
            How Would You Like to Proceed?
          </h1>
          <div className="w-full flex justify-center">
            <button
              onClick={() => setRole(CONSTANTS.ROLES.RECEIVER)}
              className="h-9 w-[45%] mr-1 text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
            >
              ReceIver
            </button>
            <button
              onClick={() => setRole(CONSTANTS.ROLES.DONOR)}
              className="h-9 w-[45%] ml-1 text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
            >
              Donor
            </button>
          </div>
          <h3 className="text-xs text-gray-500 my-5 sm:mb-0 w-full flex justify-center">
            Are you a Healthcare owner?
            <Link to="/healthcare-signup" className="font-semibold text-black">
              &nbsp;&nbsp;Sign In &nbsp;
            </Link>
          </h3>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex items-center justify-center mb-32 sm:mb-0 sm:justify-start flex-col h-full">
      <div className="text-black fixed top-5 space-x-6 text-sm right-10">
        <Link to="/">Home</Link>
        <Link to="/login">Log In</Link>
      </div>
      <div className="w-full sm:hidden flex items-center justify-center my-6">
        <img src={logo} className="h-12 w-12" />
      </div>
      {!role ? (
        <UserType />
      ) : (
        <div className="w-[360px] sm:w-[380px] bg-white rounded-[8px] h-auto shadow-xl border border-gray-300 p-5 sm:p-6 sm:mt-10 py-0">
          <form
            onSubmit={handleSignup}
            className="w-full h-full flex items-center justify-center flex-col"
          >
            <h1 className="my-6 sm:mt-0 text-xl text-center font-semibold text-black">
              Create Lifeflow account
            </h1>
            <div className="space-y-4 flex flex-col w-full">
              <input
                maxLength={16}
                type="text"
                placeholder="Enter your username"
                className={`Geist border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center`}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <input
                maxLength={30}
                type="text"
                placeholder="Enter your email address"
                className={`Geist border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center`}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                maxLength={10}
                type="text"
                placeholder="Enter your phone number"
                className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center`}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setPhone(value);
                  }
                }}
                value={phone}
              />
            </div>
            <div className="w-full flex my-4">
              <select
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                }}
                className="border border-gray-400 w-[50%] mr-1 caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
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
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                className="border border-gray-400 w-[50%] ml-1 caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400  px-2 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
              >
                <option hidden>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="w-full flex">
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
            <div className="mt-4 w-full">
              <div className="relative">
                <input
                  maxLength={32}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2.5 text-lg text-gray-300"
                >
                  {showPassword ? <BiShow /> : <BiHide />}
                </button>
              </div>
              <div
                className={`${passwordLengthErrorColor} mt-3 text-gray-400 text-xs flex items-center`}
              >
                <IoCheckmarkCircleSharp />
                <h3 className="ml-1 flex">
                  Password must be at least 8 characters long.
                </h3>
              </div>
              <input
                type="password"
                placeholder="Confirm your password"
                className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center mt-3`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className={`${passwordMatchErrorColor} text-gray-400 text-xs mt-3 flex items-center`}
              >
                <IoCheckmarkCircleSharp />
                <h3 className="ml-1 text-left flex">Passwords must match.</h3>
              </div>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="h-9 mt-4 w-full text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
            >
              {isLoading ? <Loader size={18} /> : "Create Account"}
            </button>
            <div className="w-full my-3 text-gray-400 justify-center text-xs flex">
              or
            </div>
            <h3 className="text-xs text-gray-500 mb-6 sm:mb-0">
              Are you a Healthcare owner?
              <Link
                to="/healthcare-signup"
                className="font-semibold text-black"
              >
                &nbsp;&nbsp;Sign In &nbsp;
              </Link>
            </h3>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;
