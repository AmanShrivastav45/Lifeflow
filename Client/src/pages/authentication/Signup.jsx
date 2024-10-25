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
import logo from "../../assets/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
  const [selectedRole, setSelectedRole] = useState("donor");

  const toggleRole = (selectedRole) => {
    setSelectedRole(selectedRole);
  };
  const quotes = [
    "Blood donation is the gift of life. Your simple act can save lives and inspire hope.",
    "Every blood donor is a hero, silently saving lives and giving patients another chance at life.",
    "One donation can save three lives. It's a small act of kindness with massive impact.",
    "Donating blood costs nothing, but it can mean everything to someone who desperately needs it.",
    "Blood donors are lifesavers. Their generosity helps hospitals, patients, and families in times of crisis.",
  ];
  useEffect(() => {
    // Quote change logic
    const quoteInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(true);
      }, 1000);
    }, 5000);

    return () => {
      clearInterval(quoteInterval);
    };
  }, []);

  const [nameErrorColor, setNameErrorColor] = useState("text-[#303030]");
  const [nameLengthErrorColor, setNameLengthErrorColor] =
    useState("text-[#303030]");
  const [passwordLengthErrorColor, setPasswordLengthErrorColor] =
    useState("text-[#303030]");
  const [passwordMatchErrorColor, setPasswordMatchErrorColor] =
    useState("text-[#303030]");
  const [firstNameRingColor, setFirstNameRingColor] =
    useState("border-[#2A2A2A]");
  const [lastNameRingColor, setLastNameRingColor] =
    useState("border-[#2A2A2A]");
  const [pinCodeRingColor, setPinCodeRingColor] = useState("border-[#2A2A2A]");
  const [passwordRingColor, setPasswordRingColor] =
    useState("border-[#2A2A2A]");
  const [confirmPasswordRingColor, setConfirmPasswordRingColor] =
    useState("border-[#2A2A2A]");
  const [bloodGroupError, setBloodGroupError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [pincodeError, setPincodeError] = useState(false);

  useEffect(() => {
    if (firstName.length > 0 && firstName.length >= 6) {
      setNameLengthErrorColor("text-green-600");
    } else {
      setNameLengthErrorColor("text-[#303030]");
    }
  }, [firstName]);

  useEffect(() => {
    if (lastName.length > 0 && lastName.length >= 6) {
      setNameLengthErrorColor("text-green-600");
    } else {
      setNameLengthErrorColor("text-[#303030]");
    }
  }, [lastName]);

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
    var firstnameHasError = false;
    var lastnameHasError = false;
    var passwordHasError = false;

    if (firstName.length === 0) {
      setNameLengthErrorColor("text-red-400");
      setNameErrorColor("text-red-400");
      firstnameHasError = true;
    } else {
      setNameLengthErrorColor("text-green-600");
    }

    if (lastName.length === 0) {
      setNameLengthErrorColor("text-red-400");
      setNameErrorColor("text-red-400");
      lastnameHasError = true;
    } else {
      setNameLengthErrorColor("text-green-600");
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

    if (firstnameHasError) setFirstNameRingColor("border-red-500");
    if (lastnameHasError) setLastNameRingColor("border-red-500");
    if (passwordHasError) setPasswordRingColor("border-red-500");
    if (passwordHasError || firstnameHasError || lastnameHasError) return;

    if (password !== confirmPassword) {
      setPasswordMatchErrorColor("text-red-400");
      setConfirmPasswordRingColor("border-red-500");
      return;
    }

    if (!bloodGroup) {
      setBloodGroupError(true);
      return;
    }

    if (!gender) {
      setGenderError(true);
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
      await signup(
        firstName,
        lastName,
        email,
        phone,
        password,
        selectedRole,
        bloodGroup,
        gender,
        city,
        pincode
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

  return (
    <div className="min-h-screen h-screen w-full flex items-center justify-center">
      <div className="h-full w-full rounded-[7px] flex flex-row">
        <div className="h-full lg:w-[50%] bg-[#1e1e1e] flex items-center justify-center">
          <div className="relative lg:h-[340px] lg:w-[540px] mb-24 flex flex-col items-center justify-center">
            <img src={logo} className="h-96 mb-8" />
            <h1 className="Apercu-Bold text-4xl text-white">LIFEFLOW</h1>
          </div>
          <div className="absolute top-10 left-10">
            <MdOutlineKeyboardCommandKey className="mr-2 text-white text-4xl" />
          </div>
          <div className="Geist text-gray-300 absolute bottom-16 ">
            <p
              className={`md:text-base lg:text-xl px-8 sm:px-2 mt-3 text-sm Geist text-center text-gray-300 fade-text ${
                fade ? "" : "fade-out"
              }`}
            >
              {quotes[quoteIndex]}
            </p>
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
            onSubmit={handleSignup}
            className="py-2 w-full h-full flex items-center justify-center flex-col"
          >
            <h1 className="mb-6 text-4xl Geist-semibold text-white">
              Create an account
            </h1>
            <div className="relative mb-4 Geist border w-[360px] md:w-[420px] border-[#2A2A2A] bg-[#09090b] outline-none h-12 text-base rounded-[7px] flex">
              <div
                className={`absolute transition-all duration-300 ease-in-out ${
                  selectedRole === "donor" ? "left-0" : "left-[50%]"
                } w-[50%] h-full bg-[#1e1e1e] rounded-[6px]`}
              />
              <button
                onClick={() => toggleRole("donor")}
                className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] items-center transition-colors duration-300 ease-in-out ${
                  selectedRole === "donor" ? "text-[#d6d6d6]" : "text-[#68686F]"
                }`}
              >
                Donor
              </button>
              <button
                onClick={() => toggleRole("reciever")}
                className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] items-center transition-colors duration-300 ease-in-out ${
                  selectedRole === "reciever"
                    ? "text-[#d6d6d6]"
                    : "text-[#68686F]"
                }`}
              >
                Reciever
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
                placeholder="Enter your first name"
                className={`Geist border w-[50%] caret-white mr-1 placeholder:text-[#68686F] bg-[#09090b] ${firstNameRingColor} focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center`}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                required
              />
              <input
                maxLength={16}
                type="text"
                style={{ zIndex: 1001 }}
                placeholder="Enter your last name"
                className={`Geist border  w-[50%] caret-white ml-1 placeholder:text-[#68686F] bg-[#09090b] ${lastNameRingColor} focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center`}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
              />
            </div>
            <div style={{ zIndex: 1001 }} className="px-1 mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                style={{ zIndex: 1001 }}
                className="Geist border w-[360px] md:w-[420px] border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 mb-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter your phone number"
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
              <select
                style={{ zIndex: 1001 }}
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  setBloodGroupError(false);
                }}
                className="Geist border border-[#2A2A2A] w-[50%] mr-1 caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-3 outline-none h-12 text-base text-[#5D5D63] rounded-[7px] flex items-center justify-center"
              >
                <option value="">Blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {bloodGroupError && (
                <div className="text-red-400 mb-2">
                  Please select a blood group
                </div>
              )}
              <select
                style={{ zIndex: 1001 }}
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setGenderError(false);
                }}
                className="Geist border border-[#2A2A2A] w-[50%] ml-1 caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-[#5D5D63] rounded-[7px] flex items-center justify-center"
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {genderError && (
                <div className="text-red-400 mb-2">Please select a gender</div>
              )}
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
              {isLoading ? <Loader size={24} /> : "Sign Up"}
            </button>
            <h3 className="Geist text-base mt-4 text-[#68686F]">
              Already a member?{" "}
              <Link to="/login" className="Geist-Semibold text-gray-300">
                &nbsp;Log In &nbsp;
              </Link>
              or a Healthcare owner?
              <Link
                to="/healthcare-signup"
                className="Geist-Semibold text-gray-300"
              >
                &nbsp;Sign In &nbsp;
              </Link>
            </h3>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
