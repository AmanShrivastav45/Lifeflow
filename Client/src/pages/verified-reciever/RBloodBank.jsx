import React, { useState, useEffect } from "react";
import axios from "axios";
import Donation from "../../components/reciever/Donation";
import RequestDonation from "../../modals/RequestDonation";
import toast from "react-hot-toast";
import RecieverNav from "./RecieverNav";
import { useAuthStore } from "../../store/auth";
import { useParams, NavLink } from "react-router-dom";

const RBloodBank = () => {
  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const recieverId = useParams().recieverId || null;
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [bloodGroup, setBloodGroup] = useState([]);
  const [city, setCity] = useState([]);
  const [donationType, setDonationType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showRequestDonation, setShowRequestDonation] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState({});

  const openRequestDonationModal = (donation) => {
    setSelectedDonation(donation);
    setShowRequestDonation(true);
  };

  const closeRequestDonationModal = () => {
    setShowRequestDonation(false);
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/lifeflow/auth/donors/donations`
        );
        setDonations(response.data);
        setFilteredDonations(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching donations");
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  useEffect(() => {
    const fetchFilteredDonations = async () => {
      try {
        const params = {
          bloodGroup: bloodGroup.length > 0 ? bloodGroup : undefined,
          city: city.length > 0 ? city : undefined,
          donationType:
            donationType.length > 0
              ? donationType.map(
                  (type) =>
                    type.charAt(0).toLowerCase() + type.slice(1).toLowerCase()
                )
              : undefined,
        };

        const response = await axios.get(
          `http://localhost:5050/lifeflow/auth/donors/donations/filter`,
          { params }
        );
        setFilteredDonations(response.data);
      } catch (error) {
        setError("Error filtering donations");
      }
    };

    if (bloodGroup.length > 0 || city.length > 0 || donationType.length > 0) {
      fetchFilteredDonations();
    } else {
      setFilteredDonations(donations); // Reset to all donations if no filters
    }
  }, [bloodGroup, city, donationType, donations]);

  const handleCheckboxChange = (setter, stateArray, value) => {
    if (stateArray.includes(value)) {
      setter(stateArray.filter((item) => item !== value));
    } else {
      setter([...stateArray, value]);
    }
  };

  const handleDonationRequest = async (donorId, donorDetails) => {
    try {
      const requestData = {
        receiverId: user._id,
        receiverName: user.firstName,
        bloodGroup: donorDetails.bloodGroup,
        contactInfo: user.phone,
        city: user.city,
        donorId: donorDetails.donorId, 
      };
      await axios.post(
        `http://localhost:5050/lifeflow/auth/donor/${donorDetails.donorId}/request`,
        requestData
      );

      toast.success("Donation request sent successfully.");
    } catch (error) {
      console.error("Error sending donation request:", error);
      toast.error("Failed to send donation request.");
    }
  };

  return (
    <div className="Geist h-screen relative w-full overflow-hidden flex flex-col items-center justify-start bg-black">
      <RecieverNav />
      <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex mt-20">
        {/* Filters Section */}
        <div className="hidden lg:block lg:w-[25%] xl:w-[20%] h-full  flex-col text-[#868686] text-md p-3 mb-24">
          <ul className="space-y-2 pl-2 mt-2 h-full overflow-y-hidden">
            <h1 className="text-xl Geist-semibold text-gray-200">Filters</h1>
            <div>
              <h1 className="text-lg">Blood Group</h1>
              <ul className="text-md ">
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                  (group) => (
                    <li className="my-2" key={group}>
                      <input
                        type="checkbox"
                        id={`blood-group-${group}`}
                        name="bloodGroup"
                        value={group}
                        onChange={() =>
                          handleCheckboxChange(setBloodGroup, bloodGroup, group)
                        }
                      />
                      <label htmlFor={`blood-group-${group}`} className="ml-2">
                        {group}
                      </label>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h1 className="text-lg">Donation Type</h1>
              <ul className="text-md mb-6">
                {["Blood", "Plasma"].map((type) => (
                  <li className="my-2" key={type}>
                    <input
                      type="checkbox"
                      id={`donation-type-${type}`}
                      name="donationType"
                      value={type}
                      onChange={() =>
                        handleCheckboxChange(
                          setDonationType,
                          donationType,
                          type
                        )
                      }
                    />
                    <label htmlFor={`donation-type-${type}`} className="ml-2">
                      {type}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </ul>
        </div>

        {/* Donations Section */}
        <div className="p-4 h-screen z w-full md:w-[75%] xl:w-[55%] text-white Geist px-6 overflow-y-auto hide-scrollbar pb-24">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center text-xl">
              Loading donations...
            </div>
          ) : error ? (
            <p className="h-full w-full flex items-center justify-center text-xl">
              {error}
            </p>
          ) : filteredDonations.length === 0 ? (
            <p className="h-full w-full flex items-center justify-center text-xl">
              No donations found.
            </p>
          ) : (
            filteredDonations.map((donation) => (
              <Donation
                key={donation._id}
                className="border p-4 mb-4"
                city={donation.city}
                bloodGroup={donation.bloodGroup}
                address={donation.address}
                pincode={donation.pincode}
                donationType={donation.donationType}
                date={donation.createdAt}
                postedBy={donation.postedBy}
                onClick={() => openRequestDonationModal(donation)}
              />
            ))
          )}
        </div>
        <div className="hidden overflow-hidden xl:block xl:w-[25%] h-full text-md Geist-semibold p-4 text-white overflow-y-hidden">
          <ul className="space-y-2">
            <div className="h-[280px] flex flex-col items-center justify-center w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[6px] p-3 px-4">
              <h1 className="text-xl w-full text-left Geist-semibold text-white ml-2 mb-2">
                Email me updates!
              </h1>
              <p className="text-sm Geist  text-start text-gray-400 mb-4 ml-1">
                Get notified about new blood donation opportunities that match
                your blood type and location so you can stay on top of your
                efforts to save lives!
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="Geist border w-full border-[#2A2A2A] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-300 px-4 outline-none h-10 text-base text-white rounded-[7px] flex items-center justify-center"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <button
                type="submit"
                className="h-10 mt-4 w-full text-base Geist-semibold bg-gray-100 text-[#1e1e1e] rounded-[7px] flex items-center justify-center"
              >
                Subscribe
              </button>
            </div>
          </ul>
        </div>
        {showRequestDonation && (
          <RequestDonation
            onCancel={() => setShowRequestDonation(false)}
            onSuccess={() => {
              handleDonationRequest(
                selectedDonation._id,
                selectedDonation
              );
              setShowRequestDonation(false);
            }}
            donationDetails={selectedDonation}
          />
        )}
      </div>
    </div>
  );
};

export default RBloodBank;
