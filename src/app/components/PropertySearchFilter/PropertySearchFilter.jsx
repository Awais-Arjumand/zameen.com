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
    paths: searchParams.get("paths") || "",
    category: searchParams.get("category") || "",
    areaMin: searchParams.get("areaMin") || "",
    areaMax: searchParams.get("areaMax") || "",
    search: searchParams.get("search") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    code: searchParams.get("code") || "",
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
    if (filters.paths) params.set("paths", filters.paths);
    if (filters.category) params.set("category", filters.category);
    if (filters.areaMin) params.set("areaMin", filters.areaMin);
    if (filters.areaMax) params.set("areaMax", filters.areaMax);
    if (filters.search) params.set("search", filters.search);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.code) params.set("code", filters.code);
    if (filters.location) params.set("location", filters.location);
    if (filters.keyword) params.set("keyword", filters.keyword);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const purposeOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
  ];

  const pathsOptions = [
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
  ];

  const categoryOptions = [
    { value: "House", label: "House" },
    { value: "Plot", label: "Plot" },
    { value: "Villa", label: "Villa" },
    { value: "Apartment", label: "Apartment" },
  ];

  const searchOptions = [
    { value: "Latest", label: "Latest" },
    { value: "Popular", label: "Popular" },
    { value: "Featured", label: "Featured" },
  ];

  const codeOptions = [
    { value: "A1", label: "A1" },
    { value: "B2", label: "B2" },
    { value: "C3", label: "C3" },
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
      paths: "",
      category: "",
      areaMin: "",
      areaMax: "",
      search: "",
      priceMin: "",
      priceMax: "",
      code: "",
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
        <div className="w-full h-fit  flex justify-between ">
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
            <button className="px-8 py-2.5 bg-[#3B404C] hover:bg-gray-500 transition-all duration-300 text-white rounded-lg cursor-pointer">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Paths */}
          {/* <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Paths</h3>
            <Select
              options={pathsOptions}
              value={
                pathsOptions.find((opt) => opt.value === filters.paths) || null
              }
              onChange={(selected) =>
                handleChange("paths", selected?.value || "")
              }
              styles={customStyles}
              placeholder="Select"
            />
          </div> */}

          {/* Divider */}
          <div className="hidden lg:block border-l border-gray-200"></div>

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

          {/* Area */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Area</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={filters.areaMin}
                onChange={(e) => handleChange("areaMin", e.target.value)}
                placeholder="Min Area (Math)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={filters.areaMax}
                onChange={(e) => handleChange("areaMax", e.target.value)}
                placeholder="Max Area (Math)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block border-l border-gray-200"></div>

          {/* Search */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Search</h3>
            <Select
              options={searchOptions}
              value={
                searchOptions.find((opt) => opt.value === filters.search) ||
                null
              }
              onChange={(selected) =>
                handleChange("search", selected?.value || "")
              }
              styles={customStyles}
              placeholder="Select"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Price</h3>
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
                placeholder="Max Price (e.g. 50 lbs)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Code */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Code</h3>
            <Select
              options={codeOptions}
              value={
                codeOptions.find((opt) => opt.value === filters.code) || null
              }
              onChange={(selected) =>
                handleChange("code", selected?.value || "")
              }
              styles={customStyles}
              placeholder="Select"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Location</h3>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter Location (e.g., Jxbar Town)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All Filters
          </button>
          <div className="space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Save Search As...
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertySearchFilter;
