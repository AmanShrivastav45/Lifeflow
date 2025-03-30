import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { BiHide, BiShow } from "react-icons/bi";
import { useAuthStore } from "../../store/auth.js";
import Loader from "../components/Loader.jsx";
import { ROLES } from "../constants/roles.js";
import { CONSTANTS } from "../../../../constants.js";

const Login = () => {
  const { login, isLoading, error } = useAuthStore();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      handleLogin(e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!Object.values(ROLES).includes(role)) {
      toast.error("Please select a role");
      return;
    }

    if (email.length === 0 || password.length === 0) {
      toast.error("Invalid credentials, please try again!");
      return;
    }

    try {
      await login(role, email, password);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Invalid credentials, please try again!");
    }
  };

  return (
    <div className="w-full flex items-center justify-center mb-32 sm:mb-0 sm:justify-start flex-col h-full">
      <div className="text-black fixed top-5 space-x-6 text-sm right-10">
        <Link to="/">Home</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
      <div className="w-full sm:hidden flex items-center justify-center my-6">
        <img src={logo} className="h-12 w-12" />
      </div>
      <div className="w-[360px] sm:w-[380px] bg-white rounded-[8px] h-auto shadow-xl border border-gray-300 p-5 sm:p-6 sm:mt-10 py-0">
        <form
          onSubmit={handleLogin}
          className="w-full h-full flex items-center justify-center flex-col"
        >
          <h1 className="my-6 sm:mt-0 text-xl text-center font-semibold text-black">
            Log in to Lifeflow
          </h1>
          <div className="space-y-4 flex flex-col w-full">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              className="border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white  px-2 pl-1.5 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
            >
              <option hidden>Category</option>
              <option
                value={CONSTANTS.ROLES.RECEIVER}
                onSelect={() => setRole(CONSTANTS.ROLES.RECEIVER)}
              >
                Reciever
              </option>
              <option
                value={CONSTANTS.ROLES.DONOR}
                onSelect={() => setRole(CONSTANTS.ROLES.DONOR)}
              >
                Donor
              </option>
              <option
                value={CONSTANTS.ROLES.LABORATORY}
                onSelect={() => setRole(CONSTANTS.ROLES.LABORATORY)}
              >
                Laboratory
              </option>
              <option
                value={CONSTANTS.ROLES.HOSPITAL}
                onSelect={() => setRole(CONSTANTS.ROLES.HOSPITAL)}
              >
                Hospital
              </option>
            </select>
            <input
              maxLength={32}
              type="text"
              style={{ zIndex: 1001 }}
              placeholder="Enter your email"
              className={`Geist border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center`}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="relative">
              <input
                maxLength={32}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={{ zIndex: 1001 }}
                className={`border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white focus:outline-blue-400 px-2 h-9 text-xs text-black rounded-[5px] flex items-center justify-center`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleInputEnter}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2.5 text-lg text-gray-300"
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </button>
            </div>
          </div>
          <Link to={"/reset-password"}className="text-[10px] text-blue-600 text-end mt-2 w-full">Forgot password?</Link>
          <button
            disabled={isLoading}
            type="submit"
            className="h-9 mt-2 w-full text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
          >
            {isLoading ? <Loader size={18} /> : "Login"}
          </button>
          <div className="w-full my-3 text-gray-400 justify-center text-xs flex">
            or
          </div>
          <h3 className="text-xs text-gray-500 mb-6 sm:mb-0">
            Don't have an Lifeflow account?
            <Link to="/signup" className="font-semibold text-black">
              &nbsp;&nbsp;Sign In &nbsp;
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default Login;
