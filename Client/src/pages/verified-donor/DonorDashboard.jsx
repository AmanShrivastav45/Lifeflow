import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../fonts/stylesheet.css";
import { useAuthStore } from "../../store/auth.js";
import Navigation from "../../components/reciever/Navigation.jsx";
import axios from "axios";
import AddDonation from "../../modals/AddDonation.jsx";
import { FaCirclePlus } from "react-icons/fa6";
import logo from "../../assets/logo.png";
import DonationCard from "../../components/donor/DonationCard.jsx";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const DonorDashboard = () => {
  const { donorId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [donations, setDonations] = useState([]); // State to hold donor donations
  const [createDonation, setCreateDonation] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null); // State to hold the selected donation

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const val = JSON.parse(localStorage.getItem("user")) || null;
  const recieverId = useParams().recieverId || null;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-white p-3 flex items-center justify-center h-full rounded-[4px]"
      : "hover:text-white p-3 flex items-center justify-center h-full rounded-[4px] text-[#868686]";

  const handleDonationSuccess = () => {
    setCreateDonation(false);
    toast.success("Donation created successfully");
    fetchDonations(); // Refetch donations after a successful donation
  };

  const toggleCreateDonation = () => {
    setCreateDonation(!createDonation);
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/lifeflow/auth/donors/${donorId}/donations`
      );

      console.log("Response data:", response.data);
      if (Array.isArray(response.data)) {
        setDonations(response.data);
      } else {
        setError("Received data is not an array.");
      }
    } catch (err) {
      setError("Error fetching donations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [donorId]);

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
  };

  const handleCloseDonation = () => {
    setSelectedDonation(null);
  };

  return (
    <div className="bg-[#09090b] w-full min-h-screen overflow-hidden h-screen pt-24 flex flex-col items-center Geist">
      <div style={{ zIndex: "1000" }}
        className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]">
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-md p-2">
            <div className="flex items-center">
              <div className="relative w-[60px] flex items-center mx-2">
                <NavLink to="/" className={getNavLinkClass}>
                  <img src={logo} className="h-8" alt="logo" />
                </NavLink>
              </div>
              <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
                MED-EXPERT
              </h1>
              <div className="flex ml-8">
                <NavLink
                  to={`/user/${recieverId}/bloodbank`}
                  className={getNavLinkClass}
                >
                  Blood Bank
                </NavLink>
                <NavLink
                  to={`/user/${recieverId}/hospitals`}
                  className={getNavLinkClass}
                >
                  Hospitals
                </NavLink>
              </div>
            </div>
            <div className="flex relative justify-between space-x-4">
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[50%]"></div>
              </button>
              {isProfileButtonOpen && user ? (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-[#1e1e1e] rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                  style={{ right: "10px", top: "25px" }}
                >
                  <div
                    className="text-[#68686f]"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div
                      className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] w-full text-left"
                      role="menuitem"
                    >
                      <span>User: </span>
                      <span className="Geist text-gray-300">
                        {user?.firstName || "Unknown User"}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-3 text-sm hover:bg-[#1e1e1e] hover:text-gray-400 w-full text-left"
                      role="menuitem"
                    >
                      Logout Med-Expert
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <button style={{ zIndex: 1100 }} onClick={toggleCreateDonation}>
        <FaCirclePlus className="text-yellow-500 hover:text-yellow-500 text-5xl fixed bottom-10 md:bottom-16 right-10 md:right-16 transition-all" />
      </button>
      {createDonation && (
        <AddDonation
          donorId={donorId}
          onSuccess={handleDonationSuccess}
          onCancel={() => setCreateDonation(false)}
        />
      )}
      {selectedDonation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-[80%] md:w-[60%] lg:w-[40%] p-4 rounded-md">
            <h2 className="text-2xl mb-4">Donation Details</h2>
            <p>
              <strong>Donation Type:</strong> {selectedDonation.donationType}
            </p>
            <p>
              <strong>Blood Group:</strong> {selectedDonation.bloodGroup}
            </p>
            <p>
              <strong>Address:</strong> {selectedDonation.address}
            </p>
            <p>
              <strong>City:</strong> {selectedDonation.city}
            </p>
            <p>
              <strong>Pincode:</strong> {selectedDonation.pincode}
            </p>
            <p>
              <strong>Phone:</strong> {selectedDonation.phone}
            </p>
            <p>
              <strong>Date:</strong> {selectedDonation.donationDate}
            </p>
            <p>
              <strong>Description:</strong> {selectedDonation.description}
            </p>
            <button
              onClick={handleCloseDonation}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="w-full text-white h-[95%] xl:w-[1280px] 2xl:w-[1440px] overflow-y-auto flex flex-col justify-start p-6 pt-0">
        {loading && <div className="text-white">Loading donations...</div>}
        {donations.length > 0 ? (
          <div className="mt-4 w-full">
            <h2 className="text-2xl w-full Geist mb-4 text-center">
              Your Donations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.map((donation) => (
                <div key={donation.id} className="bg-[#1a1a1a] p-4 rounded-md">
                  <DonationCard
                    donationType={donation.donationType}
                    bloodGroup={donation.bloodGroup}
                    address={donation.address}
                    city={donation.city}
                    pincode={donation.pincode}
                    phone={donation.phone}
                    date={donation.donationDate}
                    description={donation.description}
                    id={donation.donorId}
                  />
                  <button
                    onClick={() => handleViewDonation(donation)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            No donations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
