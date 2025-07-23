"use client";
import Image from "next/image";
import Link from "next/link";
import { FaBed, FaBath } from "react-icons/fa";
import { BsRulers } from "react-icons/bs";

import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";

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
  // Validate the image URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const defaultImg = "/images/default-property.jpg";
  const [imgSrc, setImgSrc] = useState(isValidUrl(src) ? src : defaultImg);

  return (
    <div className="w-full h-fit bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={description || "Property image"}
          fill
          className="object-cover rounded-t-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc(defaultImg)}
        />
        <div className={`absolute top-2 left-2 px-3 roboto py-1 rounded text-xs font-semibold ${buyOrRent === 'For Rent' ? 'bg-gray-700 text-white' : 'bg-green-500 text-white'}`}>
          {buyOrRent}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-y-2">
        <h3 className="text-xl font-semibold roboto text-gray-800 line-clamp-1 mb-0.5">
          {description}
        </h3>
        <p className="text-[#1CC323] font-medium roboto text-base mb-0.5">
          PKR {price.toLocaleString()} {priceUnit}
        </p>
        <div className="flex items-center roboto gap-x-2 text-gray-600 text-base mb-1">
        <CiLocationOn />

          <span className="truncate">
            {location}, {city}
          </span>
        </div>
        <div className="flex items-center roboto gap-x-4 text-gray-600 text-xs mb-1">
          <div className="flex items-center gap-x-1">
            <FaBed />
            Beds:
            <span>{beds}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <FaBath />
            Baths
            <span>{Bath}</span>
          </div>
          <div className="flex items-center gap-x-1">
          <BsRulers />

            <span>Area:</span>
            <span>{Area} {areaUnit}</span>
          </div>
        </div>
        <div className="flex items-center roboto justify-between text-xs text-gray-400 mt-auto">
          <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <Link href={`/property/${id}`}>
            <button className="px-4 py-1.5 bg-white cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all text-xs font-medium">Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeBoxesDetails;
