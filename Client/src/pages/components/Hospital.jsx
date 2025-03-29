import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoLocationSharp } from "react-icons/io5";
import { useAuthStore } from "../../store/auth";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPhone } from "react-icons/fa6";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdEmail } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const Hospital = ({
  name,
  address,
  city,
  bloodBank,
  id,
  phone,
  pincode,
  email,
  facilities,
}) => {
  const { user } = useAuthStore();
  const recieverId = useParams().userId || null;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const handleViewClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleQuantityChange = (value, bloodGroup) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [value]: bloodBank,
    }));
  };

  const handleClick = (availableQuantity, bloodGroup) => {
    console.log(availableQuantity, bloodGroup)
    console.log("Ans", selectedQuantities[bloodGroup]);
    const quantity = parseFloat(selectedQuantities[bloodGroup]);
    console.log("Qty", quantity);
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity greater than 0.");
      return;
    }

    if (quantity > availableQuantity) {
      toast.error(`Only ${availableQuantity} liters available.`);
      return;
    }

    handleRequest(bloodGroup, quantity);
  };

  const handleRequest = async (bloodGroup, quantity) => {
    try {
      const requestData = {
        receiverId: user._id,
        receiverName: user.name,
        bloodGroup: bloodGroup,
        contactInfo: user.phone,
        quantity,
      };
      console.log(requestData)
      await axios.post(
        `http://localhost:5050/lifeflow/api/hospital/${id}/request`,
        requestData
      );

      toast.success("Donation request sent successfully.");
      setSelectedBloodGroup("");
    } catch (error) {
      console.error("Error sending donation request:", error);
      toast.error("Failed to send donation request.");
    }
  };

  return (
    <div className="bg-gradient-to-l from-[#ffefc9] to-white border border-gray-300 h-fit overflow-hidden shadow-sm rounded-[5px] p-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex">
          <div className="text-2xl text-green-500 mr-2">
            <VscVerifiedFilled />
          </div>
          <div className="flex flex-col items-start justify-center">
            <div className="flex items">
              <h3 className="font-medium">
                {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()},{" "}
                {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex mb-2 space-x-2 px-0.5">
        {facilities.slice(0, 3).map((facility, index) => (
          <div
            key={index}
            className="text-[12px] px-2 py-0.5 text-blue-600 border rounded-[5px] border-blue-600 bg-blue-100"
          >
            {facility}
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 flex-col items-start">
        <p className="text-xs flex items-center px-2 justify-center">
          Address:&nbsp;
          {address.charAt(0).toUpperCase() +
            address.slice(1).toLowerCase()}, {" " + pincode}
        </p>
        <p className="text-xs flex items-center px-2 justify-center">
          Contact No:&nbsp;
          {"+91 " + phone}
        </p>
        <p className="text-xs flex items-center px-2 justify-center">
          Email address:&nbsp;
          {email}
        </p>
      </div>
      <div className="flex mt-3">
        <button
          onClick={handleViewClick}
          className="rounded-[5px] bg-orange-500 flex items-center justify-center text-xs px-3 ml-1 py-1 font-medium text-white"
        >
          View Details
        </button>
      </div>
      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-65 flex items-center justify-center z-50">
          <div className="bg-gradient-to-l from-[#ffefc9] to-white p-5 rounded-[5px] relative border border-gray-300 shadow-lg w-[620px]">
            <button
              onClick={handleCloseModal}
              className="text-2xl absolute top-4 right-4 text-gray-700"
            >
              <IoClose />
            </button>
            <div className="flex">
              <div className="text-3xl text-green-500 mr-2 mb-0.5">
                <VscVerifiedFilled />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center">
                  <h3 className="text-xl font-medium text-black">
                    {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                    ,&nbsp;
                    {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}
                  </h3>
                </div>
              </div>
            </div>
            <div className="w-full my-3 text-gray-600 flex flex-col">
              <div className="w-full flex border-b border-dashed border-gray-300 pb-2">
                <div className="text-xs flex items-center px-2 justify-start py-0.5 bg-blue-100 border border-blue-600 rounded-[5px] text-blue-700">
                  <span className="mr-1.5 mb-0.5">
                    <IoLocationSharp />
                  </span>
                  {address.charAt(0).toUpperCase() +
                    address.slice(1).toLowerCase()}
                  , {" " + pincode}
                </div>
                <p className="text-xs flex items-center px-2 justify-start py-0.5 bg-blue-100 border border-blue-600 rounded-[5px] mx-2 text-blue-700 ">
                  <span className="mr-1.5 text-xs">
                    <FaPhone />
                  </span>
                  {"+91 " + phone}
                </p>
                <p className="text-xs flex items-center px-2 justify-start py-0.5 bg-blue-100 border border-blue-600 rounded-[5px] text-blue-700">
                  <span className="mr-1.5 text-sm">
                    <MdEmail />
                  </span>
                  {email}
                </p>
              </div>
            </div>
            {bloodBank?.length > 0 ? (
              <h3 className="w-full px-1 text-gray-600 mb-2">
                Bloodbank available
              </h3>
            ) : (
              <h3 className="w-full px-2 text-center text-gray-600 py-4">
                No blood available.
              </h3>
            )}
            <div className="w-full text-white grid grid-cols-4 gap-4 overflow-y-auto hide-scrollbar p-1">
              {Object.keys(bloodBank).map((bloodGroup, index) => (
                <div
                  key={index}
                  className={`bg-orange-100 flex flex-col items-center p-2 rounded-[4px] border border-gray-400 border-dashed shadow-sm`}
                >
                  <div
                    className={`h-[60px] rounded-[5px] flex items-center border border-dashed justify-center flex-col w-full ${bloodBank[bloodGroup].bloodType.includes("+")
                      ? "bg-green-200 text-green-600 border-green-600"
                      : "bg-red-200 text-red-600 border-red-600"
                      }`}
                  >
                    <h1 className="text-center text-lg font-medium">
                      {bloodBank[bloodGroup].bloodType} Blood
                    </h1>
                  </div>
                  <div className="flex flex-col p-2">
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <p className="text-gray-600 text-center px-2 text-xs">
                        Qty: {bloodBank[bloodGroup].quantityInLiters} liters
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {bloodBank?.length > 0 ? (
              <div>
                <h3 className="w-full px-1 text-gray-600 mt-4">
                  Request Blood
                </h3>
                <select
                  className="bg-white text-gray-600 border border-gray-300 outline-none text-sm rounded-[7px] h-8 px-2 shadow-sm"
                >
                  {Object.keys(bloodBank).map((bloodGroup, index) => (
                    <option value={bloodBank[bloodGroup].bloodType}>{bloodBank[bloodGroup].bloodType} Blood</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0.5"
                  step={0.1}
                  placeholder="Enter quantity (liters)"
                  className="border border-gray-400 rounded-[5px] text-gray-700 text-sm p-1 w-full"
                />
              </div>

            ) : (
              <div></div>
            )}
            <div className="w-full flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 hover:bg-red-600 text-sm text-white font-medium py-1 px-3 my-2 rounded-[5px]"
                aria-label="Close Modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospital;
