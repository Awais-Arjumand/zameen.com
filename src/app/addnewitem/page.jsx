"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+
import LocationAndCity from "../components/AddNewItem/LocationAndCity/LocationAndCity";
import AreaAndPrice from "../components/AddNewItem/AreaAndPrice/AreaAndPrice";
import FeatureandAmenities from "../components/AddNewItem/FeatureandAmenities/FeatureandAmenities";
import AdInformation from "../components/AddNewItem/AdInformation/AdInformation";
import PropertyImagesandVideos from "../components/AddNewItem/PropertyImagesandVideos/PropertyImagesandVideos";
import ContactInformation from "../components/AddNewItem/ContactInformation/ContactInformation";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user } = useUser();
  const router = useRouter(); // Initialize the router
  const locationAndCityRef = useRef(null);
  const areaAndPriceRef = useRef(null);
  const featureAndAmenitiesRef = useRef(null);
  const adInformationRef = useRef(null);
  const propertyImagesAndVideosRef = useRef(null);
  const contactInformationRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get data from all components
      const locationData = locationAndCityRef.current?.getData() || {};
      const areaPriceData = areaAndPriceRef.current?.getData() || {};
      const featuresData = featureAndAmenitiesRef.current?.getData() || {};
      const adInfoData = adInformationRef.current?.getData() || {};
      const contactData = contactInformationRef.current?.getData() || {};
      const mediaData = propertyImagesAndVideosRef.current?.getData() || {};

      // Console log all selected values for debugging
      console.log("Location Data:", locationData);
      console.log("Area & Price Data:", areaPriceData);
      console.log("Features Data:", featuresData);
      console.log("Ad Info Data:", adInfoData);
      console.log("Contact Data:", contactData);
      console.log("Media Data:", mediaData);

      // Validate required fields
      const errors = [];
      if (!adInfoData.category) errors.push("Category is required");
      if (!adInfoData.buyOrRent) errors.push("Buy/Rent selection is required");
      if (!locationData.city) errors.push("City is required");
      if (!locationData.location) errors.push("Location is required");
      if (!areaPriceData.area) errors.push("Area is required");
      if (!areaPriceData.price) errors.push("Price is required");

      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }

      // Prepare form data (✅ FIXED KEY for email)
      const formData = {
        city: locationData.city,
        location: locationData.location,
        Area: areaPriceData.area,
        areaUnit: areaPriceData.areaUnit, // Add area unit
        TotalArea: areaPriceData.totalArea || areaPriceData.area,
        price: Number(areaPriceData.price),
        priceUnit: areaPriceData.priceUnit, // Add price unit
        beds: Number(featuresData.bedrooms) || 0,
        Bath: Number(featuresData.bathrooms) || 0,
        category: adInfoData.category,
        buyOrRent: adInfoData.buyOrRent,
        description: adInfoData.description || "",
        propertyDealerEmail: contactData.email, // ✅ FIXED KEY HERE
        propertyDealerName: `${(user?.firstName || "") + " " + (user?.lastName || "")}`.trim(),
      };

      // Log final form data and media for verification
      console.log("Final Form Data:", formData);
      console.log("Media Data (images/videos):", mediaData);

      // Create FormData for multipart upload
      const apiFormData = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          apiFormData.append(key, value);
        }
      });

      // Append images
      if (mediaData.images?.length > 0) {
        mediaData.images.forEach((image) => {
          apiFormData.append("images", image);
        });
      }

      // Append video
      if (mediaData.video) {
        apiFormData.append("video", mediaData.video);
      }

      // Send to backend
      const response = await axios.post(
        "http://localhost:3000/api/user",
        apiFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Property submitted successfully!");
        router.push("/admin"); // Or your actual admin route
      } else {
        throw new Error(response.data.message || "Failed to create property");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-8 px-32 py-10 bg-[#f6f7fb] border border-black">
      <LocationAndCity ref={locationAndCityRef} />
      <AreaAndPrice ref={areaAndPriceRef} />
      <FeatureandAmenities ref={featureAndAmenitiesRef} />
      <AdInformation ref={adInformationRef} />
      <PropertyImagesandVideos ref={propertyImagesAndVideosRef} />
      <ContactInformation ref={contactInformationRef} />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`px-4 py-2 text-lg font-semibold transition-all duration-300 text-white flex justify-center items-center rounded-lg cursor-pointer self-end ${
          isSubmitting ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Page;
