import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Resources = () => {
  const { classId } = useParams();
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
    if (!userId) {
      setError("You are not logged in");
      return;
    }

    console.log("ClassId" ,classId);
    console.log("UserId ",userId);

    const getClassResources = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/coderoom/auth/resources/${userId}/${classId}`
        );
        const resources = response.data.resources;
        setResources(resources);
      } catch (error) {
        setError("Error retrieving resources");
        console.error(error);
      }
    };

    getClassResources();
  }, [classId]);

  return (
    <div className="h-[780px] w-full pb-32">
      <h1>Resources</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul id="resource-list">
          {resources.map((resource) => (
            <li key={resource._id}>{resource.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Resources;