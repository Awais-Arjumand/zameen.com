"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NavBar = ({ isAdmin = false }) => {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const pathname = usePathname();

  const isAuthenticated = !!session;
  const isDealerPanel = pathname === "/dealer-panel";
  const IsAdmin = pathname === "/admin";

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isAuthenticated && session?.user?.phone) {
      // Fetch user data when authenticated
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/users");
          const data = await response.json();
          if (data.data) {
            const currentUser = data.data.find(
              (user) => user.phone === session.user.phone
            );
            if (currentUser) {
              setUserData(currentUser);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, session]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setIsDropdownOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="flex h-fit items-center justify-between gap-x-4 shadow-lg bg-[#f7f7f7] px-4 py-4 text-sm text-gray-700 md:flex lg:px-12">
        <Link href={"/"} className="text-2xl font-bold text-gray-500">
          <Image
            alt="Nav Logo"
            src={"../images/Login/img2.svg"}
            width={150}
            height={150}
            className="w-32 md:w-40"
          />
        </Link>

        <div className="flex items-center gap-x-4">
          {!IsAdmin && !isDealerPanel && (
            <Link
              className="flex rounded bg-[#3B404C] px-4 py-1.5 justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:bg-gray-500"
              href={isAuthenticated ? "/dealer-panel" : "/auth/signin"}
            >
              My Property
            </Link>
          )}

          {!isAuthenticated ? (
            <Link
              className="flex rounded bg-[#3B404C] px-4 py-1.5 justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:bg-gray-500"
              href={"/auth/signin"}
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {userData?.firstName} {userData?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.phone}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {userData?.firstName ? (
                    <span className="font-medium text-gray-700">
                      {userData.firstName.charAt(0).toUpperCase()}
                      {userData.lastName?.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 cursor-pointer text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      {isMobile && !IsAdmin && !isDealerPanel && (
        <div className="flex justify-between items-center p-4 md:hidden">
          <Link
            className="rounded bg-[#3B404C] px-4 py-1.5 flex justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:bg-gray-500"
            href={isAuthenticated ? "/dealer-panel" : "/auth/signin"}
          >
            My Property
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;