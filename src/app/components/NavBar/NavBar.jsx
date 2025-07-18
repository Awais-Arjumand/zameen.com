"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const NavBar = ({ isAdmin = false }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="hidden h-fit items-center justify-between gap-x-4 border-b bg-[#f7f7f7] px-4 py-4 text-sm text-gray-700 md:flex lg:px-16">
        <h1 className="text-2xl font-bold text-gray-500">
          {isAdmin ? "Admin Dashboard" : "Property.Com"}
        </h1>

        <div className="flex h-fit w-fit items-center gap-x-4">
            <Link
              className="rounded-lg border border-black px-3 py-2 text-base font-semibold transition-all duration-300 hover:bg-black hover:text-white"
              href={isAdmin ? "/admin/login" : "/login"}
            >
              Login
            </Link>
        
          {!isAdmin && (
            <Link
              className="rounded-lg bg-green-500 px-3 py-2 text-base font-semibold text-white transition-all duration-300 hover:bg-green-700"
              href="/dealer-panel-login"
            >
              Add Property
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;