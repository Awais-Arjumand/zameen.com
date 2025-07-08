"use client";
import React, { useState, useMemo } from "react";

const getLocationCounts = (houseData) => {
  const counts = {};
  houseData.forEach((item) => {
    if (!counts[item.location]) {
      counts[item.location] = 0;
    }
    counts[item.location]++;
  });

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

const HomeDetails = ({ houseData, filters, clearFilters }) => {
  const [activeTab, setActiveTab] = useState("all");

  const locationCounts = useMemo(() => getLocationCounts(houseData), [houseData]);

  const filteredLocationCounts = useMemo(() => {
    if (!filters?.location) return locationCounts;
    return locationCounts.filter(loc => 
      loc.name.toLowerCase().includes(filters.location.toLowerCase())
    );
  }, [locationCounts, filters]);

  return (
    <div className="w-full h-fit px-5 pt-5 pb-10 border border-gray-300 rounded-lg">
      <div className="flex gap-x-4 mb-6 border-b pb-2">
        <h1
          className={`text-xl font-semibold cursor-pointer ${
            activeTab === "all" ? "text-blue-600 underline" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("all")}
        >
          {filters ? "Filtered Homes" : "All Homes"} 
          <span className="text-sm">({filteredLocationCounts.length})</span>
        </h1>
        {filters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm cursor-pointer text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredLocationCounts.map((area, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border"
          >
            <span className="text-gray-800 font-medium">{area.name}</span>
            <span className="text-sm text-gray-600">({area.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeDetails;