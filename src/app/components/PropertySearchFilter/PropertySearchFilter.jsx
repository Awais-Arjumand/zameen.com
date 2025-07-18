"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

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
    location: searchParams.get("location") || "",
    areaMin: searchParams.get("areaMin") || "",
    areaMax: searchParams.get("areaMax") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    beds: searchParams.get("beds") || "All",
    baths: searchParams.get("baths") || "All",
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
    if (filters.location) params.set("location", filters.location);
    if (filters.areaMin) params.set("areaMin", filters.areaMin);
    if (filters.areaMax) params.set("areaMax", filters.areaMax);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.beds) params.set("beds", filters.beds);
    if (filters.baths) params.set("baths", filters.baths);
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
    { value: "Farmhouse", label: "Farmhouse" },
    { value: "Commercial", label: "Commercial" },
  ];

  const cityOptions = [
    { value: "Islamabad", label: "Islamabad" },
    { value: "Rawalpindi", label: "Rawalpindi" },
    { value: "Lahore", label: "Lahore" },
    { value: "Karachi", label: "Karachi" },
    { value: "Peshawar", label: "Peshawar" },
  ];

  const bedsOptions = [
    { value: "All", label: "All" },
    { value: "1", label: "1 Bed" },
    { value: "2", label: "2 Beds" },
    { value: "3", label: "3 Beds" },
    { value: "4", label: "4 Beds" },
    { value: "5", label: "5 Beds" },
    { value: "6", label: "6 Beds" },
    { value: "7", label: "7 Beds" },
    { value: "8", label: "8 Beds" },
    { value: "9", label: "9 Beds" },
    { value: "10", label: "10 Beds" },
  ];

  const bathsOptions = [
    { value: "All", label: "All" },
    { value: "1", label: "1 Bath" },
    { value: "2", label: "2 Baths" },
    { value: "3", label: "3 Baths" },
    { value: "4", label: "4 Baths" },
    { value: "5", label: "5 Baths" },
    { value: "6", label: "6 Baths" },
    { value: "7", label: "7 Baths" },
    { value: "8", label: "8 Baths" },
    { value: "9", label: "9 Baths" },
    { value: "10", label: "10 Baths" },
  ];

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
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
    <div className="w-full max-w-6xl mx-auto px-4 py-6 bg-white rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
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
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
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
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Select
              options={cityOptions}
              value={
                cityOptions.find((opt) => opt.value === filters.city) || null
              }
              onChange={(selected) =>
                handleChange("city", selected?.value || "")
              }
              styles={customStyles}
              isSearchable={false}
            />
          </div>

          {/* Beds */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beds
            </label>
            <Select
              options={bedsOptions}
              value={
                bedsOptions.find((opt) => opt.value === filters.beds) || null
              }
              onChange={(selected) =>
                handleChange("beds", selected?.value || "")
              }
              styles={customStyles}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Baths */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baths
            </label>
            <Select
              options={bathsOptions}
              value={
                bathsOptions.find((opt) => opt.value === filters.baths) || null
              }
              onChange={(selected) =>
                handleChange("baths", selected?.value || "")
              }
              styles={customStyles}
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={filters.areaMin}
                onChange={(e) => handleChange("areaMin", e.target.value)}
                placeholder="Min (e.g., 5 Marla)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={filters.areaMax}
                onChange={(e) => handleChange("areaMax", e.target.value)}
                placeholder="Max (e.g., 10 Marla)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (PKR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={filters.priceMin}
                onChange={(e) => handleChange("priceMin", e.target.value)}
                placeholder="Min (e.g., 10 Lakh)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={filters.priceMax}
                onChange={(e) => handleChange("priceMax", e.target.value)}
                placeholder="Max (e.g., 20 Lakh)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter location (e.g., Model Town)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Keyword */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keyword Search
            </label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleChange("keyword", e.target.value)}
              placeholder="Search by description, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearchFilter;
