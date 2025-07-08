"use client";

import { useState, useEffect } from "react";
import PropertyTable from "./PropertyTable";
import AdminHeader from "./AdminHeader";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function AdminPageClient({ apiData = [] }) {
  const { user } = useUser(); // Get Clerk user data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    image: null,
    price: "",
    location: "",
    category: "",
    beds: "",
    Bath: "",
    city: "",
    buyOrRent: "",
    propertyDealerName: "",
    Area: "",
    TotalArea: "",
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

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

  return (
    <div className="p-10 w-full min-h-screen bg-white text-gray-800 overflow-auto">
      <AdminHeader />

      <div className="w-full flex justify-between items-center">
        <h1 className="mb-8 text-2xl font-semibold">
          Welcome, {user?.fullName || user?.email || "Admin"}
        </h1>
        <Link 
          className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded shadow" 
          href="/addnewitem"
        >
          Add New Property
        </Link>
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