import React, { useState } from "react";
import toast from "react-hot-toast";

const Email = () => {
  const [email, setEmail] = useState("");

  const onSubscribe = () => {
      toast.success("Subscribed to Lifeflow");
  };

  return (
    <div className="h-auto flex flex-col items-center justify-center w-full shadow-xl border border-gray-300 bg-gradient-to-l  from-[#fff7e4] to-white  p-4 rounded-[5px]">
      <h1 className="text-base w-full text-left Geist-semibold text-gray-600 ml-2 mb-2">
        Email me updates!
      </h1>
      <p className="text-xs text-start text-gray-400 mb-4 ml-1">
        Get notified about new blood donation opportunities that match your
        blood type and location so you can stay on top of your efforts to save
        lives!
      </p>
      <button
        type="submit"
        onClick={onSubscribe}
        className="h-9 w-full text-xs font-semibold bg-[#FF6C37] text-white rounded-[5px] flex items-center justify-center"
      >
        Subscribe to Lifeflow
      </button>
    </div>
  );
};

export default Email;
