"use client";
import Image from "next/image";
import Link from "next/link";
import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

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
    <div className="w-full h-fit bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={description || "Property image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc(defaultImg)}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {buyOrRent}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
          {description}
        </h3>
        <p className="text-blue-600 font-bold text-xl mb-2">
          PKR {price.toLocaleString()} {priceUnit}
        </p>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <FaMapMarkerAlt className="mr-1" />
          <span className="line-clamp-1">
            {location}, {city}
          </span>
        </div>

        <div className="flex justify-between text-gray-600 text-sm border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-center">
            <FaBed className="mr-1" />
            <span>{beds} Beds</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" />
            <span>{Bath} Baths</span>
          </div>
          <div>
            <span>
              {Area} {areaUnit}
            </span>
          </div>
        </div>

        <Link
          href={`/property/${id}`}
          className="mt-4 block w-full text-center bg-blue-100 text-blue-600 hover:bg-blue-200 py-2 rounded-md transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HomeBoxesDetails;
