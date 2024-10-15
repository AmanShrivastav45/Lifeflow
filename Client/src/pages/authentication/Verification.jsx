import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import FloatingShape from "../../style/FloatingShapes.jsx";
import Loader from "../../components/Loader.jsx";
import { useAuthStore } from "../../store/auth.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Verification = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail, role, user } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
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
		await verifyEmail(verificationCode, role);
		if (role === "donor") {
		  navigate(`/donor/${user._id}`);
		} else if (role === "reciever") {
		  navigate(`/user/${user._id}`);
		} else if(role === "Hospital"){
			navigate(`/hospital/${user._id}`);
		} else if (role === "Laboratory"){
			navigate(`/lab/${user._id}`);
		}
		toast.success("Email verified successfully");
		toast.success("Welcome to Med-Expert");
	  } catch (error) {
		console.log(error);
	  }
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

  return (
    <div className="Geist fixed inset-0 z-50 bg-[#09090B] flex items-center justify-center overflow-hidden outline-none text-center">
      <FloatingShape size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape size="w-48 h-48" top="70%" left="80%" delay={3} />
      <FloatingShape size="w-40 h-40" top="40%" left="-10%" delay={1} />
      <FloatingShape size="w-40 h-40" top="30%" left="70%" delay={1} />
      <div className="border border-[#303030] rounded-lg relative flex flex-col items-center justify-center h-[300px] min-w-[460px] w-[92%] sm:w-[460px] bg-[#111111] shadow-lg outline-none focus:outline-none">
        <Link className="text-2xl absolute top-4 right-4 text-gray-300" to="/">
          <IoClose />
        </Link>
        <h1 className="Geist-semibold flex items-center text-2xl text-[#FAFAFA]">
          Verify Your Email
        </h1>
        <h3 className="text-[15px] mt-2 text-[#7B7B82] tracking-wide">
          Please check your mail! We've sent an OTP to
          <br/>
          <span className="">{user.email}</span>
        </h3>
        <form onSubmit={handleSubmit} className=" mt-4 flex flex-col items-center justify-center">
          <div
            style={{ zIndex: 1001 }}
            className="w-[90%] h-14 flex items-center mb-2 justify-center gap-x-3 rounded-t"
          >
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                style={{ zIndex: 1001 }}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={6}
                className="w-14 h-14 text-white bg-[#111111] text-center text-lg md:text-2xl border border-[#303030] rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            ))}
          </div>
          <button
            type="submit"
            className="h-12 w-full mt-4 text-md Geist bg-purple-800 text-[#ffffff] rounded-md flex items-center justify-center"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
