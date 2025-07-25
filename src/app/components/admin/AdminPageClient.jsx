"use client";

import { useState, useEffect, useId } from "react";
import PropertyTable from "./PropertyTable";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { motion } from "framer-motion";

export default function AdminPageClient({ apiData = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    city: null,
    category: null,
    purpose: null,
    dealer: "",
    sortBy: null,
  });

  const citySelectId = useId();
  const categorySelectId = useId();
  const purposeSelectId = useId();
  const sortSelectId = useId();

  const router = useRouter();

  const categoryOptions = [
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Villa", label: "Villa" },
    { value: "Plot", label: "Plot" },
    { value: "Commercial", label: "Commercial" },
  ];

  const cityOptions = [
    { value: "Islamabad", label: "Islamabad" },
    { value: "Rawalpindi", label: "Rawalpindi" },
    { value: "Lahore", label: "Lahore" },
    { value: "Karachi", label: "Karachi" },
    { value: "Peshawar", label: "Peshawar" },
  ];

  const purposeOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
  ];

  const sortOptions = [
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" },
  ];

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selected) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selected,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      city: null,
      category: null,
      purpose: null,
      dealer: "",
      sortBy: null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 md:p-8 lg:p-10 w-full min-h-screen roboto bg-[#fafafa] text-gray-800 overflow-auto"
    >
      <div className="w-full flex justify-center items-center mb-4 sm:mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl sm:text-2xl"
        >
          Welcome to Admin Panel 👋✨
        </motion.h1>
      </div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm"
      >
        <div className="w-full h-fit flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
          <h3 className="text-base sm:text-lg font-semibold">
            Filters & Sorting
          </h3>
          <motion.button
            onClick={clearFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-xs sm:text-sm font-normal text-white cursor-pointer bg-[#3B404C] hover:bg-gray-500 rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
          >
            Clear All Filters
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <motion.input
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="Filter by location"
            className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md w-full"
            whileFocus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
          />

          <Select
            instanceId={citySelectId}
            options={cityOptions}
            value={filters.city}
            onChange={(selected) => handleSelectChange("city", selected)}
            placeholder="Select City"
            className="text-xs sm:text-sm"
          />

          <Select
            instanceId={categorySelectId}
            options={categoryOptions}
            value={filters.category}
            onChange={(selected) => handleSelectChange("category", selected)}
            placeholder="Select Category"
            className="text-xs sm:text-sm"
          />

          <Select
            instanceId={purposeSelectId}
            options={purposeOptions}
            value={filters.purpose}
            onChange={(selected) => handleSelectChange("purpose", selected)}
            placeholder="Select Purpose"
            className="text-xs sm:text-sm"
          />

          <motion.input
            name="dealer"
            value={filters.dealer}
            onChange={handleInputChange}
            placeholder="Filter by dealer name"
            className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md w-full"
            whileFocus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
          />

          <Select
            instanceId={sortSelectId}
            options={sortOptions}
            value={filters.sortBy}
            onChange={(selected) => handleSelectChange("sortBy", selected)}
            placeholder="Sort By"
            className="text-xs sm:text-sm"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <PropertyTable apiData={apiData} filters={filters} />
      </motion.div>
    </motion.div>
  );
}