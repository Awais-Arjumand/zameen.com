"use client";
import Image from "next/image";
import Link from "next/link";
import { FaBed, FaBath } from "react-icons/fa";
import { BsRulers } from "react-icons/bs";
import { useState, useEffect } from "react";
import { CiLocationOn } from "react-icons/ci";
import { motion } from "framer-motion";

const HomeBoxesDetails = ({
  id,
  src,
  price,
  beds,
  Bath,
  location,
  Area,
  TotalArea,
  description,
  city,
  buyOrRent,
  priceUnit,
  areaUnit,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const defaultImg = "/images/default-property.jpg";
  const [imgSrc, setImgSrc] = useState(defaultImg);
  const [isLoading, setIsLoading] = useState(true);

  // Image loading optimization
  useEffect(() => {
    if (!src) {
      setImgSrc(defaultImg);
      setIsLoading(false);
      return;
    }

    // Create a HTMLImageElement instead of using new Image()
    const img = document.createElement('img');
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setImgSrc(defaultImg);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  const priceVariants = {
    hover: {
      color: "#1CC323",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full h-fit bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <Link href={`/property/${id}`} className="w-full h-full">
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-[#1CC323] rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={imgSrc}
                alt={description || "Property image"}
                fill
                className="object-cover rounded-t-xl"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={false}
                loading="lazy"
                quality={75}
                onError={() => setImgSrc(defaultImg)}
              />
            </motion.div>
          )}

          <div className={`absolute top-2 left-2 px-3 roboto py-1 rounded text-xs font-semibold ${buyOrRent === 'For Rent' ? 'bg-gray-700 text-white' : 'bg-green-500 text-white'}`}>
            {buyOrRent}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-y-2">
          <h3 className="text-xl font-semibold roboto text-gray-800 line-clamp-1 mb-0.5">
            {description}
          </h3>

          <motion.p 
            variants={priceVariants}
            className="text-[#1CC323] font-medium roboto text-base mb-0.5"
          >
            PKR {price.toLocaleString()} {priceUnit}
          </motion.p>

          <div className="flex items-center roboto gap-x-2 text-gray-600 text-base mb-1">
            <CiLocationOn />
            <span className="truncate">
              {location}, {city}
            </span>
          </div>

          <div className="flex items-center roboto gap-x-4 text-gray-600 text-xs mb-1">
            <div className="flex items-center gap-x-1">
              <FaBed className="text-gray-500" />
              <span>Beds: {beds}</span>
            </div>
            <div className="flex items-center gap-x-1">
              <FaBath className="text-gray-500" />
              <span>Baths: {Bath}</span>
            </div>
            <div className="flex items-center gap-x-1">
              <BsRulers className="text-gray-500" />
              <span>Area: {Area} {areaUnit}</span>
            </div>
          </div>

          <div className="flex items-center roboto justify-between text-xs text-gray-400 mt-auto">
            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 bg-white cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all text-xs font-medium"
            >
              Details
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HomeBoxesDetails;