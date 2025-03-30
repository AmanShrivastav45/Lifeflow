import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONSTANTS } from '../../../../constants';
import toast from 'react-hot-toast';
import axios from 'axios'

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (role === '') {
            toast.error("Please select your role!");
            return;
        }
        if (email === '') {
            toast.error("Please enter your Email Id!");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/forgot-password`, {
                email: email,
                role: role
            });

            console.log(response)
            if (response.data.success) {
                toast.success("Password reset link sent to your email");
                setTimeout(() => {
                }, 2000);
                navigate("/login")
            } else {
                toast.error("Hello", response.message);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error("Something went wrong. Please try again.", error);
        }
    };

    return (
        <div className="w-full flex justify-center items-start h-full text-base">
            <div className="w-[360px] sm:w-[380px] bg-white rounded-lg shadow-xl border border-gray-300 p-6 sm:mt-10 pb-8">
                <h1 className="my-6 mb-4 text-center sm:mt-0 font-medium text-black">
                    Please enter your Email ID
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
                    <div className="space-y-4 flex flex-col w-full">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border border-gray-400 w-full caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white px-2 pl-1.5 h-9 text-xs text-gray-600 rounded-[5px] flex items-center justify-center"
                        >
                            <option hidden>Category</option>
                            <option value={CONSTANTS.ROLES.RECEIVER}>Receiver</option>
                            <option value={CONSTANTS.ROLES.DONOR}>Donor</option>
                            <option value={CONSTANTS.ROLES.LABORATORY}>Laboratory</option>
                            <option value={CONSTANTS.ROLES.HOSPITAL}>Hospital</option>
                        </select>
                    </div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 text-xs border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-[5px] hover:bg-blue-700 transition"
                    >
                        Send Reset Link
                    </button>
                </form>
                <h3 className="text-xs text-gray-500 my-5 sm:mb-0 w-full flex justify-center">
                    Don't have an account?
                    <Link to="/signup" className="font-semibold text-black">
                        &nbsp;&nbsp;Sign In &nbsp;
                    </Link>
                </h3>
            </div>
        </div>
    );
};

export default ResetPassword;
