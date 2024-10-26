import React, { useEffect, useState } from "react";
import DonorNav from "./DonorNav";
import axios from "axios";
import { useParams } from "react-router-dom";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const donorId = useParams().donorId || null;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log(donorId);
        const response = await axios.get(`http://localhost:5050/lifeflow/auth/donors/${donorId}/requests`);
        setRequests(response.data.data);
      } catch (error) {
        setError("Could not fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [donorId]);

  if (loading) return <p className="text-center text-white mt-10">Loading requests...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="Geist h-screen w-full flex flex-col items-center justify-start bg-[#0a0a0a] text-white">
      <DonorNav />
      <div className="w-full max-w-4xl mt-20 px-6">
        <h2 className="text-2xl font-semibold my-6">Requests Received</h2>
        <div className="space-y-6">
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-lg p-6 shadow-md hover:bg-[#2a2a2a]"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <p className="text-lg font-medium">
                    <strong>Receiver Name:</strong> {request.receiverName}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 md:mt-0">
                    <strong>Requested At:</strong> {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <p>
                    <strong>Blood Group:</strong> {request.bloodGroup}
                  </p>
                  <p>
                    <strong>Contact Info:</strong> {request.contactInfo}
                  </p>
                  <p>
                    <strong>City:</strong> {request.city}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`font-semibold ${request.status === "Pending" ? "text-yellow-500" : request.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                      {request.status}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No requests received.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
