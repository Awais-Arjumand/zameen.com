"use client";

import { useState, useEffect, useCallback } from "react";
import PropertySearchFilter from "./components/PropertySearchFilter/PropertySearchFilter";
import HousesBoxes from "./components/HousesBoxes/HousesBoxes";
import Loader from "./components/Loader/Loader";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const BACKEND_URL = "http://localhost:3000";

const mapAPIData = (apiData) => {
  return apiData.map((item) => {
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
      price: item.maxPrice || item.minPrice || "Unmentioned",
      beds: item.beds,
      Bath: item.Bath,
      location: item.location,
      Area: item.Area,
      TotalArea: item.TotalArea,
      areaUnit: item.areaUnit,
      description: item.description,
      city: item.city,
      buyOrRent: item.buyOrRent,
      category: item.category,
      propertyDealerName: item.propertyDealerName,
      createdAt: item.createdAt,
      phone: item.phone
    };
  });
};

const applyFilters = (data, filterValues) => {
  return data.filter((property) => {
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

    // Category filter
    if (
      filterValues.category &&
      property.category?.toLowerCase() !== filterValues.category.toLowerCase()
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
    if (filterValues.beds && filterValues.beds !== "All") {
      const bedsValue = parseInt(filterValues.beds);
      const propertyBeds = parseInt(property.beds);
      
      if (filterValues.beds.endsWith("+")) {
        if (propertyBeds < bedsValue) return false;
      } else if (propertyBeds !== bedsValue) {
        return false;
      }
    }

    // Baths filter
    if (filterValues.baths && filterValues.baths !== "All") {
      const bathsValue = parseInt(filterValues.baths);
      const propertyBaths = parseInt(property.Bath);
      
      if (filterValues.baths.endsWith("+")) {
        if (propertyBaths < bathsValue) return false;
      } else if (propertyBaths !== bathsValue) {
        return false;
      }
    }

    // Area filter
    if (filterValues.areaMin || filterValues.areaMax) {
      const propertyArea = parseFloat(property.Area);
      const isKanal = property.areaUnit === "Kanal";
      const areaInMarla = isKanal ? propertyArea * 20 : propertyArea;

      if (filterValues.areaMin) {
        const minArea = parseFloat(filterValues.areaMin);
        if (areaInMarla < minArea) return false;
      }

      if (filterValues.areaMax && filterValues.areaMax !== "Any") {
        const maxArea = parseFloat(filterValues.areaMax);
        if (areaInMarla > maxArea) return false;
      }
    }

    // Price filter
    if (filterValues.priceMin || filterValues.priceMax) {
      const propertyPrice = parseFloat(property.price);

      if (filterValues.priceMin) {
        const minPrice = parseFloat(filterValues.priceMin);
        if (propertyPrice < minPrice) return false;
      }

      if (filterValues.priceMax && filterValues.priceMax !== "Any") {
        const maxPrice = parseFloat(filterValues.priceMax);
        if (propertyPrice > maxPrice) return false;
      }
    }

    // Keyword search
    if (filterValues.keyword) {
      const keyword = filterValues.keyword.toLowerCase();
      if (
        !property.description?.toLowerCase().includes(keyword) &&
        !property.location?.toLowerCase().includes(keyword) &&
        !property.city?.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }

    return true;
  });
};

export default function Home() {
  const [houseData, setHouseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/user`);
      const apiData = response.data.data;
      const mapped = mapAPIData(apiData);
      setHouseData(mapped);
      return mapped;
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchDataAndApplyFilters = async () => {
      const data = await fetchProperties();
      
      if (searchParams.toString()) {
        const urlFilters = {
          purpose: searchParams.get("purpose") || "",
          category: searchParams.get("category") || "",
          city: searchParams.get("city") || "",
          location: searchParams.get("location") || "",
          areaMin: searchParams.get("areaMin") || "",
          areaMax: searchParams.get("areaMax") || "",
          priceMin: searchParams.get("priceMin") || "",
          priceMax: searchParams.get("priceMax") || "",
          beds: searchParams.get("beds") || "",
          baths: searchParams.get("baths") || "",
          keyword: searchParams.get("keyword") || "",
        };

        const filtered = applyFilters(data, urlFilters);
        setFilteredData(filtered);
      } else {
        setFilteredData(data);
      }
    };

    fetchDataAndApplyFilters();
  }, [fetchProperties, searchParams]);

  const handleFilter = (filterValues) => {
    const filtered = applyFilters(houseData, filterValues);
    setFilteredData(filtered);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-fit bg-[#fafafa] py-10 px-10 mt-16 flex flex-col gap-y-8">
      <PropertySearchFilter onFilter={handleFilter} />
      <HousesBoxes houseData={filteredData} />
    </div>
  );
}