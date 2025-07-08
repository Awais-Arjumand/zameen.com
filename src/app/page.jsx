"use client";
import { useState, useEffect } from "react";
import PropertySearchFilter from "./components/PropertySearchFilter/PropertySearchFilter";
import HomeDetails from "./components/HomeDetails/HomeDetails";
import HousesBoxes from "./components/HousesBoxes/HousesBoxes";
import axios from "axios";
const BACKEND_URL = "http://localhost:3000";
const mapAPIData = (apiData) => {
  return apiData.map((item) => {
    // Handle image URL construction
    let imageUrl = "/images/default-property.jpg";
    if (item.image) {
      if (item.image.startsWith("http")) {
        imageUrl = item.image;
      } else if (item.image.startsWith("/uploads/")) {
        imageUrl = `${BACKEND_URL}${item.image}`;
      } else {
        imageUrl = item.image;
      }
    }

    return {
      id: item._id,
      src: imageUrl,
      images: item.images
        ? item.images.map((img) =>
            img.startsWith("http")
              ? img
              : img.startsWith("/uploads/")
              ? `${BACKEND_URL}${img}`
              : img
          )
        : [],
      price: item.price,
      beds: item.beds,
      Bath: item.Bath,
      location: item.location,
      Area: item.Area,
      TotalArea: item.TotalArea,
      areaUnit: item.areaUnit,
      priceUnit: item.priceUnit,
      description: item.description,
      city: item.city,
      buyOrRent: item.buyOrRent,
      category: item.category,
      propertyDealerName: item.propertyDealerName,
      createdAt: item.createdAt,
    };
  });
};

export default function Home() {
  const [houseData, setHouseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/user");
        const apiData = response.data.data;
        const mapped = mapAPIData(apiData);
        setHouseData(mapped);
        setFilteredData(mapped);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAPI();
  }, []);

  const handleFilter = (filterValues) => {
    setFilters(filterValues);

    const filtered = houseData.filter((property) => {
      // Purpose filter
      if (
        filterValues.purpose &&
        property.buyOrRent.toLowerCase() !== filterValues.purpose.toLowerCase()
      ) {
        return false;
      }

      // City filter
      if (
        filterValues.city &&
        property.city.toLowerCase() !== filterValues.city.toLowerCase()
      ) {
        return false;
      }

      // Location filter
      if (
        filterValues.location &&
        !property.location
          .toLowerCase()
          .includes(filterValues.location.toLowerCase())
      ) {
        return false;
      }

      // Beds filter
      if (filterValues.beds !== "All") {
        if (filterValues.beds === "5+" && parseInt(property.beds) < 5) {
          return false;
        } else if (
          filterValues.beds !== "5+" &&
          property.beds !== filterValues.beds
        ) {
          return false;
        }
      }

      // Baths filter
      if (filterValues.baths !== "All") {
        if (filterValues.baths === "5+" && parseInt(property.Bath) < 5) {
          return false;
        } else if (
          filterValues.baths !== "5+" &&
          property.Bath !== filterValues.baths
        ) {
          return false;
        }
      }

      // Area filter
      if (filterValues.areaMin !== "0" || filterValues.areaMax !== "Any") {
        const propertyArea = parseInt(property.Area);
        const isKanal = property.TotalArea === "Kanal";
        const areaInMarla = isKanal ? propertyArea * 20 : propertyArea;

        if (filterValues.areaMin !== "0") {
          const minArea = filterValues.areaMin.endsWith("k")
            ? parseInt(filterValues.areaMin) * 20
            : parseInt(filterValues.areaMin);
          if (areaInMarla < minArea) return false;
        }

        if (filterValues.areaMax !== "Any") {
          const maxArea = filterValues.areaMax.endsWith("k")
            ? parseInt(filterValues.areaMax) * 20
            : parseInt(filterValues.areaMax);
          if (areaInMarla > maxArea) return false;
        }
      }

      // Price filter
      if (filterValues.priceMin !== "0" || filterValues.priceMax !== "Any") {
        const propertyPrice = parseFloat(property.price);

        if (filterValues.priceMin !== "0") {
          const minPrice = parseFloat(filterValues.priceMin);
          if (propertyPrice < minPrice) return false;
        }

        if (filterValues.priceMax !== "Any") {
          const maxPrice = parseFloat(filterValues.priceMax);
          if (propertyPrice > maxPrice) return false;
        }
      }

      // Keyword filter
      if (filterValues.keyword) {
        const keyword = filterValues.keyword.toLowerCase();
        if (
          !property.description.toLowerCase().includes(keyword) &&
          !property.location.toLowerCase().includes(keyword) &&
          !property.city.toLowerCase().includes(keyword)
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setFilters(null);
    setFilteredData(houseData);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit border border-black pt-5 pb-10 px-5 flex flex-col gap-y-8">
      <PropertySearchFilter onFilter={handleFilter} />
      <HomeDetails
        houseData={filters ? filteredData : houseData}
        filters={filters}
        clearFilters={clearFilters}
      />
      <HousesBoxes houseData={filters ? filteredData : houseData} />
    </div>
  );
}
