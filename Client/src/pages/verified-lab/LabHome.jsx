import React, { useState } from "react";
import toast from "react-hot-toast";
import "../../fonts/stylesheet.css";
import { NavLink, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/auth";

const LabHome = () => {
  const { user, logout } = useAuthStore();
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const recieverId = useParams().recieverId || null;
  const [isProfileButtonOpen, setIsProfileButtonOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleProfileButton = () => {
    setIsProfileButtonOpen(!isProfileButtonOpen);
  };

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [labs, setLabs] = useState([
    {
      _id: "lab1",
      title: "Lab 1: Introduction to Blood Analysis",
      pdf: "dummy-lab1.pdf",
      category: "Blood Analysis",
    },
    {
      _id: "lab2",
      title: "Lab 2: Thyroid Test",
      pdf: "dummy-lab2.pdf",
      category: "Thyroid Test",
    },
    {
      _id: "lab3",
      title: "Lab 3: Sonography",
      pdf: "dummy-lab3.pdf",
      category: "Sonography",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!file || !title) {
      alert("Please provide both a title and a file.");
      return;
    }

    const newLab = {
      _id: `lab${labs.length + 1}`,
      title: title,
      pdf: "dummy-new-lab.pdf",
      category: "MRI",
    };

    setLabs((prevLabs) => [...prevLabs, newLab]);
    setTitle("");
    setFile(null);
    toast.success("Lab resource uploaded successfully!");
  };

  const filteredLabs = labs.filter(
    (lab) => selectedCategory === "All" || lab.category === selectedCategory
  );

  const bloodReports = [
    {
      id: 1,
      title: "Lab 1: Introduction to Blood Analysis",
      reports: [
        { id: 1, name: "Hemoglobin (Hb)", value: "14.5 g/dL" },
        { id: 2, name: "Hematocrit (Hct)", value: "42.5%" },
        { id: 3, name: "Red Blood Cell Count (RBC)", value: "4.5 million/μL" },
        {
          id: 4,
          name: "White Blood Cell Count (WBC)",
          value: "7,000 cells/μL",
        },
        { id: 5, name: "Platelet Count", value: "250,000 cells/μL" },
        { id: 6, name: "Mean Corpuscular Volume (MCV)", value: "90 fL" },
        { id: 7, name: "Mean Corpuscular Hemoglobin (MCH)", value: "30 pg" },
        {
          id: 8,
          name: "Mean Corpuscular Hemoglobin Concentration (MCHC)",
          value: "34 g/dL",
        },
        { id: 9, name: "Red Cell Distribution Width (RDW)", value: "14.5%" },
        { id: 10, name: "Blood Urea Nitrogen (BUN)", value: "20 mg/dL" },
        { id: 11, name: "Creatinine", value: "1.2 mg/dL" },
        { id: 12, name: "Glucose", value: "90 mg/dL" },
        { id: 13, name: "Cholesterol", value: "180 mg/dL" },
        { id: 14, name: "Triglycerides", value: "150 mg/dL" },
        { id: 15, name: "HDL Cholesterol", value: "60 mg/dL" },
        { id: 16, name: "LDL Cholesterol", value: "120 mg/dL" },
        { id: 17, name: "VLDL Cholesterol", value: "30 mg/dL" },
        { id: 18, name: "Liver Function Test", value: "Normal" },
        { id: 19, name: "Kidney Function Test", value: "Normal" },
        { id: 20, name: "Electrolytes", value: "Balanced" },
      ],
    },
    {
      id: 2,
      title: "Lab 2: Thyroid Test",
      reports: [
        {
          id: 1,
          name: "Thyroid-Stimulating Hormone (TSH)",
          value: "2.5 μIU/mL",
        },
        { id: 2, name: "Free Thyroxine (FT4)", value: "1.2 ng/dL" },
        { id: 3, name: "Free Triiodothyronine (FT3)", value: "2.5 pg/mL" },
        { id: 4, name: "Thyroglobulin", value: "20 ng/mL" },
        { id: 5, name: "Thyroid Peroxidase Antibodies", value: "100 IU/mL" },
        { id: 6, name: "Thyroglobulin Antibodies", value: "50 IU/mL" },
        { id: 7, name: "Triiodothyronine (T3)", value: "120 ng/dL" },
        { id: 8, name: "Thyroxine (T4)", value: "8 μg/dL" },
        { id: 9, name: "Reverse Triiodothyronine (rT3)", value: "20 ng/dL" },
        { id: 10, name: "Thyroid Hormone Binding Ratio (THBR)", value: "1.2" },
        { id: 11, name: "Free Thyroxine Index (FTI)", value: "1.5" },
        { id: 12, name: "Triiodothyronine Uptake (T3U)", value: "30%" },
        {
          id: 13,
          name: "Thyroid-Stimulating Immunoglobulin (TSI)",
          value: "100 IU/mL",
        },
        {
          id: 14,
          name: "Thyroid Hormone Receptor Antibodies",
          value: "50 IU/mL",
        },
        { id: 15, name: "Thyroid Peroxidase Antibodies", value: "100 IU/mL" },
        { id: 16, name: "Thyroglobulin Antibodies", value: "50 IU/mL" },
        { id: 17, name: "Thyroid Hormone Binding Ratio (THBR)", value: "1.2" },
        { id: 18, name: "Free Thyroxine Index (FTI)", value: "1.5" },
        { id: 19, name: "Triiodothyronine Uptake (T3U)", value: "30%" },
        {
          id: 20,
          name: "Thyroid-Stimulating Immunoglobulin (TSI)",
          value: "100 IU/mL",
        },
      ],
    },
    {
      id: 3,
      title: "Lab 3: Sonography",
      reports: [
        { id: 1, name: "Liver Size", value: "Normal" },
        { id: 2, name: "Liver Echotexture", value: "Normal" },
        { id: 3, name: "Gallbladder Size", value: "Normal" },
        { id: 4, name: "Gallbladder Wall Thickness", value: "Normal" },
        { id: 5, name: "Common Bile Duct Size", value: "Normal" },
        { id: 6, name: "Pancreas Size", value: "Normal" },
        { id: 7, name: "Pancreas Echotexture", value: "Normal" },
        { id: 8, name: "Spleen Size", value: "Normal" },
        { id: 9, name: "Spleen Echotexture", value: "Normal" },
        { id: 10, name: "Kidney Size", value: "Normal" },
        { id: 11, name: "Kidney Echotexture", value: "Normal" },
        { id: 12, name: "Bladder Size", value: "Normal" },
        { id: 13, name: "Bladder Wall Thickness", value: "Normal" },
        { id: 14, name: "Prostate Size", value: "Normal" },
        { id: 15, name: "Prostate Echotexture", value: "Normal" },
        { id: 16, name: "Uterus Size", value: "Normal" },
        { id: 17, name: "Uter us Echotexture", value: "Normal" },
        { id: 18, name: "Ovaries Size", value: "Normal" },
        { id: 19, name: "Ovaries Echotexture", value: "Normal" },
        { id: 20, name: "Other Findings", value: "None" },
      ],
    },
  ];

  const [selectedReport, setSelectedReport] = useState(null);

  const handleViewReport = (lab) => {
    const report = bloodReports.find((report) => report.title === lab.title);
    if (report) {
      setSelectedReport(report);
    } else {
      toast.error("Report not found!");
    }
  };

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
                <NavLink to="/">
                  <img src={logo} className="h-8" alt="logo" />
                </NavLink>
              </div>
              <h1 className="text-gray-300 mt-1 font-semibold text-2xl">
                MED-EXPERT
              </h1>
            </div>
            <h1 className="text-white text-xl Geist-semibold">
              HEALTHCARE LABORATORY
            </h1>
            <div className="flex relative justify-between space-x-4">
              <div className="text-white bg-blue-700 px-2 py-2 rounded-[5px] flex items-center justify-center">
                <button onClick={handleLogout}>Logout</button>
              </div>
              <button onClick={toggleProfileButton}>
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[50%]"></div>
              </button>
              {isProfileButtonOpen && user ? (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0 a] border border-[#1e1e1e] rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
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
                      <span>Hospital: </span>
                      <span className="Geist text-gray-300">
                        {user?.name || "Unknown User"}
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

      <div className="h-full w-full mt-24 flex items-start justify-center text-white overflow-y-auto hide-scrollbar">
        <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex items-start text-white sm:p-3 hide-scrollbar">
          <div className="h-full w-[50%] flex flex-col">
            <div className="flex items-center mb-4">
              <label className="mr-4">Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#09090b] text-white border border-[#2A2A2A] rounded-[7px] h-10 px-4"
              >
                <option value="All">All</option>
                <option value="Blood Analysis">Blood Analysis</option>
                <option value="Thyroid Test">Thyroid Test</option>
                <option value="Sonography">Sonography</option>
                <option value="MRI">MRI</option>
              </select>
            </div>

            <div className="w-full h-[350px] bg-[#1a1a1a] border border-[#2e2e2e] p-4 rounded-[7px] overflow-y-auto hide-scrollbar">
              <h2 className="text-xl font-bold mb-4">Pending Reports</h2>
              {filteredLabs.length === 0 ? (
                <p>No reports available.</p>
              ) : (
                filteredLabs.map((lab) => (
                  <div
                    key={lab._id}
                    className="flex items-center justify-between py-2"
                  >
                    <h3 className="text-md">{lab.title}</h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleViewReport(lab)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="h-full w-[50%] flex flex-col ml-4">
            
            {selectedReport && (
              <div className=" p-4 bg-[#1e1e1e] rounded-md">
                <h2 className="text-lg font-bold mb-2">
                  Reports for {selectedReport.title}
                </h2>
                {selectedReport.reports.map((report) => (
                  <div key={report.id} className="flex justify-between">
                    <span>{report.name}</span>
                    <span>{report.value}</span>
                  </div>
                ))}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Close Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabHome;
