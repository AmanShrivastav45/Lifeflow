import React, { useEffect, useState } from "react";
import "../../fonts/stylesheet.css";
import Astronaut from "../../style/Astronaut.jsx";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { BiHide, BiShow } from "react-icons/bi";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import FloatingShape from "../../style/FloatingShapes.jsx";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setisLoading(false);
    }, 3000);
  }, []);

  const handleResetPassword = async (e) => {
    setisLoading(true);
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/ResetPassword", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Server Error");
    } finally {
      setisLoading(false);
    }
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      handleResetPassword(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          Reset Your Password
        </h1>
        <form
          onSubmit={handleResetPassword}
          className="relative py-2 w-full flex bg-[#111111] items-center justify-center flex-col"
        >
          <div className="relative mt-4 w-[90%]">
            <input
              maxLength={32}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              style={{ zIndex: 1001 }}
              className="Geist border w-full md:w-[420px] border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onKeyUp={handleInputEnter}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-3 text-xl text-gray-400"
            >
              {showPassword ? <BiShow /> : <BiHide />}
            </button>
            <input
              maxLength={32}
              type="password"
              placeholder="Confirm new password"
              style={{ zIndex: 1001 }}
              className="Geist mt-4 border w-full md:w-[420px] border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              onKeyUp={handleInputEnter}
            />
            <button
              type="submit"
              className="h-12 w-full mt-6 text-md Geist bg-purple-800 text-[#ffffff] rounded-md flex items-center justify-center"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default ResetPassword;
