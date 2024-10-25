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
import { useAuthStore } from "../../store/auth.js";
import logo from "../../assets/logo.png";

const Login = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("donor");
  const quotes = [
    "Blood donation is the gift of life. Your simple act can save lives and inspire hope.",
    "Every blood donor is a hero, silently saving lives and giving patients another chance at life.",
    "One donation can save three lives. It's a small act of kindness with massive impact.",
    "Donating blood costs nothing, but it can mean everything to someone who desperately needs it.",
    "Blood donors are lifesavers. Their generosity helps hospitals, patients, and families in times of crisis.",
  ];

  const toggleRole = (role) => {
    setSelectedRole(role);
  };
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, selectedRole);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Invalid credentials, try again!");
    }
  };
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

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      handleLogin(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen h-screen w-full flex items-center justify-center">
      <div className="h-full w-full rounded-[7px] flex flex-row">
        <div className="w-full relative overflow-hidden lg:w-[50%] h-full bg-[#09090B]">
          <FloatingShape size="w-64 h-64" top="-5%" left="10%" delay={0} />
          <FloatingShape size="w-48 h-48" top="70%" left="80%" delay={3} />
          <FloatingShape size="w-40 h-40" top="40%" left="-10%" delay={1} />
          <Link
            to="/signup"
            className="absolute Geist top-10 right-10 text-gray-200"
          >
            Signin
          </Link>
          <form
            onSubmit={handleLogin}
            className="py-2 w-full h-full flex items-center justify-center flex-col"
          >
            <h1 className="mb-6 text-4xl Geist-semibold text-white">
              Welcome back!
            </h1>
            <div className="px-1 mb-4" style={{ zIndex: 1001 }}>
              <div className="relative mb-4 Geist border w-[360px] md:w-[420px] border-[#2A2A2A] bg-[#09090b] outline-none h-12 text-base rounded-[7px] flex">
                <div
                  className={`absolute transition-all duration-300 ease-in-out ${
                    selectedRole === "donor"
                      ? "left-0"
                      : selectedRole === "reciever"
                      ? "left-[25%]"
                      : selectedRole === "hospital"
                      ? "left-[50%]"
                      : "left-[75%]"
                  } w-[25%] h-full bg-[#a33636] rounded-[6px]`}
                />
                {["Donor", "Reciever", "Hospital", "Laboratory"].map(
                  (role, index) => (
                    <button
                      key={role}
                      onClick={() => toggleRole(role.toLowerCase())}
                      className={`relative z-10 py-2 px-4 rounded-[6px] w-[25%] items-center transition-colors duration-300 ease-in-out ${
                        selectedRole === role.toLowerCase()
                          ? "text-[#d6d6d6]"
                          : "text-[#68686F]"
                      }`}
                    >
                      {role}
                    </button>
                  )
                )}
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                style={{ zIndex: 1001 }}
                className="Geist border w-[360px] md:w-[420px] border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div>
              <div className="relative">
                <input
                  maxLength={32}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  style={{ zIndex: 1001 }}
                  className="Geist border w-[360px] md:w-[420px] border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090B] focus:border-gray-300 px-4 outline-none h-12 text-base text-white rounded-[7px] flex items-center justify-center"
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
                <div className="relative mt-2 flex items-center justify-end">
                  <button className="text-[#68686f] text-sm text-start Geist mr-2">
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 mt-4 w-[360px] md:w-[420px] text-base Geist-semibold bg-gray-100 text-[#1e1e1e] rounded-[7px] flex items-center justify-center"
            >
              {isLoading ? <Loader /> : "Login"}
            </button>
            <h3 className="Geist text-base my-4 text-[#68686F]">
              Don't have an account?{" "}
              <Link to="/signup" className="Geist-Semibold text-gray-300">
                &nbsp;Sign In
              </Link>
            </h3>
          </form>
        </div>
        {/* Div-2 */}
        <div className="h-full lg:w-[50%]  bg-[#1e1e1e] flex items-center justify-center">
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
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default Login;
