"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TbLogout } from "react-icons/tb";
import apiClient from "../../../../src/service/apiClient";

const NavBar = ({ userData: propUserData }) => {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localUserData, setLocalUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const isAuthenticated = !!session;
  const isDealerPanel = pathname === "/dealer-panel";
  const IsAdmin = pathname === "/admin";
  const IsHome = pathname === "/";
  const IsPropertyId = pathname.startsWith("/property/");
  const showAuthButtons = !IsAdmin && !isDealerPanel;

  // Combine all user data sources with proper fallbacks
  const userData = {
    ...(propUserData || {}),
    ...(localUserData || {}),
    ...(session?.user || {}),
    fullName: propUserData?.fullName || localUserData?.fullName || session?.user?.fullName || 'User',
    phone: propUserData?.phone || localUserData?.phone || session?.user?.phone || '',
    logo: propUserData?.logo || localUserData?.logo || session?.user?.logo || "/images/Login/img2.svg",
    logoColor: propUserData?.logoColor || localUserData?.logoColor || session?.user?.logoColor || "#3B404C"
  };

  const buttonStyle = {
    backgroundColor: userData.logoColor,
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isAuthenticated && session?.user?.phone && !propUserData?.fullName) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
         
          const response = await apiClient.get("/users", {
            params: { phone: session.user.phone }
          });
          if (response.data?.data) {
            const user = Array.isArray(response.data.data)
              ? response.data.data.find(u => u.phone === session.user.phone)
              : response.data.data;
            setLocalUserData(user);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated, session, propUserData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-30">
      <div className="flex h-fit items-center justify-between gap-x-4 shadow-lg bg-[#f7f7f7] px-4 py-4 text-sm text-gray-700 md:flex lg:px-12">
        <Link href={"/"} className="text-2xl font-bold text-gray-500">
          <Image
            alt="Company Logo"
            src={"/images/Login/img2.svg"}
            width={150}
            height={150}
            className="w-32 md:w-40"
            priority
          />
        </Link>

        <div className="flex items-center gap-x-4">
          {showAuthButtons && !IsHome && !IsPropertyId && !isDealerPanel && (
            <Link
              className="flex rounded px-4 py-1.5 justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:opacity-90"
              href={isAuthenticated ? "/dealer-panel" : "/auth/signin"}
              style={buttonStyle}
            >
              My Property
            </Link>
          )}

          {isAuthenticated ? (
            showAuthButtons && !IsPropertyId && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                  disabled={loading}
                >
                  <div className="hidden md:block text-right">
                   
                    <p className="text-xs text-gray-500">
                      {userData.phone}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full cursor-pointer bg-gray-300 flex items-center justify-center overflow-hidden">
                    {userData.fullName ? (
                      <span className="font-medium text-gray-700">
                        {userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg focus:outline-none z-50">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex gap-x-3 cursor-pointer items-center px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <TbLogout className="text-xl" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )
          ) : showAuthButtons ? (
            IsHome || IsPropertyId ? (
              <Link
                className="flex rounded px-4 py-1.5 justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:opacity-90"
                href="/auth/signup"
                style={buttonStyle}
              >
                Join Us
              </Link>
            ) : (
              <Link
                className="flex rounded px-4 py-1.5 justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:opacity-90"
                href="/auth/signin"
                style={buttonStyle}
              >
                Login
              </Link>
            )
          ) : null}
        </div>
      </div>

      {isMobile && showAuthButtons && (IsHome || IsPropertyId) && !isDealerPanel && (
        <div className="flex justify-between items-center p-4 md:hidden">
          <Link
            className="rounded px-4 py-1.5 flex justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:opacity-90"
            href={isAuthenticated ? "/dealer-panel" : "/auth/signup"}
            style={buttonStyle}
          >
            {isAuthenticated ? "My Property" : "Join Us"}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;