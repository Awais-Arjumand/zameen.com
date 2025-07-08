import React from "react";
import { IoHome } from "react-icons/io5";

const TopNavBar = () => {
  return (
    <div className="w-full h-fit py-4 bg-[#33a137] text-white px-32 flex justify-between items-center gap-x-8">
      <div className="w-[55%] h-fit border border-black flex items-center gap-x-4">
        <IoHome className="text-2xl" />
        <ul className="space-x-4 flex font-semibold">
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Services</li>
        </ul>
      </div>
    </div>
  );
};

export default TopNavBar;
