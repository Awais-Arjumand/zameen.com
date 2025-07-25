"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LocationAndCity from "../components/AddNewItem/LocationAndCity/LocationAndCity";
import AreaAndPrice from "../components/AddNewItem/AreaAndPrice/AreaAndPrice";
import FeatureandAmenities from "../components/AddNewItem/FeatureandAmenities/FeatureandAmenities";
import AdInformation from "../components/AddNewItem/AdInformation/AdInformation";
import PropertyImagesandVideos from "../components/AddNewItem/PropertyImagesandVideos/PropertyImagesandVideos";
import ContactInformation from "../components/AddNewItem/ContactInformation/ContactInformation";
import Link from "next/link";
import { IoChevronBackSharp } from "react-icons/io5";

const Page = () => {
  const router = useRouter();
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
      // ✅ 1. Collect data
      const locationData = locationAndCityRef.current?.getData() || {};
      const areaPriceData = areaAndPriceRef.current?.getData() || {};
      const featuresData = featureAndAmenitiesRef.current?.getData() || {};
      const adInfoData = adInformationRef.current?.getData() || {};
      const contactData = contactInformationRef.current?.getData() || {};
      const mediaData = propertyImagesAndVideosRef.current?.getData() || {};

      // ✅ 2. Validate required fields
      const errors = [];
      if (!adInfoData.category) errors.push("Category is required");
      if (!adInfoData.buyOrRent) errors.push("Buy/Rent selection is required");
      if (!locationData.city) errors.push("City is required");
      if (!locationData.location) errors.push("Location is required");
      if (!areaPriceData.area) errors.push("Area is required");
      if (!areaPriceData.minPrice) errors.push("Minimum price is required");
      if (!areaPriceData.maxPrice) errors.push("Maximum price is required");
      if (errors.length > 0) throw new Error(errors.join("\n"));
      if (!contactData.name) {
        errors.push("Dealer full name is required");
      } else {
        const nameParts = contactData.name.trim().split(/\s+/);
        if (nameParts.length < 2) {
          errors.push("Dealer full name must include first and last name");
        }
      }
      if (errors.length > 0) throw new Error(errors.join("\n"));

      // ✅ 3. Prepare main data
      const formData = {
        city: locationData.city,
        location: locationData.location,
        Area: areaPriceData.area,
        areaUnit: areaPriceData.areaUnit,
        TotalArea: areaPriceData.totalArea || areaPriceData.area,
        minPrice: areaPriceData.minPrice,
        maxPrice: areaPriceData.maxPrice,
        priceUnit: areaPriceData.priceUnit,
        beds: Number(featuresData.bedrooms) || 0,
        Bath: Number(featuresData.bathrooms) || 0,
        category: adInfoData.category,
        buyOrRent: adInfoData.buyOrRent,
        description: adInfoData.description || "",
        propertyDealerEmail: contactData.email,
        Phone: contactData.phone,
        propertyDealerName: contactData.name
      };

      console.log("✅ Final Form Data:", formData);

      // ✅ 4. Check for duplicates

      // ✅ 5. Prepare FormData for files
      const apiFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(key, value);
      });

      if (mediaData.images?.length > 0) {
        mediaData.images.forEach((img) => apiFormData.append("images", img));
      }
      if (mediaData.video) {
        apiFormData.append("video", mediaData.video);
      }

      // ✅ 6. Send POST request
      const response = await axios.post(
        "http://localhost:3000/api/user",
        apiFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        alert("✅ Property submitted successfully!");
        router.push("/dealer-panel"); // Redirect to dealer panel
      } else {
        throw new Error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Submission Error:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col roboto gap-y-8 px-20 py-10 bg-[#f6f7fb] ">
      <Link href={"/dealer-panel"} className="flex items-center gap-x-2">
        <IoChevronBackSharp />
        Back to Dealer Panel
      </Link>
      <LocationAndCity ref={locationAndCityRef} />
      <AreaAndPrice ref={areaAndPriceRef} />
      <FeatureandAmenities ref={featureAndAmenitiesRef} />
      <AdInformation ref={adInformationRef} />
      <PropertyImagesandVideos ref={propertyImagesAndVideosRef} />
      <ContactInformation ref={contactInformationRef} />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`px-5 py-2 text-base font-medium transition-all duration-300 text-white flex justify-center items-center rounded-lg cursor-pointer self-end ${
          isSubmitting ? "bg-gray-500" : "bg-[#1CC323] hover:bg-green-700"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Page;
