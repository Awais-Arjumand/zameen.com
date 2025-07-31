"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LocationAndCity from "../../../components/AddNewItem/LocationAndCity/LocationAndCity";
import AreaAndPrice from "../../../components/AddNewItem/AreaAndPrice/AreaAndPrice";
import FeatureandAmenities from "../../../components/AddNewItem/FeatureandAmenities/FeatureandAmenities";
import AdInformation from "../../../components/AddNewItem/AdInformation/AdInformation";
import PropertyImagesandVideos from "../../../components/AddNewItem/PropertyImagesandVideos/PropertyImagesandVideos";
import ContactInformation from "../../../components/AddNewItem/ContactInformation/ContactInformation";
import Link from "next/link";
import { IoChevronBackSharp } from "react-icons/io5";
import Select from 'react-select';

const Page = () => {
  const { data: session } = useSession();
  const companyName = session?.user?.companyName?.replace(/\s+/g, "-") || "default-company";

  const router = useRouter();
  const locationAndCityRef = useRef(null);
  const areaAndPriceRef = useRef(null);
  const featureAndAmenitiesRef = useRef(null);
  const adInformationRef = useRef(null);
  const propertyImagesAndVideosRef = useRef(null);
  const contactInformationRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyType, setCompanyType] = useState(null);

  const companyTypeOptions = [
    { value: 'public', label: 'Public' },
    { value: 'company website', label: 'Company Website' },
    { value: 'private', label: 'Private' }
  ];

  const handleCompanyTypeChange = (selectedOption) => {
    setCompanyType(selectedOption);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const locationData = locationAndCityRef.current?.getData() || {};
      const areaPriceData = areaAndPriceRef.current?.getData() || {};
      const featuresData = featureAndAmenitiesRef.current?.getData() || {};
      const adInfoData = adInformationRef.current?.getData() || {};
      const contactData = contactInformationRef.current?.getData() || {};
      const mediaData = propertyImagesAndVideosRef.current?.getData() || {};

      const errors = [];
      if (!adInfoData.category) errors.push("Category is required");
      if (!adInfoData.buyOrRent) errors.push("Buy/Rent selection is required");
      if (!locationData.city) errors.push("City is required");
      if (!locationData.location) errors.push("Location is required");
      if (!areaPriceData.area) errors.push("Area is required");
      if (!areaPriceData.minPrice) errors.push("Minimum price is required");
      if (!areaPriceData.maxPrice) errors.push("Maximum price is required");
      if (!companyType) errors.push("Company type is required");

      if (!contactData.name) {
        errors.push("Dealer full name is required");
      } else {
        const nameParts = contactData.name.trim().split(/\s+/);
        if (nameParts.length < 2) {
          errors.push("Dealer full name must include first and last name");
        }
      }

      if (errors.length > 0) throw new Error(errors.join("\n"));

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
        propertyDealerName: contactData.name,
        companyType: companyType.value
      };

      console.log("✅ Final Form Data:", formData);

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

      const response = await axios.post(
        "http://localhost:3000/api/user",
        apiFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        alert("✅ Property submitted successfully!");
        router.push(`/${companyName}/dealer-panel`);
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
    <div className="w-full h-fit flex flex-col roboto gap-y-8 px-20 py-10 mt-16 bg-[#f6f7fb]">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Link
          href={`/${companyName}/dealer-panel`}
          className="flex items-center gap-x-2 text-primary hover:text-primary-dark transition-colors"
        >
          <IoChevronBackSharp className="text-lg" />
          <span className="text-base font-medium">Back to Dealer Panel</span>
        </Link>
        
        <div className="w-full sm:w-64">
          <Select
            options={companyTypeOptions}
            value={companyType}
            onChange={handleCompanyTypeChange}
            placeholder="Select company type..."
            className="basic-single"
            classNamePrefix="select"
            isSearchable={false}
            required
          />
        </div>
      </div>

      <div className={`${!companyType ? 'opacity-50 pointer-events-none' : ''}`}>
        <LocationAndCity ref={locationAndCityRef} disabled={!companyType} />
        <AreaAndPrice ref={areaAndPriceRef} disabled={!companyType} />
        <FeatureandAmenities ref={featureAndAmenitiesRef} disabled={!companyType} />
        <AdInformation ref={adInformationRef} disabled={!companyType} />
        <PropertyImagesandVideos ref={propertyImagesAndVideosRef} disabled={!companyType} />
        <ContactInformation ref={contactInformationRef} disabled={!companyType} />
      </div>

      <div className="w-full flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !companyType}
          className={`px-5 py-2 text-base font-medium transition-all duration-300 text-white flex justify-center items-center rounded-lg ${
            isSubmitting || !companyType ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-primary-dark cursor-pointer"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Page;