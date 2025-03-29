import React from "react";
import { IoClose } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";

const RequestDonationHospital = ({ onCancel, onSuccess, donationDetails }) => {
  const formattedDate = new Date(donationDetails.createdAt);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });
  const year = formattedDate.getFullYear();

  let donationColor;
  let donationBorder;
  let donationText;
  if (donationDetails.donationType === "plasma") {
    donationBorder = "border-green-600";
    donationText = "text-green-600";
    donationColor = "bg-green-200";
  } else if (donationDetails.donationType === "blood") {
    donationBorder = "border-red-600";
    donationText = "text-red-600";
    donationColor = "bg-red-200";
  } else {
    donationBorder = "border-orange-600";
    donationText = "text-orange-600";
    donationColor = "bg-orange-100";
  }
  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-65 flex items-center justify-center z-50">
      <div className="bg-gradient-to-l from-[#ffefc9] to-white relative p-5 rounded-[5px] border border-gray-300 shadow-lg w-[95%] md:w-[320px]">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="text-2xl absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose />
        </button>
        <h2 className="text-base mb-2">Request Donation</h2>
        <div className="w-full h-full flex flex-col items-center justify-center text-white">
          <div
            className={`h-[100px] w-full ${donationColor} ${donationText} border border-dashed ${donationBorder} relative rounded-[5px] flex flex-col items-center justify-center`}
          >
            <div className={`text-2xl`}>
              {donationDetails.bloodGroup}ve{" "}
              {donationDetails.donationType.charAt(0).toUpperCase() +
                donationDetails.donationType.slice(1).toLowerCase()}
            </div>
          </div>
          <ul className="text-md my-4 w-full">
            <div className="flex">
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-sm text-gray-700">
                  {donationDetails.address.charAt(0).toUpperCase() +
                    donationDetails.address.slice(1).toLowerCase()}
                  ,{" "}
                  {donationDetails.city.charAt(0).toUpperCase() +
                    donationDetails.city.slice(1).toLowerCase()}{" "}
                  - {donationDetails.pincode}
                </h3>
                <h3 className="text-sm text-gray-700">
                  Posted By:{" "}
                  {donationDetails.postedBy[0].toUpperCase() +
                    donationDetails.postedBy.slice(1)}
                </h3>
                <h3 className="text-sm text-gray-700">
                  Posted On:{" "}
                  {`${day} ${month}, ${year}`}
                </h3>
                <h3 className="text-sm text-gray-700">
                  Contact Number:{" "}
                  {`${donationDetails.phone}`}
                </h3>
              </div>
            </div>
          </ul>
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="h-9 w-[50%] text-xs font-medium bg-red-500 text-white rounded-[5px] flex items-center justify-center mr-1"
            >
              Cancel
            </button>
            <button
              onClick={onSuccess}
              className="h-9 w-[50%] text-xs font-medium bg-green-700 text-white rounded-[5px] flex items-center justify-center ml-1"
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDonationHospital;
