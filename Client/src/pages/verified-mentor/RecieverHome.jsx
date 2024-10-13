import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/user/Navigation";

const RecieverHome = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [donationType, setDonationType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/lifeflow/auth/donors/donations`
        );
        setDonations(response.data);
        setFilteredDonations(response.data); // Initially display all donations
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
        const response = await axios.get(
          `http://localhost:5050/lifeflow/auth/donors/donations/filter`,
          {
            params: {
              bloodGroup,
              city,
              donationType,
            },
          }
        );
        setFilteredDonations(response.data);
      } catch (error) {
        setError("Error filtering donations");
      }
    };
    fetchFilteredDonations();
  }, [bloodGroup, city, donationType]);

  if (loading) {
    return <p>Loading donations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="Geist h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation/>
      <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex mt-20">
        {/* Filters Section */}
        <div className="hidden lg:block lg:w-[25%] xl:w-[20%] h-full flex-col text-[#868686] text-md p-3 overflow-y-auto">
          <ul className="space-y-2 pl-2 mt-2">
            <h1 className="text-xl Geist-semibold text-gray-200">Filters</h1>
            <div>
              <h1 className="text-lg">Blood Group</h1>
              <ul className="text-md mb-6">
                <li className="my-2">
                  <button
                    className="bg-blue-500 text-white p-2"
                    onClick={() => setBloodGroup("")}
                  >
                    All
                  </button>
                </li>
                <li className="my-2">
                  <button
                    className="bg-red-500 text-white p-2"
                    onClick={() => setBloodGroup("")}
                  >
                    Uncheck All
                  </button>
                </li>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
                  <li className="my-2" key={group}>
                    <input
                      type="checkbox"
                      id={`blood-group-${group}`}
                      name="bloodGroup"
                      value={group}
                      onChange={(e) => setBloodGroup(e.target.checked ? group : "")}
                    />
                    <label htmlFor={`blood-group-${group}`} className="ml-2">
                      {group}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="text-lg">City</h1>
              <ul className="text-md mb-6">
                <li className="my-2">
                  <button
                    className="bg-blue-500 text-white p-2"
                    onClick={() => setCity("")}
                  >
                    All
                  </button>
                </li>
                <li className="my-2">
                  <button
                    className="bg-red-500 text-white p-2"
                    onClick={() => setCity("")}
                  >
                    Uncheck All
                  </button>
                </li>
                {["Borivali", "Andheri", "Bandra", "Bhayandar", "Vasai", "Virar"].map((city) => (
                  <li className="my-2" key={city}>
                    <input
                      type="checkbox"
                      id={`city-${city}`}
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.checked ? city : "")}
                    />
                    <label htmlFor={`city-${city}`} className="ml-2 ">
                      {city}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="text-lg">Donation Type</h1>
              <ul className="text-md mb-6">
                <li className="my-2">
                  <button
                    className="bg-blue-500 text-white p-2"
                    onClick={() => setDonationType("")}
                  >
                    All
                  </button>
                </li>
                <li className="my-2">
                  <button
                    className="bg-red-500 text-white p-2"
                    onClick={() => setDonationType("")}
                  >
                    Uncheck All
                  </button>
                </li>
                {["Whole Blood", "Plasma"].map((type) => (
                  <li className="my-2" key={type}>
                    <input
                      type="checkbox"
                      id={`donation-type-${type}`}
                      name="donationType"
                      value={type }
                      onChange={(e) => setDonationType(e.target.checked ? type : "")}
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

        {/* Donation List Section */}
        <div className="p-4 h-screen w-full md:w-[75%] xl:w-[55%] text-white Geist px-6 overflow-y-auto hide-scrollbar">
          {filteredDonations.length === 0 ? (
            <p>No donation opportunities found.</p>
          ) : (
            filteredDonations.map((donation) => (
              <div key={donation._id} className="border p-4 mb-4">
                <h2 className="text-xl font-bold">{donation.city} Donation</h2>
                <p>
                  <strong>Blood Type:</strong> {donation.bloodGroup}
                </p>
                <p>
                  <strong>City:</strong> {donation.city}, {donation.pincode}
                </p>
                <p>
                  <strong>Address:</strong> {donation.address}
                </p>
                <p>
                  <strong>Donation Type:</strong> {donation.donationType}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecieverHome;