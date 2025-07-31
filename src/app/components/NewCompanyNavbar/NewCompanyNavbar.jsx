"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { TbLogout } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const NewCompanyNavbar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [logoColor, setLogoColor] = useState("#000000");
  const [isSaving, setIsSaving] = useState(false);
  const [logo, setLogo] = useState("");

  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const normalizeLogoPath = (logoPath) => {
    if (!logoPath) return "/images/Login/img2.svg";
    
    let normalized = logoPath.replace(/\\/g, '/').replace(/\/+/g, '/');
    
    if (!normalized.startsWith('/uploads/') && !normalized.startsWith('http')) {
      normalized = `/uploads/${normalized}`;
    }
    
    return normalized;
  };

  const logoUrl = userData?.logo ? normalizeLogoPath(userData.logo) : "/images/Login/img2.svg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session?.user?.phone) {
          const res = await axios.get(
            `http://localhost:3000/api/users/${encodeURIComponent(session.user.phone)}`
          );
          const data = res.data.data;
          setUserData(data);
          setFullName(data.fullName || "");
          setPhone(data.phone || "");
          setCompanyName(data.companyName || "");
          setLogoColor(data.logoColor || "#000000");
          setLogo(data.logo || "");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname, session]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      
      // Replace all spaces with hyphens in company name
      const formattedCompanyName = companyName.replace(/\s+/g, '-');
      
      formData.append("fullName", fullName);
      formData.append("companyName", formattedCompanyName);
      formData.append("phone", phone);
      formData.append("logoColor", logoColor);

      const response = await axios.patch(
        `http://localhost:3000/api/users/${encodeURIComponent(session.user.phone)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const res = await axios.get(
          `http://localhost:3000/api/users/${encodeURIComponent(session.user.phone)}`
        );
        setUserData(res.data.data);
        toast.success("Settings saved successfully!");
        setIsSettingsModalOpen(false);
        router.push("/auth/signin");
      } else {
        throw new Error(response.data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const fullNameInitial = userData?.fullName || "User";
  const phoneInitial = userData?.phone || "Contact";

  if (loading) {
    return (
      <nav className="w-full bg-white shadow-md fixed top-0 z-30">
        <div className="flex h-16 items-center justify-between px-6 shadow-lg bg-[#f7f7f7]">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="w-full bg-white shadow-md fixed top-0 z-30">
        <div className="flex h-fit items-center justify-between gap-x-4 shadow-lg bg-[#f7f7f7] px-4 py-4 text-sm text-gray-700 md:flex lg:px-12">
          <Link href={"/"} className="text-2xl font-bold text-gray-500">
            <Image
              alt="Company Logo"
              src={logoUrl}
              width={150}
              height={150}
              className="w-32 md:w-40"
              priority
              unoptimized={logoUrl.startsWith('blob:')}
              onError={(e) => {
                e.currentTarget.src = "/images/Login/img2.svg";
              }}
            />
          </Link>

          <div className="w-fit h-fit flex gap-x-3 items-center">
            <Link
              className="flex rounded bg-primary px-4 py-1.5 justify-center items-center w-fit h-fit text-xs font-normal text-white transition-all duration-300 hover:opacity-90"
              href={isAuthenticated ? "/dealer-panel" : "/auth/signin"}
            >
              My Property
            </Link>

            <div className="flex items-center gap-x-4">
              <div className="hidden md:block text-right">
                <p className="text-xs text-gray-500">{fullNameInitial}</p>
                <p className="text-xs text-gray-500">{phoneInitial}</p>
              </div>

              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer">
                      <span className="font-medium text-gray-700">
                        {fullNameInitial
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg focus:outline-none z-50">
                      <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="w-full flex gap-x-3 items-center px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        <FiSettings className="text-xl" />
                        Settings
                      </button>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex gap-x-3 items-center px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        <TbLogout className="text-xl" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">User Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">
                  Logo Color
                </label>
                <input
                  type="color"
                  value={logoColor}
                  onChange={(e) => setLogoColor(e.target.value)}
                  className="w-12 h-10 p-0 border border-gray-300 rounded"
                />
              </div>

              <div className="w-full h-fit flex gap-x-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  className={`bg-primary cursor-pointer text-white px-4 py-2 rounded w-full mt-4 ${
                    isSaving ? "opacity-70" : "hover:opacity-90"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  disabled={isSaving}
                  className="bg-gray-500 hover:bg-gray-600 transition-all duration-300 cursor-pointer text-white px-4 py-2 rounded w-full mt-4"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewCompanyNavbar;