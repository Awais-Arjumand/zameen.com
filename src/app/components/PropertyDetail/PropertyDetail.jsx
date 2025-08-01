"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuBed, LuToilet } from "react-icons/lu";
import { TbRulerMeasure } from "react-icons/tb";
import { FaWhatsapp, FaStar } from "react-icons/fa6";
import { IoIosCall, IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import apiClient from "../../../../src/service/apiClient";

const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
});

export default function PropertyDetail({ params }) {
  const { company_name, cardid } = params;
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!cardid) return;
    const fetchProperty = async () => {
      try {
        const res = await apiClient.get(`/user/${cardid}`);
        const item = res.data.data;
        const galleryImages = [
          item.image?.startsWith("http")
            ? item.image
            : item.image?.startsWith("/uploads/")
            ? `https://pakistan-property-portal-backend-production.up.railway.app${item.image}`
            : item.image || "/images/default-property.jpg",
          "/images/default-property.jpg",
          "/images/default-img.png",
          "/images/HomesBoxesImages/img1.png",
          "/images/HomesBoxesImages/img2.png",
        ];
        const mapped = {
          id: item._id,
          images: galleryImages,
          price: item.maxPrice || "Unmentioned",
          areaUnit: item.areaUnit,
          beds: item.beds,
          Bath: item.Bath,
          location: item.location,
          Dealer: item.propertyDealerName || "-",
          DealerPhone: item.phone || "3001234567",
          Posted: new Date(item.createdAt).toLocaleDateString(),
          Area: item.Area,
          TotalArea: item.TotalArea,
          description: item.description,
          BuyOrRent: item.buyOrRent,
          city: item.city,
          area: item.location,
          phone: item.phone || "**********",
          title: item.title || item.description,
          rating: 4.5,
        };
        setProperty(mapped);
        setSimilarProperties([
          { ...mapped, id: mapped.id + "1" },
          { ...mapped, id: mapped.id + "2" },
          { ...mapped, id: mapped.id + "3" },
        ]);
      } catch (err) {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [cardid]);

  const handleSimilarPropertyClick = (id) => {
    router.push(`/${company_name}/${id}`);
    window.scrollTo(0, 0);
  };


  if (!property) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Property not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f7f7f7] py-6 px-2 md:px-6">
      <div className="max-w-full mx-auto">
        <Link
          href={`/${company_name}`}
          className="flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          <IoIosArrowBack className="mr-2" /> Back to Properties
        </Link>

        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-2">
            <Image
              src={property.images[0]}
              alt="Property Image"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                className={`relative w-24 h-14 rounded border-2 ${
                  0 === idx ? "border-green-600" : "border-transparent"
                }`}
                type="button"
              >
                <Image
                  src={img}
                  alt="thumb"
                  fill
                  className="object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Info & Contact */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Info */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mr-2">
                {property.title}
              </h1>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                {property.BuyOrRent}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar
                  key={i}
                  className={`text-yellow-400 ${
                    i <= Math.round(property.rating) ? "" : "opacity-30"
                  }`}
                />
              ))}
              <span className="ml-2 text-green-600 font-semibold">
                PKR: {property.price}{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (Rate/Marla)
                </span>
              </span>
            </div>
            <div className="text-gray-600 mb-2">{property.location}</div>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center text-gray-700 text-sm">
                <LuBed className="mr-1" /> {property.beds} Bedrooms
              </div>
              <div className="flex items-center text-gray-700 text-sm">
                <LuToilet className="mr-1" /> {property.Bath} Bathrooms
              </div>
              <div className="flex items-center text-gray-700 text-sm">
                <TbRulerMeasure className="mr-1" /> {property.Area}{" "}
                {property.areaUnit}
              </div>
            </div>
            {/* Property Details */}
            <div className="bg-gray-50 rounded p-4 mb-2">
              <div className="flex flex-wrap gap-4 mb-2">
                <div className="text-xs text-gray-500">
                  Total Area:{" "}
                  <span className="font-semibold text-gray-700">
                    {property.Area} {property.areaUnit}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Dealer Name:{" "}
                  <span className="font-semibold text-gray-700">
                    {property.Dealer}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Posted:{" "}
                  <span className="font-semibold text-gray-700">
                    {property.Posted}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-2">
                <span className="font-semibold text-green-700">
                  Description:
                </span>{" "}
                {property.description}
              </div>
            </div>
          </div>
          {/* Contact Info */}
          <div className="w-full md:w-80 bg-white rounded-lg shadow p-6 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                {property.Dealer?.[0] || "D"}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {property.Dealer}
                </div>
                <div className="text-xs text-gray-500">Dealer</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <IoIosCall className="text-green-600" />
              <span className="text-gray-700 text-sm">
                {property.DealerPhone}
              </span>
            </div>
            <Link
              href={`https://wa.me/${property.DealerPhone}`}
              className="flex gap-x-2 justify-center w-full mt-4 bg-green-500 items-center hover:bg-green-600 text-white text-center py-2 rounded font-semibold text-sm transition"
            >
              <FaWhatsapp className="text-lg" /> WhatsApp
            </Link>
          </div>
        </div>
        {/* Map Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="mb-2 font-semibold text-gray-900 text-lg">
            Location{" "}
            <span className="text-gray-500 text-base">
              ({property.location})
            </span>
          </div>
          <div className="mt-2 h-96 bg-gray-100 rounded flex items-center justify-center">
            <MapComponent
              city={property.city}
              description={property.description}
            />
          </div>
        </div>
        {/* Similar Properties */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Similar Properties
            </h3>
            <button className="text-green-600 text-sm font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
                onClick={() => handleSimilarPropertyClick(prop.id)}
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={prop.images?.[0]}
                    alt={prop.description}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    {prop.BuyOrRent}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-base font-semibold mb-1">{prop.title}</h4>
                  <p className="text-gray-600 text-xs mb-2">{prop.location}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 font-medium text-sm">
                      PKR {prop.price}
                    </span>
                    <span className="flex items-center text-yellow-400 text-xs">
                      <FaStar className="mr-1" /> 4.5
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <LuBed className="mr-1" /> {prop.beds}
                    </span>
                    <span className="flex items-center">
                      <LuToilet className="mr-1" /> {prop.Bath}
                    </span>
                    <span className="flex items-center">
                      <TbRulerMeasure className="mr-1" /> {prop.Area}{" "}
                      {prop.areaUnit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}