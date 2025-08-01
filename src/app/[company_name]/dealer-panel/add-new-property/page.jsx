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
import { motion, AnimatePresence } from "framer-motion";
import NewCompanyNavbar from "../../../components/NewCompanyNavbar/NewCompanyNavbar";
import apiClient from "../../../../../src/service/apiClient";

const formatPhoneForSubmission = (phone, countryCode = "PK") => {
  if (!phone) return "";
  if (countryCode !== "PK") return phone;

  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return `+92${cleaned.substring(1)}`;
  } else if (cleaned.startsWith("92")) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith("3")) {
    return `+92${cleaned}`;
  }
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
};

const Page = () => {
  const { data: session } = useSession();
  const companyName =
    session?.user?.companyName?.replace(/\s+/g, "-") || "default-company";

  const router = useRouter();
  const locationAndCityRef = useRef(null);
  const areaAndPriceRef = useRef(null);
  const featureAndAmenitiesRef = useRef(null);
  const adInformationRef = useRef(null);
  const propertyImagesAndVideosRef = useRef(null);
  const contactInformationRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyType, setCompanyType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleCompanyTypeChange = (type) => {
    setCompanyType(type);
    setShowForm(true);
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
      if (!companyType) errors.push("Property type is required");

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
        phone: formatPhoneForSubmission(
          contactData.phone,
          contactData.landlineCountry
        ),
        propertyDealerName: contactData.name,
        senderName: session?.user?.name,
        status: companyType.value,
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

      let apiEndpoint;
      switch (companyType.value) {
        case "company-website":
          // apiEndpoint = "http://localhost:3000/api/company-properties";
          apiEndpoint = "/company-properties";
          break;
        case "private":
          // apiEndpoint = "http://localhost:3000/api/private-properties";
          apiEndpoint = "/private-properties";
          break;
        default:
          // apiEndpoint = "http://localhost:3000/api/user";
          apiEndpoint = "/user";
      }

      const response = await apiClient.post(apiEndpoint, apiFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <NewCompanyNavbar />
      <div className="w-full h-fit flex flex-col roboto gap-y-8 px-4 md:px-20 py-10 mt-16 bg-[#f6f7fb]">
        <Link
          href={`/${companyName}/dealer-panel`}
          className="flex items-center gap-x-2 text-primary hover:text-primary-dark transition-colors"
        >
          <IoChevronBackSharp className="text-lg" />
          <span className="text-base font-medium">Back to Dealer Panel</span>
        </Link>
        <div className="w-full h-fit flex flex-col justify-center items-center gap-y-3">
          <h2 className="text-xl font-semibold text-gray-800">
            🏷️ Select Listing Type
          </h2>
          <motion.div
            className="flex flex-wrap gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.button
              onClick={() =>
                handleCompanyTypeChange({ value: "public", label: "Public" })
              }
              className={`px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                companyType?.value === "public"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary"
              }`}
              variants={itemVariants}
            >
              Public
            </motion.button>

            <motion.button
              onClick={() =>
                handleCompanyTypeChange({
                  value: "company-website",
                  label: "Company Website",
                })
              }
              className={`px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                companyType?.value === "company-website"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary"
              }`}
              variants={itemVariants}
            >
              Company-Website
            </motion.button>
            <motion.button
              onClick={() =>
                handleCompanyTypeChange({ value: "private", label: "Private" })
              }
              className={`px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                companyType?.value === "private"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary"
              }`}
              variants={itemVariants}
            >
              Private
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <LocationAndCity ref={locationAndCityRef} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AreaAndPrice ref={areaAndPriceRef} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <FeatureandAmenities ref={featureAndAmenitiesRef} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AdInformation ref={adInformationRef} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <PropertyImagesandVideos ref={propertyImagesAndVideosRef} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ContactInformation ref={contactInformationRef} />
                </motion.div>
              </motion.div>

              <motion.div
                className="w-full flex justify-end mt-8"
                variants={itemVariants}
              >
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-5 py-2 text-base font-medium transition-all duration-300 text-white flex justify-center items-center rounded-lg ${
                    isSubmitting
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Page;