import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/user/Navigation";
import Hospital from "./components/Hospital";
import { FiSearch } from "react-icons/fi";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [city, setCity] = useState([]); // Array for multiple selections
  const [bloodGroup, setBloodGroup] = useState([]); // Array for multiple selections
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);

  // Fetch all hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        // For now, let's use dummy data
        const dummyHospitals = [
          {
            _id: "1",
            name: "Apollo Hospital",
            address:
              "Plot No. 1, Road No. 72, Opp. Bharatiya Vidya Bhavan, Borivali, Mumbai 500033",
            city: "Mumbai",
            bloodGroup: "A+",
            distance: "5 km",
          },
          {
            _id: "2",
            name: "Max Hospital",
            address:
              "Plot No. 4A, Road No. 10, Banjara Hills, Dadar, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "B+",
            distance: "7 km",
          },
          {
            _id: "3",
            name: "Fortis Hospital",
            address:
              "Plot No. 8-16, Road No. 4, Banjara Hills, Bandra, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "O+",
            distance: "3 km",
          },
          {
            _id: "4",
            name: "KIMS Hospital",
            address:
              "Plot No. 1, Road No. 14, Banjara Hills, Andheri, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "AB+",
            distance: "2 km",
          },
          {
            _id: "5",
            name: "Care Hospital",
            address:
              "Plot No. 4-8-15, Road No. 1, Banjara Hills, Chembur, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "A-",
            distance: "6 km",
          },
        ];

        setHospitals(dummyHospitals);
        setFilteredHospitals(dummyHospitals); // Initially display all hospitals
        setLoading(false);
      } catch (error) {
        setError("Error fetching hospitals");
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);



  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <div className="h-full w-full mt-24 flex items-center justify-center text-white overflow-y-auto hide-scrollbar">
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex text-white sm:p-3 h-full hide-scrollbar">
          <div className="h-full w-full px-2 flex flex-col">
            <div className="h-[260px] w-full flex flex-col items-center justify-start">
              <h1 className="Geist-semibold text-[40px] text-center">
                Find your nearest hospitals
              </h1>
              <p className="Geist text-md text-center leading-6 mt-1 px-2 sm:px-0 text-gray-400">
                Find the nearest hospitals to you and get access to quality
                medical services, expert doctors, and state-of-the-art
                facilities.
              </p>
              <div className="Geist w-full sm:w-[420px] outline-none mt-6 mb-8 pl-2 md:w-[480px] lg:w-[540px] xl:w-[720px] border-2 border-[#1a1a1a] caret-white placeholder:text-[#68686F] bg-[#09090b] focus:border-gray-700 h-12 text-base text-white rounded-[7px] flex items-center justify-center">
                <FiSearch className="flex items-center justify-center" />
                <input
                  maxLength={30}
                  type="text"
                  placeholder="Search for hospitals..."
                  className="h-full w-full px-4 outline-none bg-[#09090b] focus:border-gray-700 flex items-center justify-center rounded-[7px]"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
                <button className="bg-gray-700 hover:bg-gray-600 text-white h-full px-3 rounded">
                  Search
                </button>
              </div>
            </div>
            <div className="p-4 h-screen w-full text-white grid grid-cols-2 Geist px-6 gap-6 overflow-y-auto pb-24 hide-scrollbar">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center text-xl">
                  Loading hospitals...
                </div>
              ) : error ? (
                <p className="h-full w-full flex items-center justify-center text-xl">
                  {error}
                </p>
              ) : filteredHospitals.length === 0 ? (
                <p className="h-full w-full flex items-center justify-center text-xl">
                  No hospitals found.
                </p>
              ) : (
                filteredHospitals.map((hospital) => (
                  <Hospital
                    key={hospital._id}
                    className="border p-4 mb-4"
                    name={hospital.name}
                    address={hospital.address}
                    city={hospital.city}
                    bloodGroup={hospital.bloodGroup}
                    distance={hospital.distance}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
