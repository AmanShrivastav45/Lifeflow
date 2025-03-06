import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CONSTANTS } from "../../../../constants.js";

const Verification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail, role, user } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      console.log(verificationCode, role);
      await verifyEmail(verificationCode, role);
      if (role === CONSTANTS.ROLES.DONOR) {
        navigate(`/donor/${user._id}`);
      } else if (role === CONSTANTS.ROLES.RECEIVER) {
        navigate(`/receiver/${user._id}`);
      } else if (role === CONSTANTS.ROLES.HOSPITAL) {
        navigate(`/hospital/${user._id}`);
      } else if (role === CONSTANTS.ROLES.LABORATORY) {
        navigate(`/laboratory/${user._id}`);
      }
      toast.success("Email verified successfully");
      setTimeout(toast.success("Welcome to Lifeflow"), 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="w-full flex items-center justify-center mb-48 sm:mb-0 sm:justify-start flex-col h-full">
      <div className="w-full sm:hidden flex items-center justify-center my-6">
        <img src={logo} className="h-12 w-12" />
      </div>
      <div className="w-[360px] sm:w-[380px] bg-white rounded-[8px] h-auto relative shadow-xl border border-gray-300 p-8 sm:p-8 sm:mt-10 py-0">
        <Link className="text-2xl absolute top-4 right-4 text-gray-500" to="/">
          <IoClose />
        </Link>
        <h1 className="my-6 mb-3 sm:mt-0 text-xl text-center font-semibold text-black">
          Verify Your Email
        </h1>
        <h3 className="text-xs text-center text-gray-500 font-light tracking-wide">
          Please check your mail! We've sent an OTP to
          <br />
          <span className="">{"user.email"}</span>
        </h3>
        <form
          onSubmit={handleSubmit}
          className=" mt-4 flex flex-col items-center justify-center"
        >
          <div className="w-full h-12 flex items-center mb-2 justify-between p-0.5">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={6}
                className="w-10 h-10 text-black bg-gray-50 text-center text-lg border border-gray-400 rounded-[6px] focus:outline-blue-400"
              />
            ))}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="h-9 mt-2 mb-8 sm:mb-0 w-full text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
