import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import Navigation from "./Navigation.jsx";
import JoinClass from "../../modals/JoinClass.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import NewLoader from "../NewLoader.jsx";
import ClassCard from "./ClassCard.jsx";
import NotFound from "../mentor/NotFound.jsx";
import EmptyCard from "../mentor/EmptyCard.jsx";

// Coderoom Component (Frontend)
const Coderoom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [joinClassModal, setJoinClassModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const val = JSON.parse(localStorage.getItem("user")) || null;
  const userId = val?._id || null;

  const fetchClassesJoinedByUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/coderoom/auth/get-classes-joined/${userId}`
      );

      if (response.status === 200) {
        setClasses(response.data.classesJoined);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error fetching classes:", error.message);
    }
  };

  useEffect(() => {
    fetchClassesJoinedByUser();
  }, [userId]);

  const handleJoinClass = async (classInfo) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/coderoom/auth/join-class",
        {
          classCode: classInfo,
          userId: userId,
        }
      );

      if (response.status === 200) {
        setClasses((prevClasses) => [...prevClasses, classInfo]);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error joining class:", err.message);
      toast.error("Failed to join the class.");
    }
  };

  return (
    <div className="Geist h-screen relative overflow-hidden w-full flex flex-col items-center justify-start bg-[#0a0a0a]">
      <Navigation />
      <button style={{ zIndex: 1100 }} onClick={() => setJoinClassModal(true)}>
        <FaCirclePlus className="text-yellow-500 hover:text-yellow-500 text-5xl fixed bottom-10 md:bottom-16 right-10 md:right-16 transition-all" />
      </button>
      {joinClassModal && (
        <JoinClass
          onCancel={() => setJoinClassModal(false)}
          onJoinClass={handleJoinClass}
        />
      )}
      {isLoading && <NewLoader />}

      <div className="sm:p-4 mt-24 h-full w-full pt-1 px-4 2xl:w-[1440px] flex justify-between items-start">
        {classes && classes.length > 0 ? (
          <div className="mx-auto w-full">
            <div className="grid grid-cols-1 place-items-center md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-2">
              {classes.map((cls) => (
                <ClassCard
                  key={cls._id}
                  title={cls.className}
                  date={cls.createdAt}
                  content={cls.description}
                  userId={userId}
                  id={cls._id}
                />
              ))}
            </div>
          </div>
        ) : (
          <>{!classes ? <NotFound /> : <EmptyCard />}</>
        )}
      </div>
    </div>
  );
};

export default Coderoom;
