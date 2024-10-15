import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BiHide, BiShow } from "react-icons/bi";
import { IoCheckmarkCircleSharp, IoCloseCircle } from "react-icons/io5";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import Loader from "../../components/Loader.jsx";
import Astronaut from "../../style/Astronaut.jsx";
import FloatingShape from "../../style/FloatingShapes.jsx";
import { useAuthStore } from "../../store/auth.js";
import "../../fonts/stylesheet.css";

const HealthCareSignup = () => {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { healthcareSignup, error, isLoading } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState("Hospital");

  const [passwordLengthErrorColor, setPasswordLengthErrorColor] =
    useState("text-[#303030]");
  const [passwordMatchErrorColor, setPasswordMatchErrorColor] =
    useState("text-[#303030]");
  const [nameRingColor, setnameRingColor] = useState("border-[#2A2A2A]");
  const [pinCodeRingColor, setPinCodeRingColor] = useState("border-[#2A2A2A]");
  const [passwordRingColor, setPasswordRingColor] =
    useState("border-[#2A2A2A]");
  const [confirmPasswordRingColor, setConfirmPasswordRingColor] =
    useState("border-[#2A2A2A]");
  const [cityError, setCityError] = useState(false);
  const [pincodeError, setPincodeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);

  useEffect(() => {
    if (name.length > 0 && name.length >= 6) {
      setnameRingColor("text-green-600");
    } else {
      setnameRingColor("text-[#303030]");
    }
  }, [name]);

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

  const handleHealthCareSignup = async (e) => {
    e.preventDefault();
    var nameHasError = false;
    var emailHasError = false;
    var phoneHasError = false;
    var addressHasError = false;
    var passwordHasError = false;

    if (name.length === 0) {
      setnameRingColor("text-red-400");
      nameHasError = true;
    }

    if (email.length === 0) {
      setEmailError(true);
      emailHasError = true;
    }

    if (phone.length === 0) {
      setPhoneError(true);
      phoneHasError = true;
    }

    if (address.length === 0) {
      setAddressError(true);
      addressHasError = true;
    }

    if (password.length === 0) {
      setPasswordLengthErrorColor("text-red-400");
      passwordHasError = true;
    } else {
      if (password.length < 8) {
        setPasswordLengthErrorColor("text-red-400");
        passwordHasError = true;
      }
    }

    if (nameHasError) setnameRingColor("border-red-500");
    if (emailHasError) setEmailError(true);
    if (phoneHasError) setPhoneError(true);
    if (addressHasError) setAddressError(true);
    if (passwordHasError) setPasswordRingColor("border-red-500");
    if (
      passwordHasError ||
      nameHasError ||
      emailHasError ||
      phoneHasError ||
      addressHasError
    )
      return;

    if (password !== confirmPassword) {
      setPasswordMatchErrorColor("text-red-400");
      setConfirmPasswordRingColor("border-red-500");
      return;
    }

    if (!city) {
      setCityError(true);
      return;
    }

    if (!pincode) {
      setPincodeError(true);
      return;
    }

    try {
      await healthcareSignup(
        name,
        email,
        phone,
        password,
        address,
        city,
        pincode,
        selectedRole
      );
      navigate("/verify-email");
    } catch (error) {
      console.error(error);
      toast.error("Error signing up");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRole = (selectedRole) => {
    setSelectedRole(selectedRole);
    console.log(selectedRole);
  };

  return (
    <div className="min-h-screen h-screen w-full flex items-center justify-center">
      <div className="h-full w-full rounded-[7px] flex flex-row">
        <div className="h-full lg:w-[50%] bg-[#2a2a2a] flex items-center justify-center">
          <div className="relative lg:h-[340px] lg:w-[540px] mb-24 flex items-center justify-center">
            <Astronaut />
          </div>
          <div className="absolute top-10 left-10">
            <MdOutlineKeyboardCommandKey className="mr-2 text-white text-4xl" />
          </div>
          <div className="Geist text-gray-300 absolute bottom-16 ">
            <h1 className="hidden text-left lg:block mx-16 lg:text-base xl:text-xl">
              "The beautiful thing about learning is that no one can take it
              away from you. It's a lifelong journey that empowers us to grow,
              adapt, and shape our own destinies."
            </h1>
          </div>
        </div>
        <div className="w-full relative lg:w-[50%] h-full bg-[#09090B] overflow-hidden">
          <FloatingShape size="w-64 h-64" top="-5%" left="10%" delay={0} />
          <FloatingShape size="w-48 h-48" top="70%" left="80%" delay={3} />
          <FloatingShape size="w-40 h-40" top="40%" left="-10%" delay={1} />
          <Link
            to="/login"
            className="absolute Geist top-10 right-10 text-gray-200"
          >
            Login
          </Link>
          <form
            onSubmit={handleHealthCareSignup}
            className="py-2 w-full h-full flex items-center justify-center flex-col"
          >
            <h1 className="mb-6 text-4xl Geist-semibold text-white">
              Healthcare Access
            </h1>
            <div className="relative mb-4 Geist border w-[360px] md:w-[420px] border-[#2A2A2A] bg-[#09090b] outline-none h-12 text-base rounded-[7px] flex">
              <div
                className={`absolute transition-all duration-300 ease-in-out ${
                  selectedRole === "Hospital" ? "left-0" : "left-[50%]"
                } w-[50%] h-full bg-[#1e1e1e] rounded-[6px]`}
              />
              <button
                onClick={() => toggleRole("Hospital")}
                className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] items-center transition-colors duration-300 ease-in-out ${
                  selectedRole === "Hospital"
                    ? "text-[#d6d6d6]"
                    : "text-[#68686F]"
                }`}
              >
                Hospital
              </button>
              <button
                onClick={() => toggleRole("Laboratory")}
                className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] items-center transition-colors duration-300 ease-in-out ${
                  selectedRole === "Laboratory"
                    ? "text-[#d6d6d6]"
                    : "text-[#68686F]"
                }`}
              >
                Laboratory
              </button>
            </div>
            <div
              className=" mb-4 flex w-[360px] md:w-[420px]"
              style={{ zIndex: 1001 }}
            >
              <input
                maxLength={16}
                type="text"
                style={{ zIndex: 1001 }}
                placeholder="Enter the Organization's name"
                className={`Geist border w-full caret-white mr-1 placeholder:text-[#68686F] bg-[#09090b] ${nameRingColor} focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center`}
                onChange={(e) => setname(e.target.value)}
                value={name}
                required
              />
            </div>
            <div style={{ zIndex: 1001 }} className="px-1 mb-4">
              <input
                type="email"
                placeholder="Enter the Organization's email"
                style={{ zIndex: 1001 }}
                className="Geist border w-[360px] md:w-[420px] border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 mb-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter your phone/landline number"
                style={{ zIndex: 1001 }}
                className="Geist border w-[360px] md:w-[420px] border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div
              style={{ zIndex: 1001 }}
              className="w-[360px] md:w-[420px] mb-4 flex"
            >
              <textarea
                className="Geist border border-[#3a3a3a] w-full caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none text-base text-white rounded-[7px] py-2 resize-none overflow-y-auto "
                type="text"
                value={address}
                rows={2}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Enter the Organization's address "
                minLength={5}
                maxLength={100}
              />
            </div>
            <div
              style={{ zIndex: 1001 }}
              className="w-[360px] md:w-[420px] mb-4 flex"
            >
              <select
                style={{ zIndex: 1001 }}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCityError(false);
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
                <option value="Other">Other</option>
              </select>
              {cityError && (
                <div className="text-red-400 mb-2">Please select a city</div>
              )}
              <input
                maxLength={6}
                type="text"
                style={{ zIndex: 1001 }}
                placeholder="Enter your pincode"
                className={`Geist border  w-[50%] caret-white ml-1 placeholder:text-[#68686F] bg-[#09090b] ${pinCodeRingColor} focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center`}
                onChange={(e) => setPincode(e.target.value)}
                value={pincode}
                required
              />
              {pincodeError && (
                <div className="text-red-400 mb-2">Please enter a pincode</div>
              )}
            </div>
            <div style={{ zIndex: 1001 }}>
              <div className="relative">
                <input
                  maxLength={32}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  style={{ zIndex: 1001 }}
                  className={`Geist border w-[360px] md:w-[420px] ${passwordRingColor} caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-3 text-xl text-gray-400"
                >
                  {showPassword ? <BiShow /> : <BiHide />}
                </button>
              </div>
              <div
                className={`${passwordLengthErrorColor} mt-3 flex items-center`}
              >
                <IoCheckmarkCircleSharp />
                <h3 className="ml-2 Geist text-sm flex">
                  Password must be at least 8 characters long.
                </h3>
              </div>
              <input
                type="password"
                placeholder="Confirm your password"
                style={{ zIndex: 1001 }}
                className={`Geist border w-[360px] md:w-[420px] mt-3 ${confirmPasswordRingColor} caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div
                className={`${passwordMatchErrorColor} mt-3 flex items-center`}
              >
                <IoCheckmarkCircleSharp />
                <h3 className="ml -2 Geist text-left text-sm flex">
                  Passwords must match.
                </h3>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="h-12 mt-4 w-[360px] md:w-[420px] text-base Geist-semibold bg-gray-100 text-[#09090B] rounded-[7px] flex items-center justify-center"
            >
              {isLoading ? <Loader size={24} /> : "Register"}
            </button>
            <h3 className="Geist text-base my-4 text-[#68686F]">
              Already a member?{" "}
              <Link to="/login" className="Geist-Semibold text-gray-300">
                &nbsp;Log In
              </Link>
            </h3>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthCareSignup;
