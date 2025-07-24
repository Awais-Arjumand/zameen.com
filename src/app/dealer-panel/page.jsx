"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import DealerPropertyTable from "../components/DealerPropertyTable/DealerPropertyTable";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LuRefreshCw } from "react-icons/lu";

export default function DealerPanel() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState({ firstName: "", lastName: "" });
  const [filters, setFilters] = useState({
    location: "",
    city: "",
    category: "",
    purpose: "",
    dealerName: "",
    sortBy: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      if (status === "authenticated" && session?.user?.phone) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users?phone=${encodeURIComponent(
              session.user.phone
            )}`
          );
          if (response.data && response.data.firstName) {
            setUserName({
              firstName: response.data.firstName,
              lastName: response.data.lastName,
            });
          }
        } catch (err) {
          // fallback to empty name
        }
      }
    };
    fetchUserName();
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchDealerProperties();
    }
  }, [status, session]);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const refreshProperties = () => {
    if (status === "authenticated" && session?.user) {
      fetchDealerProperties();
    }
  };

  const fetchDealerProperties = async () => {
    try {
      setLoading(true);
      const fullName = `${userName.firstName || ""} ${
        userName.lastName || ""
      }`.trim();
      const response = await axios.get(
        `http://localhost:3000/api/user?senderName=${encodeURIComponent(
          fullName
        )}`
      );
      setProperties(response.data.data || []);
      router.refresh();
    } catch (err) {
      console.error("Error fetching dealer properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      city: "",
      category: "",
      purpose: "",
      dealerName: "",
      sortBy: "",
    });
  };

  const applyFilters = () => {
    let temp = [...properties];

    if (filters.location) {
      temp = temp.filter((p) =>
        p.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.city) {
      temp = temp.filter(
        (p) => p.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }
    if (filters.category) {
      temp = temp.filter(
        (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.purpose) {
      temp = temp.filter(
        (p) => p.buyOrRent?.toLowerCase() === filters.purpose.toLowerCase()
      );
    }
    if (filters.dealerName) {
      temp = temp.filter((p) =>
        p.senderName?.toLowerCase().includes(filters.dealerName.toLowerCase())
      );
    }

    if (filters.sortBy === "priceAsc") {
      temp.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (filters.sortBy === "priceDesc") {
      temp.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    }

    setFilteredProperties(temp);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-xl md:text-3xl font-bold px-4 text-center">
          Please sign in to access dealer panel
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-xl md:text-3xl font-bold px-4 text-center">
          Loading properties...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-xl md:text-3xl font-bold text-red-500 px-4 text-center">
          {error}
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8 roboto">
      <div className="max-w-full mx-auto flex flex-col gap-y-4 md:gap-y-6">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-fit flex flex-col gap-y-2 md:gap-y-4">
            <Link
              className="cursor-pointer bg-transparent flex gap-x-3 items-center text-sm md:text-base"
              href="/"
            >
              <IoIosArrowRoundBack className="text-xl" />
              <span>Back to Properties</span>
            </Link>
            <div className="w-full md:w-fit flex flex-col gap-y-1 md:gap-y-3">
              <h1 className="text-xl md:text-2xl font-bold roboto">
                Property list
              </h1>
              <h1 className="text-sm md:text-base font-mono roboto">
                Welcome to Dealer Panel
              </h1>
            </div>
          </div>
          <div className="w-full md:w-fit flex flex-col sm:flex-row gap-3">
            <button
              onClick={refreshProperties}
              className="px-4 py-2 border border-black items-center rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300 flex gap-x-3 justify-center"
            >
              <LuRefreshCw />
              Refresh
            </button>

            <Link
              className="px-4 py-2.5 cursor-pointer transition-all duration-300 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow flex justify-center items-center"
              href="/addnewitem"
            >
              + Add New Property
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-y-4">
          <div className="w-full h-fit flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-base md:text-lg font-bold roboto">
              Filters & Sorting
            </h1>
            <button
              onClick={clearFilters}
              className="px-4 py-2 sm:px-5 sm:py-3 text-sm font-normal text-white cursor-pointer bg-[#3B404C] hover:bg-gray-500 rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
            >
              Clear All Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 outline-none rounded px-3 py-2 text-sm md:text-base"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 outline-none rounded px-3 py-3 text-sm md:text-base"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 outline-none rounded px-3 py-2 text-sm md:text-base"
            />

            <div className="w-full h-fit pr-2 border border-gray-300 rounded">
              <select
                name="purpose"
                value={filters.purpose}
                onChange={handleFilterChange}
                className="w-full outline-none px-3 py-3 placeholder:text-gray-300 text-sm md:text-base"
              >
                <option value="">Purpose</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <input
              type="text"
              name="dealerName"
              placeholder="Property Dealer Name"
              value={filters.dealerName}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 outline-none rounded px-3 py-2 text-sm md:text-base"
            />

            <div className="w-full h-fit pr-2 border border-gray-300 rounded">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full rounded px-3 py-3 outline-none text-sm md:text-base"
              >
                <option value="">Sort By</option>
                <option value="priceAsc">Price Low to High</option>
                <option value="priceDesc">Price High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <DealerPropertyTable
          properties={filteredProperties}
          onDelete={refreshProperties}
        />
      </div>
    </div>
  );
}