import React, { useState } from "react";
import FloatingShape from "../../style/FloatingShapes";
import { useAuthStore } from "../../store/auth";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { BiShow, BiHide } from "react-icons/bi";
import Loader from "../../components/Loader";

const Details = () => {
  const { signup, error, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    sex: "",
    bloodGroup: "",
    mobileNumber: "",
    address: "",
    city: "",
    pincode: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedRole, setSelectedRole] = useState("donor");
  const [showPassword, setShowPassword] = useState(false);

  const toggleRole = (role) => setSelectedRole(role);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data
    signup(formData); // Assuming signup action is connected to formData
    setFormData({
      sex: "",
      bloodGroup: "",
      mobileNumber: "",
      address: "",
      city: "",
      pincode: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <FloatingShape size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape size="w-48 h-48" top="70%" left="80%" delay={3} />
      <FloatingShape size="w-64 h-64" top="15%" left="80%" delay={2} />
      <FloatingShape size="w-40 h-40" top="40%" left="-10%" delay={1} />

      <form
        onSubmit={handleSubmit}
        className="py-2 w-full h-full flex items-center justify-center flex-col"
      >
        <h1 className="mb-6 text-4xl Geist-semibold text-white">
          Create an account
        </h1>
        
        <div className="relative mb-4 Geist border w-[360px] md:w-[420px] border-[#2A2A2A] bg-[#09090b] outline-none h-12 text-base rounded-[7px] flex">
          <div
            className={`absolute p-1 transition-all duration-300 ease-in-out ${
              selectedRole === "donor" ? "left-0" : "left-[50%]"
            } w-[50%] h-full bg-[#1e1e1e] rounded-[6px]`}
          />
          <button
            type="button"
            onClick={() => toggleRole("donor")}
            className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] transition-colors duration-300 ${
              selectedRole === "donor" ? "text-[#d6d6d6]" : "text-[#68686F]"
            }`}
          >
            Donor
          </button>
          <button
            type="button"
            onClick={() => toggleRole("receiver")}
            className={`relative z-10 py-2 px-4 rounded-[6px] w-[50%] transition-colors duration-300 ${
              selectedRole === "receiver" ? "text-[#d6d6d6]" : "text-[#68686F]"
            }`}
          >
            Receiver
          </button>
        </div>

        {/* Sex Selection */}
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="sex">
            Sex
          </label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#09090b] text-white leading-tight focus:outline-none"
          >
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Blood Group */}
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Blood Group</label>
          <div className="flex space-x-4">
            {["A", "B", "AB", "O"].map((group) => (
              <label key={group} className="inline-flex items-center text-white">
                <input
                  type="radio"
                  name="bloodGroup"
                  value={group}
                  onChange={handleChange}
                  checked={formData.bloodGroup === group}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2">{group}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="mobileNumber">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#09090b] text-white leading-tight focus:outline-none"
            required
          />
        </div>

        {/* Other Fields (Address, City, Pincode) */}
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#09090b] text-white leading-tight focus:outline-none"
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="h-12 mt-4 w-[360px] md:w-[420px] text-base Geist-semibold bg-gray-100 text-[#1e1e1e] rounded-[7px] flex items-center justify-center"
        >
          {isLoading ? <Loader size={24} /> : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Details;
