"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import DealerPropertyTable from "../../components/DealerPropertyTable/DealerPropertyTable";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LuRefreshCw } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

export default function DealerPanel() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    fullName: "",
    phone: "",
    companyName: ""
  });
  const [filters, setFilters] = useState({
    location: "",
    city: "",
    category: "",
    purpose: "",
    dealerName: "",
    sortBy: "",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.phone) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${session.user.phone}`
          );
          if (response.data && response.data.data) {
            setUserData({
              fullName: response.data.data.fullName,
              phone: response.data.data.phone,
              companyName: response.data.data.companyName
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data. Please try again later.");
        }
      }
    };
    fetchUserData();
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated" && userData.fullName) {
      fetchDealerProperties();
    }
  }, [status, userData.fullName]);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const refreshProperties = () => {
    if (status === "authenticated" && userData.fullName) {
      setIsRefreshing(true);
      fetchDealerProperties();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const fetchDealerProperties = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user?phone=${encodeURIComponent(userData.phone)}`
      );
      
      // Filter properties where senderName matches user's fullName
      const filtered = response.data.data.filter(
        property => property.senderName === userData.fullName
      );
      
      setProperties(filtered || []);
      router.refresh();
    } catch (err) {
      console.error("Error fetching dealer properties:", err);
      setError("Failed to load properties. Please try again later.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      city: "",
      category: "",
      purpose: "",
      dealerName: "",
      sortBy: "",
    });
  };

  const applyFilters = () => {
    let temp = [...properties];

    if (filters.location) {
      temp = temp.filter((p) =>
        p.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.city) {
      temp = temp.filter(
        (p) => p.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }
    if (filters.category) {
      temp = temp.filter(
        (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.purpose) {
      temp = temp.filter(
        (p) => p.buyOrRent?.toLowerCase() === filters.purpose.toLowerCase()
      );
    }
    if (filters.dealerName) {
      temp = temp.filter((p) =>
        p.senderName?.toLowerCase().includes(filters.dealerName.toLowerCase())
      );
    }

    if (filters.sortBy === "priceAsc") {
      temp.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (filters.sortBy === "priceDesc") {
      temp.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    }

    setFilteredProperties(temp);
  };

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-screen flex items-center justify-center bg-gray-50"
      >
        <h1 className="text-xl md:text-3xl font-bold text-red-500 px-4 text-center">
          {error}
        </h1>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gray-50 p-4 md:p-8 roboto mt-16"
    >
      <div className="max-w-full mx-auto flex flex-col gap-y-4 md:gap-y-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="w-full md:w-fit flex flex-col gap-y-2 md:gap-y-4">
            <Link
              className="cursor-pointer bg-transparent flex gap-x-3 items-center text-primary text-sm md:text-base"
              href={`/${userData?.companyName?.replace(/\s+/g, "-") || ""}`}
            >
              <IoIosArrowRoundBack className="text-2xl" />
              <span>Back to Properties</span>
            </Link>
            <div className="w-full md:w-fit flex flex-col gap-y-1 md:gap-y-3">
              <h1 className="text-xl md:text-2xl font-bold roboto">
              </h1>
              <h1 className="text-base md:text-xl font-semibold roboto">
                Welcome to Dealer Panel, {userData.fullName} 👋✨
              </h1>
            </div>
          </div>
          <div className="w-full md:w-fit flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshProperties}
              className="px-4 py-2 border border-black items-center rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300 flex gap-x-3 justify-center"
            >
              <motion.span
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
              >
                <LuRefreshCw />
              </motion.span>
              Refresh
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className="px-4 py-2.5 cursor-pointer transition-all duration-300 bg-primary  text-white rounded-lg shadow flex justify-center items-center"
                href="/addnewitem"
              >
                + Add New Property
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-4 flex flex-col gap-y-4"
        >
          <div className="w-full h-fit flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-base md:text-lg font-bold roboto">
              Filters & Sorting
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-4 py-2 sm:px-5 sm:py-3 text-sm font-normal text-white cursor-pointer bg-primary rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
            >
              Clear All Filters
            </motion.button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {Object.entries(filters).map(([key, value]) => (
              <motion.div
                key={key}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {key === "purpose" || key === "sortBy" ? (
                  <div className="w-full h-fit pr-2 border border-gray-300 rounded">
                    <select
                      name={key}
                      value={value}
                      onChange={handleFilterChange}
                      className="w-full outline-none px-3 py-3 placeholder:text-gray-300 text-sm md:text-base"
                    >
                      <option value="">{key === "purpose" ? "Purpose" : "Sort By"}</option>
                      {key === "purpose" ? (
                        <>
                          <option value="Buy">Buy</option>
                          <option value="Rent">Rent</option>
                        </>
                      ) : (
                        <>
                          <option value="priceAsc">Price Low to High</option>
                          <option value="priceDesc">Price High to Low</option>
                        </>
                      )}
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    name={key}
                    placeholder={
                      key === "dealerName" 
                        ? "Property Dealer Name" 
                        : key.charAt(0).toUpperCase() + key.slice(1)
                    }
                    value={value}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 outline-none rounded px-3 py-2 text-sm md:text-base"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <DealerPropertyTable
          properties={filteredProperties}
          onDelete={refreshProperties}
        />
      </div>
    </motion.div>
  );
}