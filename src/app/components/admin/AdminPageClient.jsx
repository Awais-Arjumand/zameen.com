
"use client";

import { useState, useEffect } from "react";
import PropertyTable from "./PropertyTable";
import AdminHeader from "./AdminHeader";
import { useRouter } from "next/navigation";

export default function AdminPageClient({ apiData = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const areaUnitOptions = [
    { value: "Marla", label: "Marla" },
    { value: "Kanal", label: "Kanal" },
    { value: "Square Feet", label: "Square Feet" },
    { value: "Square Yards", label: "Square Yards" },
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

  return (
    <div className="p-10 w-full min-h-screen bg-white text-gray-800 overflow-auto">
      <AdminHeader />

      <div className="w-full flex justify-between items-center">
       <div></div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-300 flex items-center gap-2 ${isRefreshing ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          
          <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Properties Listing</h2>
        <span className="text-gray-500 text-sm">
          Total Properties: {Array.isArray(apiData) ? apiData.length : 0}
        </span>
      </div>

      <PropertyTable 
        apiData={apiData} 
        categoryOptions={categoryOptions}
        cityOptions={cityOptions}
        purposeOptions={purposeOptions}
        areaUnitOptions={areaUnitOptions}
      />
    </div>
  );
}