import React, { useState, useEffect } from "react";
import Navigation from "./Navigation.jsx";
import "../../fonts/stylesheet.css";
import Job from "./Job.jsx";

const Openings = () => {
  const [selectedTopic, setSelectedTopic] = useState("Welcome");
  const [email, setEmail] = useState("");
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setisLoading(false);
    }, 1500);
  }, []);
  
  const jobs = [
    {
      "id": 1,
      "companyName": "Linear Company",
      "jobPosition": "Software Development Engineer 1",
      "jobType": "Internship",
      "location": "Mumbai, Pune",
      "postedTime": "Last 24 hours",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
    {
      "id": 2,
      "companyName": "TechCorp",
      "jobPosition": "Data Scientist",
      "jobType": "Full-time",
      "location": "Bangalore",
      "postedTime": "Yesterday",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
    {
      "id": 3,
      "companyName": "StartUp Inc.",
      "jobPosition": "Product Manager",
      "jobType": "Contract",
      "location": "Hyderabad",
      "postedTime": "Last week",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
    {
      "id": 4,
      "companyName": "AuroraTech Inc.",
      "jobPosition": "Software Development Engineer 1 ",
      "jobType": "Full-time",
      "location": "New York",
      "postedTime": "Last 2 days",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
    {
      "id": 5,
      "companyName": "Pulse Digital Solutions",
      "jobPosition": "Data Analyst",
      "jobType": "Contract",
      "location": "Seattle",
      "postedTime": "Last week",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
    {
      "id": 6,
      "companyName": "Nexus Corporation",
      "jobPosition": "Marketing Manager",
      "jobType": "Full-time",
      "location": "Redmond",
      "postedTime": "Last 3 days",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
    {
      "id": 7,
      "companyName": "Skyline Ventures",
      "jobPosition": "Product Manager",
      "jobType": "Internship",
      "location": "Menlo Park",
      "postedTime": "Last 2 days",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
    {
      "id": 8,
      "companyName": "Fusion Media Group",
      "jobPosition": "UX Designer",
      "jobType": "Full-time",
      "location": "Cupertino",
      "postedTime": "Last week",
      "jobDescription": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam in, amet cumque perspiciatis eum tempora aliquid non recusandae at fugit aliquam veritatis eos voluptatum ipsum rem maxime aut similique totam.",
      "applyLink": "/apply"
    },
      ];
     
  const renderContent = () => {
    switch (selectedTopic) {
      case "Logical Reasoning":
        return <LR />;
      case "Quantitative Ability":
        return <p>This is the content for Quantitative Ability.</p>;
      case "Data Interpretation":
        return <p>This is the content for Data Interpretation.</p>;
      case "Analytical Ability":
        return <p>This is the content for Analytical Ability.</p>;
      case "Verbal Ability":
        return <p>This is the content for Verbal Ability.</p>;
      case "Arrays":
        return <p>This is the content for Arrays.</p>;
      case "Hashmaps":
        return <p>This is the content for Hashmaps.</p>;
      default:
        return <p>Select a topic to view the content.</p>;
    }
  };

  return (
    <div className="Geist h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <div className="w-full xl:w-[1280px] 2xl:w-[1440px] flex mt-20">
        <div className="hidden lg:block lg:w-[25%] xl:w-[20%] h-full flex-col text-[#868686] text-md p-3 overflow-y-auto">
          <ul className="space-y-2 pl-2 mt-2">
            <h1 className="text-xl Geist-semibold text-gray-200">Filters</h1>
            <div>
              <h1 className="text-lg">Location</h1>
              <ul className="text-md mb-6">
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="location-1"
                    name="location"
                    value="All"
                    
                  />
                  <label for="All" className="ml-2">
                    All
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="Mumbai"
                    name="location"
                    value="Mumbai"
                  />
                  <label for="Mumbai" className="ml-2">
                    Mumbai
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="Pune"
                    name="location"
                    value="Pune"
                  />
                  <label for="Pune" className="ml-2">
                    Pune
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="Navi-mumbai"
                    name="location"
                    value="Navi-mumbai"
                  />
                  <label for="Navi-mumbai" className="ml-2">
                    Navi Mumbai
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="Bangalore"
                    name="location"
                    value="Bangalore"
                  />
                  <label for="Bangalore" className="ml-2">
                    Bangalore
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="Hyderabad"
                    name="location"
                    value="Hyderabad"
                  />
                  <label for="Hyderabad" className="ml-2">
                    Hyderabad
                  </label>
                </li>
              </ul>
            </div>
            <div>
              <h1 className="text-lg">Date of Posting</h1>
              <ul className="text-md mb-6">
                <li className="my-2">
                  <input type="checkbox" id="date-1" name="date" value="All" />
                  <label for="date-1" className="ml-2">
                    All Time
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="date-2"
                    name="date"
                    value="Last 24 hours"
                  />
                  <label for="date-2" className="ml-2">
                    Last 24 hours
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="date-3"
                    name="date"
                    value="Last 7 days"
                  />
                  <label for="date-3" className="ml-2">
                    Last 7 days
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="date-4"
                    name="date"
                    value="Last month"
                  />
                  <label for="date-4" className="ml-2">
                    Last Month
                  </label>
                </li>
              </ul>
            </div>
            <div>
              <h1 className="text-lg">Job Roles</h1>
              <ul className="text-md mb-6">
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-1"
                    name="role"
                    value="Frontend Developer"
                  />
                  <label for="role-1" className="ml-2">
                    Frontend Developer
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-2"
                    name="role"
                    value="Data Scientist"
                  />
                  <label for="role-2" className="ml-2">
                    Data Scientist
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-2"
                    name="role"
                    value="Software Engineer"
                  />
                  <label for="role-2" className="ml-2">
                    Software Engineer
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-2"
                    name="role"
                    value="Data Analyst"
                  />
                  <label for="role-2" className="ml-2">
                    Data Analyst
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-2"
                    name="role"
                    value="Business Analyst"
                  />
                  <label for="role-2" className="ml-2">
                    Business Analyst
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-2"
                    name="role"
                    value="Backend Engineer"
                  />
                  <label for="role-2" className="ml-2">
                    Backend Engineer
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-2"
                    name="role"
                    value="Devops Engineer"
                  />
                  <label for="role-2" className="ml-2">
                    Devops Engineer
                  </label>
                </li>
                <li className="my-2">
                  <input
                    type="checkbox"
                    id="role-2"
                    name="role"
                    value="Full Stack Developer"
                  />
                  <label for="role-2" className="ml-2">
                    Full Stack Developer
                  </label>
                </li>
              </ul>
            </div>
          </ul>
        </div>
        <div className="p-4 h-screen w-full md:w-[75%] xl:w-[55%] text-white Geist px-6 overflow-y-auto hide-scrollbar">
          {jobs.map((job) => (
            <Job
              key={job.id}
              companyName={job.companyName}
              jobPosition={job.jobPosition}
              jobType={job.jobType}
              location={job.location}
              postedTime={job.postedTime}
              jobDescription={job.jobDescription}
              applyLink={job.applyLink}
            />
          ))}
        </div>
        <div className="hidden xl:block xl:w-[25%] h-full text-md Geist-semibold p-4 text-white overflow-y-auto">
          <ul className="space-y-2">
            <div className="h-[250px] flex flex-col items-center justify-center w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[6px] p-3 px-4">
              <h1 className="text-xl w-full text-left Geist-semibold text-white ml-2 mb-2">
                Email me for jobs
              </h1>
              <p className="text-sm Geist  text-start text-gray-400 mb-4 ml-1">
                Get notified about new job postings that match your skills and
                interests so you can stay on top of your job search.
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
      </div>
      {isLoading && <Loader/>}
    </div>
  );
};

export default Openings;
