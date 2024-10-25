import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/reciever/Navigation";
import Hospital from "./Hospital";
import { FiSearch } from "react-icons/fi";
import { useAuthStore } from "../../store/auth";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [city, setCity] = useState([]); // Array for multiple selections
  const [bloodGroup, setBloodGroup] = useState([]); // Array for multiple selections
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
            bloodBank: {
              Aplus: {
                quantityInLiters: 3,
              },
              Aminus: {
                quantityInLiters: 1,
              },
              Bplus: {
                quantityInLiters: 3,
              },
              Bminus: {
                quantityInLiters: 1,
              },
              Oplus: {
                quantityInLiters: 3,
              },
              Ominus: {
                quantityInLiters: 1,
              },
              ABplus: {
                quantityInLiters: 3,
              },
              ABminus: {
                quantityInLiters: 1,
              },
            },
          },
          {
            _id: "2",
            name: "Max Hospital",
            address:
              "Plot No. 4A, Road No. 10, Banjara Hills, Dadar, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "B+",
            distance: "7 km",
            bloodBank: {
              Aplus: {
                quantityInLiters: 3,
              },
              Aminus: {
                quantityInLiters: 1,
              },
              Bplus: {
                quantityInLiters: 3,
              },
              Bminus: {
                quantityInLiters: 1,
              },
              Oplus: {
                quantityInLiters: 3,
              },
              Ominus: {
                quantityInLiters: 1,
              },
              ABplus: {
                quantityInLiters: 3,
              },
              ABminus: {
                quantityInLiters: 1,
              },
            },
          },
          {
            _id: "3",
            name: "Fortis Hospital",
            address:
              "Plot No. 8-16, Road No. 4, Banjara Hills, Bandra, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "O+",
            distance: "3 km",
            bloodBank: {
              Aplus: {
                quantityInLiters: 3,
              },
              Aminus: {
                quantityInLiters: 1,
              },
              Bplus: {
                quantityInLiters: 3,
              },
              Bminus: {
                quantityInLiters: 1,
              },
              Oplus: {
                quantityInLiters: 3,
              },
              Ominus: {
                quantityInLiters: 1,
              },
              ABplus: {
                quantityInLiters: 3,
              },
              ABminus: {
                quantityInLiters: 1,
              },
            },
          },
          {
            _id: "4",
            name: "KIMS Hospital",
            address:
              "Plot No. 1, Road No. 14, Banjara Hills, Andheri, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "AB+",
            distance: "2 km",
            bloodBank: {
              Aplus: {
                quantityInLiters: 3,
              },
              Aminus: {
                quantityInLiters: 1,
              },
              Bplus: {
                quantityInLiters: 3,
              },
              Bminus: {
                quantityInLiters: 1,
              },
              Oplus: {
                quantityInLiters: 3,
              },
              Ominus: {
                quantityInLiters: 1,
              },
              ABplus: {
                quantityInLiters: 3,
              },
              ABminus: {
                quantityInLiters: 1,
              },
            },
          },
          {
            _id: "5",
            name: "Care Hospital",
            address:
              "Plot No. 4-8-15, Road No. 1, Banjara Hills, Chembur, Mumbai 500034",
            city: "Mumbai",
            bloodGroup: "A-",
            distance: "6 km",
            bloodBank: {
              Aplus: {
                quantityInLiters: 3,
              },
              Aminus: {
                quantityInLiters: 1,
              },
              Bplus: {
                quantityInLiters: 3,
              },
              Bminus: {
                quantityInLiters: 1,
              },
              Oplus: {
                quantityInLiters: 3,
              },
              Ominus: {
                quantityInLiters: 1,
              },
              ABplus: {
                quantityInLiters: 3,
              },
              ABminus: {
                quantityInLiters: 1,
              },
            },
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

  useEffect(() => {
    if (searchTerm) {
      const filtered = hospitals.filter((hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHospitals(filtered);
    } else {
      setFilteredHospitals(hospitals); // Reset to all hospitals if search is empty
    }
  }, [searchTerm, hospitals]);

  return (
    <div className="h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <div
        style={{ zIndex: "1000" }}
        className="Geist h-20 bg-black top-0 w-full fixed flex justify-center border-b border-[#1a1a1a]"
      >
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex flex-col">
          <div className="w-full h-full flex items-center justify-between text-md p-2">
            <div className="flex items-center">
              <div className="relative w-[60px] flex items-center mx-2">
                <NavLink to="/" className={getNavLinkClass}>
                  <img src={logo} className="h-8" alt="logo" />
                </NavLink>
              </div>
              <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
                LIFEFLOW
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
                      Logout Lifeflow
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
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
                  onChange={( e) => setSearchTerm(e.target.value)} // Update search term
                  value={searchTerm}
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
                    bloodBank={hospital.bloodBank}
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