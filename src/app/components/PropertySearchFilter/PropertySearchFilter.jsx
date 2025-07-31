"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { useSession } from "next-auth/react";
import axios from "axios";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
  ),
});

const PropertySearchFilter = ({ onFilter }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUserByPhone = async () => {
      if (session?.user?.phone) {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/users/${encodeURIComponent(session.user.phone)}`
          );
          // console.log("📦 User fetched by phone:", res.data.data);
          setUser(res.data.data);
          // console.log(user.logoColor);
          
        } catch (error) {
          console.error("❌ Error fetching user by phone:", error.message);
        }
      }
    };

    fetchUserByPhone();
  }, [session]);
  const [filters, setFilters] = useState({
    purpose: searchParams.get("purpose") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    beds: searchParams.get("beds") || "",
    baths: searchParams.get("baths") || "",
    areaMin: searchParams.get("areaMin") || "",
    areaMax: searchParams.get("areaMax") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    location: searchParams.get("location") || "",
    keyword: searchParams.get("keyword") || "",
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (searchParams.toString()) {
      onFilter(filters);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.purpose) params.set("purpose", filters.purpose);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.beds) params.set("beds", filters.beds);
    if (filters.baths) params.set("baths", filters.baths);
    if (filters.areaMin) params.set("areaMin", filters.areaMin);
    if (filters.areaMax) params.set("areaMax", filters.areaMax);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.location) params.set("location", filters.location);
    if (filters.keyword) params.set("keyword", filters.keyword);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const purposeOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
  ];

  const categoryOptions = [
    { value: "House", label: "House" },
    { value: "Plot", label: "Plot" },
    { value: "Villa", label: "Villa" },
    { value: "Apartment", label: "Apartment" },
  ];

  const cityOptions = [
    { value: "Karachi", label: "Karachi" },
    { value: "Lahore", label: "Lahore" },
    { value: "Islamabad", label: "Islamabad" },
    { value: "Faisalabad", label: "Faisalabad" },
    { value: "Rawalpindi", label: "Rawalpindi" },
  ];

  const bedsOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6+", label: "6" },
    { value: "7", label: "7" },
    { value: "48+", label: "8" },
  ];

  const bathsOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6+", label: "6" },
    { value: "7", label: "7" },
    { value: "48+", label: "8" },
  ];

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const clearFilters = () => {
    setFilters({
      purpose: "",
      category: "",
      city: "",
      beds: "",
      baths: "",
      areaMin: "",
      areaMax: "",
      priceMin: "",
      priceMax: "",
      location: "",
      keyword: "",
    });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
      borderRadius: "4px",
      border: "1px solid #e2e8f0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e0",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided) => ({ ...provided, padding: "4px" }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#f0f9ff" : "white",
      color: state.isSelected ? "#0c4a6e" : "#4a5568",
      "&:hover": {
        backgroundColor: "#f0f9ff",
        color: "#0c4a6e",
      },
    }),
  };

  if (!isClient) return <div className="text-white">Loading...</div>;

  return (
    <div className="w-full mx-auto px-4 py-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="mb-6">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
            <CiSearch className="text-xl text-gray-500" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleChange("keyword", e.target.value)}
              placeholder="Search"
              className="w-full outline-none bg-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSubmit}
              className={`px-4 py-2 bg-primary hover:bg-gray-600 transition-all cursor-pointer duration-300 text-white rounded-lg`}
            >
              Search
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary hover:hover:bg-gray-600 cursor-pointer transition-all duration-300 text-white rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange("purpose", "Buy")}
                    className={`px-4 py-2 rounded-lg ${filters.purpose === "Buy" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("purpose", "Rent")}
                    className={`px-4 py-2 rounded-lg ${filters.purpose === "Rent" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    Rent
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select
                  options={categoryOptions}
                  value={
                    categoryOptions.find((opt) => opt.value === filters.category) ||
                    null
                  }
                  onChange={(selected) =>
                    handleChange("category", selected?.value || "")
                  }
                  styles={customStyles}
                  placeholder="Select"
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Select
                  options={cityOptions}
                  value={
                    cityOptions.find((opt) => opt.value === filters.city) || null
                  }
                  onChange={(selected) =>
                    handleChange("city", selected?.value || "")
                  }
                  styles={customStyles}
                  placeholder="Select"
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              {/* Beds */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                <Select
                  options={bedsOptions}
                  value={
                    bedsOptions.find((opt) => opt.value === filters.beds) || null
                  }
                  onChange={(selected) =>
                    handleChange("beds", selected?.value || "")
                  }
                  styles={customStyles}
                  placeholder="Select"
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={filters.priceMin}
                    onChange={(e) => handleChange("priceMin", e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={filters.priceMax}
                    onChange={(e) => handleChange("priceMax", e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={filters.areaMin}
                    onChange={(e) => handleChange("areaMin", e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={filters.areaMax}
                    onChange={(e) => handleChange("areaMax", e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Enter Location (e.g. Julian Town)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertySearchFilter;