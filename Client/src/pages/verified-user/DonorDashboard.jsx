import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../fonts/stylesheet.css";
import { useAuthStore } from "../../store/auth.js";
import Navigation from "../../components/user/Navigation.jsx";
import axios from "axios";
import AddDonation from "../../modals/AddDonation.jsx";
import { FaCirclePlus } from "react-icons/fa6";
import DonationCard from "../../components/donor/DonationCard.jsx";
import toast from "react-hot-toast";

const DonorDashboard = () => {
  const { donorId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [donations, setDonations] = useState([]); // State to hold donor donations
  const [createDonation, setCreateDonation] = useState(false);

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

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

  return (
    <div className="bg-[#09090b] w-full min-h-screen overflow-hidden h-screen pt-24 flex flex-col items-center Geist">
      <Navigation />
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
      <div className="w-full text-white h-[95%] xl:w-[1280px] 2xl:w-[1440px] overflow-y-auto flex flex-col justify-start p-6 pt-0">
        {loading && <div className="text-white">Loading donations...</div>}
        {donations.length > 0 ? (
          <div className="mt-4 w-full">
            <h2 className="text-2xl w-full Geist mb-4 text-center">Your Donations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.map((donation) => (
                <DonationCard
                  key={donation.id}
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
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">No donations found.</div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
