"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
  ),
});

const PropertySearchFilter = ({ onFilter }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="w-full max-w-full mx-auto px-4 py-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="mb-4 flex flex-col gap-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Keyword Search</h2>
        <div className="w-full h-fit flex justify-between">
          <div className="w-fit h-fit flex gap-x-3 items-center">
            <div className="w-fit h-fit flex gap-x-3 rounded-lg border border-black px-4 py-2">
              <CiSearch className="text-2xl text-gray-500" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
                placeholder="Search by description etc."
                className="w-[700px] h-fit outline-none"
              />
            </div>
            <button 
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-[#3B404C] hover:bg-gray-500 transition-all duration-300 text-white rounded-lg cursor-pointer"
            >
              Search
            </button>
          </div>
          <div className="w-fit h-fit flex items-center gap-x-3">
            <button
              onClick={clearFilters}
              type="button"
              className="px-8 py-2.5 bg-[#3B404C] hover:bg-gray-500 transition-all duration-300 text-white rounded-lg cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Purpose */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Purpose</h3>
            <Select
              options={purposeOptions}
              value={
                purposeOptions.find((opt) => opt.value === filters.purpose) ||
                null
              }
              onChange={(selected) =>
                handleChange("purpose", selected?.value || "")
              }
              styles={customStyles}
              placeholder="Select"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Category</h3>
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
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">City</h3>
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
            />
          </div>

          {/* Beds */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Beds</h3>
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
            />
          </div>

          {/* Baths */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Baths</h3>
            <Select
              options={bathsOptions}
              value={
                bathsOptions.find((opt) => opt.value === filters.baths) || null
              }
              onChange={(selected) =>
                handleChange("baths", selected?.value || "")
              }
              styles={customStyles}
              placeholder="Select"
            />
          </div>

          {/* Area */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Area</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={filters.areaMin}
                onChange={(e) => handleChange("areaMin", e.target.value)}
                placeholder="Min Area (Maria)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={filters.areaMax}
                onChange={(e) => handleChange("areaMax", e.target.value)}
                placeholder="Max Area (Maria)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Price (PKR)</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={filters.priceMin}
                onChange={(e) => handleChange("priceMin", e.target.value)}
                placeholder="Min Price (e.g. 10 lbs)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={filters.priceMax}
                onChange={(e) => handleChange("priceMax", e.target.value)}
                placeholder="Max Price (e.g. 30 lbs)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Location</h3>
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
  );
};

export default PropertySearchFilter;