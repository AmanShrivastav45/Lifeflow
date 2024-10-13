import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useInstantTransition } from "framer-motion";

const Tests = ({ classId }) => {
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState("");
  const [isLoadingg, setisLoading] = useState(true);
  const classID = classId.classId;
  const temp = useParams();
  const userId = temp.userId;
  useEffect(() => {
    console.log(temp);
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/coderoom/auth/classes/${classID}/tests`
        );
        console.log(response.data);
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    console.log(classID);
    fetchTests();
  }, [classID]);

  return (
    <div className="p-4 h-[750px] w-full flex">
      <div className="h-full w-[70%]">
        <ul className="space-y-4 ">
          {tests.map((test) => (
            <li
              key={test._id}
              className="border border-[#3a3a3a] p-4 bg-[#2a2a2a] rounded-md shadow-md flex justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{test.title}</h3>
                <p className="text-sm">{test.description}</p>
              </div>
              <a
                onClick={() => setTestId(test._id)}
                href={`/user/${userId}/${classID}/test/${testId}`}
                className="text-white flex items-center justify-center mr-6 bg-green-700 px-4 rounded-[5px]"
              >
                Take Test
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-full w-[30%]"></div>
    </div>
  );
};

export default Tests;
