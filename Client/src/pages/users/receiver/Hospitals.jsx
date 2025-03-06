import React, { useState, useEffect } from "react";
import axios from "axios";
import Hospital from "../../components/Hospital.jsx";
import Navbar from "../../../components/Navbar.jsx";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, [searchTerm]); // Removed hospitals to prevent unnecessary re-renders

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start">
      <Navbar />
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
                      key={hospital._id}
                      name={hospital.name}
                      phone={hospital.phone}
                      address={hospital.address}
                      city={hospital.city}
                      bloodGroup={hospital.bloodGroup}
                      bloodBank={hospital.bloodBank}
                      pincode={hospital.pincode}
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
    </div>
  );
};

export default Hospitals;
