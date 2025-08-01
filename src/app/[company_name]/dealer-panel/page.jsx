"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DealerPropertyTable from "../../components/DealerPropertyTable/DealerPropertyTable";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LuRefreshCw } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../../src/service/apiClient";

export default function DealerPanel() {
  const { data: session, status } = useSession();
  const [userProperties, setUserProperties] = useState([]);
  const [companyProperties, setCompanyProperties] = useState([]);
  const [privateProperties, setPrivateProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    fullName: "",
    phone: "",
    companyName: "",
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
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'company', 'private'
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.phone) {
        try {
          // const response = await axios.get(
          //   `http://localhost:3000/api/users/${session.user.phone}`
          // );
          const response = await apiClient.get(`/users/${session.user.phone}`);
          if (response.data && response.data.data) {
            setUserData({
              fullName: response.data.data.fullName,
              phone: response.data.data.phone,
              companyName: response.data.data.companyName,
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

  const activeProperties = useMemo(() => {
    if (activeFilter === "all") {
      return [
        ...userProperties,
        ...companyProperties.filter(
          (cp) => !userProperties.some((up) => up._id === cp._id)
        ),
        ...privateProperties.filter(
          (pp) =>
            !userProperties.some((up) => up._id === pp._id) &&
            !companyProperties.some((cp) => cp._id === pp._id)
        ),
      ];
    } else if (activeFilter === "company") {
      return companyProperties;
    } else if (activeFilter === "private") {
      return privateProperties;
    }
    return [];
  }, [
    userProperties,
    companyProperties,
    privateProperties,
    activeFilter,
    userData.companyName,
  ]);

  useEffect(() => {
    if (status === "authenticated" && userData.phone) {
      fetchDealerProperties();
    }
  }, [status, userData.phone]);

  useEffect(() => {
    applyFilters();
  }, [filters, activeProperties]);

  const refreshProperties = () => {
    if (status === "authenticated" && userData.phone) {
      setIsRefreshing(true);
      fetchDealerProperties();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const fetchDealerProperties = async () => {
    try {
      // Fetch user properties
      // const userResponse = await axios.get(
      //   `http://localhost:3000/api/user?phone=${encodeURIComponent(
      //     userData.phone
      //   )}`
      // );
      const userResponse = await apiClient.get(
        `/user?phone=${encodeURIComponent(userData.phone)}`
      );
      // Filter properties where senderName matches user's fullName
      const userProps = userResponse.data.data.filter(
        (property) => property.senderName === userData.fullName
      );
      setUserProperties(userProps || []);

      // Fetch company properties
      // const companyResponse = await axios.get(
      //   "http://localhost:3000/api/company-properties"
      // );
      const companyResponse = await apiClient.get(
        "/company-properties"
      );
      setCompanyProperties(companyResponse.data.data || []);

      // Fetch private properties
      // const privateResponse = await axios.get(
      //   "http://localhost:3000/api/private-properties"
      // );
      const privateResponse = await apiClient.get(
        "/private-properties"
      );
      setPrivateProperties(privateResponse.data.data || []);

      router.refresh();
    } catch (err) {
      console.error("Error fetching properties:", err);
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
    let temp = [...activeProperties];

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

  const handleFilterButtonClick = (filterType) => {
    setActiveFilter(filterType);
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
              <h1 className="text-xl md:text-2xl font-bold roboto"></h1>
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
                transition={{
                  duration: 1,
                  repeat: isRefreshing ? Infinity : 0,
                }}
              >
                <LuRefreshCw />
              </motion.span>
              Refresh
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="px-4 py-2.5 cursor-pointer transition-all duration-300 bg-primary text-white rounded-lg shadow flex justify-center items-center"
                href={`/${userData.companyName?.replace(
                  /\s+/g,
                  "-"
                )}/dealer-panel/add-new-property`}
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
          <div className="flex flex-col flex-wrap gap-2 mb-4 w-full h-fit justify-center items-center">
            <h2 className="text-base md:text-lg font-semibold mb-2">
              Filter by Property Type
            </h2>

            <div className="w-fit h-fit flex gap-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleFilterButtonClick("all")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                All Properties (
                {userProperties.length +
                  companyProperties.length +
                  privateProperties.length}
                )
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleFilterButtonClick("company")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeFilter === "company"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Company Properties ({companyProperties.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleFilterButtonClick("private")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeFilter === "private"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Private Properties ({privateProperties.length})
              </motion.button>
            </div>
          </div>

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
                      <option value="">
                        {key === "purpose" ? "Purpose" : "Sort By"}
                      </option>
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
          activeFilter={activeFilter}
          companyName={userData.companyName}
        />
      </div>
    </motion.div>
  );
}
