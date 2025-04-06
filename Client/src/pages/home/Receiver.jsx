import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Donation from "../modals/Donation";
import RequestDonation from "../modals/RequestDonation";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth";
import { useParams, NavLink, Link } from "react-router-dom";
import { CONSTANTS } from "../../../../constants";
import Email from "../../components/Email";
import Hospital from "../components/Hospital";

const Receiver = () => {
  const { user, logout } = useAuthStore();
  const userDetails = JSON.parse(localStorage.getItem("user")) || null;
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [bloodGroup, setBloodGroup] = useState([]);
  const [city, setCity] = useState([]);
  const [donationType, setDonationType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRequestDonation, setShowRequestDonation] = useState(false);
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState({});

  const [tab, setTab] = useState("bloodbank");
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/lifeflow/api/hospitals"
        );

        if (Array.isArray(res.data)) {
          setHospitals(res.data);
          setFilteredHospitals(res.data);
        } else {
          setResponse(res.data.message || "No hospitals found.");
        }

        setLoading(false);
      } catch (error) {
        setResponse("Failed to fetch hospitals.");
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredHospitals(
        hospitals.filter(
          (hospital) =>
            hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.city.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredHospitals(hospitals);
    }
  }, [searchTerm]);

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
          `http://localhost:5050/lifeflow/api/donors/donations`
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
          bloodGroup: bloodGroup?.length > 0 ? bloodGroup : undefined,
          city: city?.length > 0 ? city : undefined,
          donationType:
            donationType?.length > 0
              ? donationType.map(
                (type) =>
                  type.charAt(0).toLowerCase() + type.slice(1).toLowerCase()
              )
              : undefined,
        };

        const response = await axios.get(
          `http://localhost:5050/lifeflow/api/donors/donations/filter`,
          { params }
        );

        setFilteredDonations(response.data);
        console.log(filteredDonations)
      } catch (error) {
        setError("Error filtering donations");
      }
    };

    if (bloodGroup.length > 0 || city.length > 0 || donationType.length > 0) {
      fetchFilteredDonations();
    } else {
      setFilteredDonations(donations);
    }
  }, [bloodGroup, city, donationType, donations]);

  const handleCheckboxChange = (setter, stateArray, value) => {
    if (stateArray.includes(value)) {
      setter(stateArray.filter((item) => item !== value));
    } else {
      setter([...stateArray, value]);
    }
  };

  const handleDonationRequest = async (receiverId, donorId, donationId) => {
    try {
      const requestData = {
        receiverId: receiverId,
        donorId: donorId,
        donationId: donationId,
      };
      const response = await axios.post(
        `http://localhost:5050/lifeflow/api/donor/${donorId}/request`,
        requestData
      );

      console.log("Repsonse: ", response);
      localStorage.setItem("user", JSON.stringify(response.data.receiver));
      toast.success("Donation request sent successfully.");
    } catch (error) {
      console.error("Error sending donation request:", error);
      toast.error("Failed to send donation request.");
    }
  };

  const handleSelectAll = () => {
    if (bloodGroup.length === Object.values(CONSTANTS.BLOODGROUP).length) {
      setBloodGroup([]);
    } else {
      setBloodGroup(Object.values(CONSTANTS.BLOODGROUP));
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  return (
    <div className="h-screen w-full flex justify-center">
      <div className="fixed top-0 w-full h-14 flex justify-center bg-white border-b border-gray-300">
        <div className="w-full xl:w-[1280px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-sm p-2">
            <div className="flex items-center">
              <div className="relative flex items-center mx-2">
                <button className="flex items-center justify-center mr-4">
                  <img src={logo} className="h-6 mb-1" alt="logo" />
                </button>
                <button
                  onClick={() => setTab("bloodbank")}
                  className={`flex items-center justify-center mx-4 ml-2 ${tab === "bloodbank" ? "text-gray-700" : "text-gray-400"
                    }`}
                >
                  Bloodbank
                </button>
                <button
                  onClick={() => setTab("hospitals")}
                  className={`flex items-center justify-center mx-4 ${tab === "hospitals" ? "text-gray-700" : "text-gray-400"
                    }`}
                >
                  Hospitals
                </button>
              </div>
            </div>
            <div className="flex relative items-center justify-between space-x-4">
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
              </button>
              {isProfileButtonOpen && user ? (
                <div
                  className="absolute right-0 top-full mt-1 w-auto  min-w-48 bg-white shadow-xl border border-gray-300 rounded-[5px]"
                  style={{ right: "10px", top: "25px" }}
                >
                  <div
                    className="text-gray-600"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      to={`/receiver/${userDetails._id}/profile`}
                      className="block px-4 py-3 text-xs hover:bg-gray-100 w-full hover:text-gray-800 text-left"
                      role="menuitem"
                    >
                      <span>User: </span>
                      <span>{user?.email || "Unknown User"}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-3 text-xs hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                      role="menuitem"
                    >
                      Logout Lifeflow
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {tab === "bloodbank" ? (
        <div className="w-full h-full xl:w-[1280px] flex justify-between mt-14 px-4">
          {/* Filters Section */}
          <div className="hidden overflow-hidden mr-4 md:block md:w-[20%] h-full text-md Geist-semibold overflow-y-hidden ">
            <ul className="p-4 mt-4 shadow-xl border border-gray-300 bg-gradient-to-l text-gray-500 from-[#fff7e4] to-white rounded-[5px] h-auto">
              <h1 className="text-sm text-gray-700">Filters</h1>
              <div className="mt-4">
                <h1 className="text-sm">Blood Group</h1>
                <ul className="text-xs flex flex-wrap w-full">
                  <li className="my-1 mt-3 flex w-full">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={
                        bloodGroup.length ===
                        Object.values(CONSTANTS.BLOODGROUP).length
                      }
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="mx-3 ml-1">
                      Select All
                    </label>
                  </li>
                  {Object.values(CONSTANTS.BLOODGROUP).map((group) => (
                    <li className="my-1 flex " key={group}>
                      <input
                        type="checkbox"
                        id={`blood-group-${group}`}
                        name="bloodGroup"
                        value={group}
                        checked={bloodGroup.includes(group)}
                        onChange={() =>
                          handleCheckboxChange(setBloodGroup, bloodGroup, group)
                        }
                      />
                      <label
                        htmlFor={`blood-group-${group}`}
                        className="mx-3 ml-1"
                      >
                        {group}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 ">
                <h1 className="text-sm">Donation Type</h1>
                <ul className="text-xs flex flex-wrap w-full">
                  {Object.values(CONSTANTS.DONATION).map((type) => (
                    <li className="my-2 flex" key={type}>
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
                      <label
                        htmlFor={`blood-group-${type}`}
                        className="mx-3 ml-1"
                      >
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </ul>
          </div>

          {/* Donations Section */}
          <div className="h-full w-[55%] flex flex-col mt-4">
            <div className="w-full h-[640px] bg-gradient-to-l from-[#fff7e4] to-white shadow-base border border-gray-300 p-4 py-3 rounded-[5px] overflow-y-auto text-sm text-gray-600">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300 border-dashed">
                <h2 className="text-gray-700 text-sm">Donations</h2>
              </div>
              {loading ? (
                <div className="mt-64 w-full flex items-center justify-center">
                  Loading donations...
                </div>
              ) : error ? (
                <p className="mt-64 w-full flex items-center justify-center">
                  {error}
                </p>
              ) : filteredDonations.length === 0 ? (
                <p className="mt-64 w-full flex items-center justify-center overflow-hidden">
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
                    phone={donation.phone}
                    postedBy={donation.postedBy}
                    onClick={() => openRequestDonationModal(donation)}
                  />
                ))
              )}
            </div>
          </div>
          <div className="hidden overflow-hidden md:block md:w-[25%] h-full text-md p-4 text-white overflow-y-hidden">
            <Email />
          </div>
          {showRequestDonation && (
            <RequestDonation
              onCancel={() => setShowRequestDonation(false)}
              onSuccess={() => {
                handleDonationRequest(
                  userDetails._id,
                  selectedDonation.donorId,
                  selectedDonation._id
                );
                setShowRequestDonation(false);
              }}
              donationDetails={selectedDonation}
            />
          )}
        </div>
      ) : (
        <div className="h-full w-full mt-16 flex items-center justify-center text-white overflow-y-auto hide-scrollbar">
          <div className="w-full xl:w-[1280px] flex text-gray-500 sm:p-3 h-full hide-scrollbar">
            <div className="h-full w-full px-2 flex flex-col">
              <div className="mt-4 w-full flex flex-col items-center justify-start text-gray-500">
                <h1 className="text-2xl text-center font-medium">
                  Find your nearest hospitals
                </h1>
                <p className="text-sm text-center leading-6 mt-2 px-2 sm:px-0 text-gray-400">
                  Find the nearest hospitals to you and get access to quality
                  medical services, expert doctors, and state-of-the-art
                  facilities.
                </p>
                <div className="w-full outline-none mt-6 mb-8 pl-2 md:w-[320px] lg:w-[420px] xl:w-[520px] h-9 text-xs text-white rounded-[5px] flex items-center justify-center">
                  <input
                    maxLength={30}
                    type="text"
                    placeholder="Search for hospitals..."
                    className="w-full border border-gray-400 rounded-[5px] caret-black placeholder:text-[#b0b7c3] sm:placeholder:text-gray-300 bg-white px-2 mr-2 h-9 text-xs text-black outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    required
                  />
                  <button className="bg-gray-700 hover:bg-gray-600 text-white h-full px-3 rounded">
                    Search
                  </button>
                </div>
              </div>
              <div className="w-full text-gray-500 px-6 gap-6 overflow-y-auto pb-24 hide-scrollbar flex justify-center items-start">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    Loading hospitals...
                  </div>
                ) : response ? (
                  <p className="h-full w-full flex items-center justify-center">
                    {response}
                  </p>
                ) : filteredHospitals.length > 0 ? (
                  <div className="p-4 w-full text-gray-500 px-6 gap-6 overflow-y-auto hide-scrollbar grid grid-cols-3 ">
                    {filteredHospitals.map((hospital) => (
                      <Hospital
                        id={hospital._id}
                        name={hospital.name}
                        phone={hospital.phone}
                        address={hospital.address}
                        city={hospital.city}
                        bloodGroup={hospital.bloodGroup}
                        bloodBank={hospital.bloodBank}
                        pincode={hospital.pincode}
                        email={hospital.email}
                        facilities={hospital.facilities}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="h-full w-full flex items-center justify-center">
                    No hospitals found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receiver;
