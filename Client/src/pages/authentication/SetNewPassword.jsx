import React, { useState, useEffect } from 'react'
import { BiHide, BiShow } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const SetNewPassword = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { role, token } = useParams()
    const [passwordLengthErrorColor, setPasswordLengthErrorColor] =
        useState("text-[#303030]");
    const [passwordMatchErrorColor, setPasswordMatchErrorColor] =
        useState("text-[#303030]");

    useEffect(() => {
        console.log("Role: ", role, " Token: ", token)
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length === 0 || confirmPassword.length === 0) {
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
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/reset-password/${role}/${token}`, {
                password
            });
            if (response.data.success) {
                toast.success("Password reset successfull");
                setTimeout(() => {
                }, 3000);
                navigate("/login")
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error);
        }

    }

    return (
        <div className="w-full h-full flex justify-center items-start text-base">
            <div className="w-[360px] sm:w-[380px] bg-white rounded-[8px] h-auto shadow-xl border border-gray-300 p-5 sm:p-6 sm:mt-10 py-0 pb-8">
                <h1 className="my-6 mb-4 text-center sm:mt-0 text-lg font-semibold text-black">
                    Reset your password
                </h1>
                <div className="mt-4 w-full">
                    <div className="relative">
                        <input
                            maxLength={32}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
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
                    onClick={handleSubmit}
                    className="h-9 mt-4 w-full text-sm font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
                >
                    {isLoading ? <Loader size={18} /> : "Update Password"}
                </button>
            </div>
        </div>
    )
}

export default SetNewPassword