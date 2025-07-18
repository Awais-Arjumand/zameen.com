"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import DealerPropertyTable from "../components/DealerPropertyTable/DealerPropertyTable";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function DealerPanel() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchDealerProperties();
    }
  }, [isLoaded, isSignedIn, user]);
  
  // Function to refresh properties
  const refreshProperties = () => {
    if (isLoaded && isSignedIn && user) {
      fetchDealerProperties();
    }
  };

const fetchDealerProperties = async () => {
  try {
    setLoading(true);

    const fullName = `${user.firstName} ${user.lastName}`.trim();

   const response = await axios.get(
  `http://localhost:3000/api/user?senderName=${encodeURIComponent(fullName)}`
);


    setProperties(response.data.data || []);
    router.refresh(); // Refresh the page to update UI
  } catch (err) {
    console.error("Error fetching dealer properties:", err);
    setError("Failed to load properties. Please try again later.");
  } finally {
    setLoading(false);
  }
};



  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold">
          Please sign in to access dealer panel
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold">Loading properties...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-y-6">
        <div className="w-full h-fit flex justify-between items-center">

          <Link 
          className="px-4 py-2 cursor-pointer self-end bg-blue-600 hover:bg-blue-700 text-white rounded shadow flex gap-x-4 items-center" 
          href="/"
        >
          <IoIosArrowRoundBack className="text-2xl"/>

        <span> Go Back To Home Page !</span>
        </Link>

          <Link 
          className="px-4 py-2 cursor-pointer self-end bg-blue-600 hover:bg-blue-700 text-white rounded shadow" 
          href="/addnewitem"
        >
          Add New Property
        </Link>
        </div>
        <div className="w-full h-fit flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-6">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={refreshProperties}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <h1 className="text-lg font-bold mb-6">
              Total Properties: {properties.length}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <DealerPropertyTable 
            properties={properties} 
            onDelete={refreshProperties} 
          />
        </div>
      </div>
    </div>
  );
}
