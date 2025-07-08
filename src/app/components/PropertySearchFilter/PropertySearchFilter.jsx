"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
  ),
});

const PropertySearchFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    purpose: "Buy",
    city: "Islamabad",
    location: "",
    areaMin: "0",
    areaMax: "Any",
    priceMin: "0",
    priceMax: "Any",
    beds: "All",
    baths: "All",
    keyword: "",
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const purposeOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
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
    { value: "5+", label: "5+ Beds" },
  ];

  const bathsOptions = [
    { value: "All", label: "All" },
    { value: "1", label: "1 Bath" },
    { value: "2", label: "2 Baths" },
    { value: "3", label: "3 Baths" },
    { value: "4", label: "4 Baths" },
    { value: "5+", label: "5+ Baths" },
  ];

  const areaOptions = [
    { value: "0", label: "Min" },
    { value: "5", label: "5 Marla" },
    { value: "10", label: "10 Marla" },
    { value: "1k", label: "1 Kanal" },
    { value: "2k", label: "2 Kanal" },
    { value: "Any", label: "Any" },
  ];

  const priceOptions = [
    { value: "0", label: "0" },
    { value: "1000000", label: "1 Million" },
    { value: "5000000", label: "5 Million" },
    { value: "10000000", label: "10 Million" },
    { value: "20000000", label: "20 Million" },
    { value: "Any", label: "Any" },
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
              value={purposeOptions.find(
                (opt) => opt.value === filters.purpose
              )}
              onChange={(selected) => handleChange("purpose", selected.value)}
              styles={customStyles}
              isSearchable={false}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Select
              options={cityOptions}
              value={cityOptions.find((opt) => opt.value === filters.city)}
              onChange={(selected) => handleChange("city", selected.value)}
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
              value={bedsOptions.find((opt) => opt.value === filters.beds)}
              onChange={(selected) => handleChange("beds", selected.value)}
              styles={customStyles}
              isSearchable={false}
            />
          </div>

          {/* Baths */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baths
            </label>
            <Select
              options={bathsOptions}
              value={bathsOptions.find((opt) => opt.value === filters.baths)}
              onChange={(selected) => handleChange("baths", selected.value)}
              styles={customStyles}
              isSearchable={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                options={areaOptions}
                value={areaOptions.find((opt) => opt.value === filters.areaMin)}
                onChange={(selected) => handleChange("areaMin", selected.value)}
                styles={customStyles}
                placeholder="Min"
              />
              <Select
                options={areaOptions}
                value={areaOptions.find((opt) => opt.value === filters.areaMax)}
                onChange={(selected) => handleChange("areaMax", selected.value)}
                styles={customStyles}
                placeholder="Max"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (PKR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                options={priceOptions}
                value={priceOptions.find(
                  (opt) => opt.value === filters.priceMin
                )}
                onChange={(selected) =>
                  handleChange("priceMin", selected.value)
                }
                styles={customStyles}
                placeholder="Min"
              />
              <Select
                options={priceOptions}
                value={priceOptions.find(
                  (opt) => opt.value === filters.priceMax
                )}
                onChange={(selected) =>
                  handleChange("priceMax", selected.value)
                }
                styles={customStyles}
                placeholder="Max"
              />
            </div>
          </div>

          {/* Keyword */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keyword Search
            </label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleChange("keyword", e.target.value)}
              placeholder="Search by location, description, etc."
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
