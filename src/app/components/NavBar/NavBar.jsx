// components/NavBar.jsx
"use client";
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaPlus,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdLanguage } from "react-icons/md";
import Image from "next/image";
import { IoHome } from "react-icons/io5";
import Link from "next/link";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toolsItems = [
    "Home Loan Calculator",
    "Area Unit Converter",
    "Land Record Pages",
    "Construction Cost Calculator",
  ];

  const moreItems = ["Forum", "Index", "Trends"];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        toolsOpen && 
        !e.target.closest(".tools-dropdown") &&
        !e.target.closest(".tools-trigger")
      ) {
        setToolsOpen(false);
      }
      if (
        moreOpen && 
        !e.target.closest(".more-dropdown") &&
        !e.target.closest(".more-trigger")
      ) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toolsOpen, moreOpen]);

  return (
    <nav className="w-full bg-white shadow-md">


      {/* Bottom Bar - Fixed text formatting */}
      <div className="h-fit hidden md:flex gap-x-4 items-center justify-between bg-[#f7f7f7] px-4 lg:px-16 py-4 text-sm text-gray-700 border-b">
   <h1 className="text-2xl text-gray-500 font-bold">Property.Com</h1>

     
   <div className="w-fit h-fit flex gap-x-4 items-center">
    <Link className="px-3 py-2 hover:bg-black hover:text-white transition-all duration-300 border border-black rounded-lg font-semibold text-base" href={"/login"}>Login</Link>
    <Link className="px-3 py-2 bg-green-500 hover:bg-green-700 transition-all duration-300 text-white rounded-lg font-semibold text-base" href={"/propertydealer"}>Add Property</Link>

   </div>
      </div>

    </nav>
  );
};

export default NavBar;