"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuBed, LuToilet, LuImage } from "react-icons/lu";
import { TbRulerMeasure2 } from "react-icons/tb";
import { FaWhatsapp, FaStar } from "react-icons/fa6";
import { IoIosCall, IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import apiClient from "../../../src/service/apiClient";

const ImageGallery = ({ images }) => {
  const [selected, setSelected] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState(new Set());

  // Filter out any empty or undefined images
  const validImages = useMemo(
    () =>
      images.filter(
        (img) =>
          img &&
          !img.includes("default-property.jpg") &&
          !img.includes("default-img.png.jpg")
      ),
    [images]
  );

  const handleImageLoad = (index) => {
    setLoadedIndices((prev) => new Set(prev).add(index));
  };

  // If no valid images, show image icon
  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LuImage className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-gray-500 mt-2">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-2 bg-gray-100">
        {validImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-300 ${
              selected === idx ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt="Property Image"
              fill
              className="object-cover"
              priority={idx === 0}
              quality={80}
              onLoadingComplete={() => handleImageLoad(idx)}
            />
          </div>
        ))}
        {!loadedIndices.has(selected) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              className={`relative w-24 h-14 rounded border-2 ${
                selected === idx ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setSelected(idx)}
              type="button"
            >
              <Image
                src={img}
                alt="thumb"
                fill
                className="object-cover rounded"
                sizes="80px"
                loading="lazy"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-gray-100">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
    </div>
  ),
});

export default function PropertyDetail({ id, company }) {
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const processImageUrls = (item) => {
    const mainImage = item.image?.startsWith("http")
      ? item.image
      : item.image?.startsWith("/uploads/")
      ? `https://pakistan-property-portal-backend-production.up.railway.app${item.image}`
      : item.image;

    return mainImage ? [mainImage] : [];
  };

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!id || !property) return;

      try {
        setSimilarLoading(true);
        const res = await apiClient.get(`/company-properties/${id}/similar`);
        const similar = res.data.data.map((item) => {
          const images = [];
          if (item.image) {
            const imageUrl = item.image.startsWith("http")
              ? item.image
              : item.image.startsWith("/uploads/")
              ? `https://pakistan-property-portal-backend-production.up.railway.app${item.image}`
              : item.image;
            images.push(imageUrl);
          }

          return {
            id: item._id,
            images: images,
            price: item.maxPrice || "Unmentioned",
            areaUnit: item.areaUnit,
            beds: item.beds,
            Bath: item.Bath,
            location: item.location,
            Dealer: item.propertyDealerName || "-",
            Posted: new Date(item.createdAt).toLocaleDateString(),
            Area: item.Area,
            TotalArea: item.TotalArea,
            description: item.description,
            BuyOrRent: item.buyOrRent,
            city: item.city,
            title: item.title || item.description,
            rating: 4.5,
          };
        });
        setSimilarProperties(similar);
      } catch (err) {
        console.error("Failed to fetch similar properties:", err);
        setSimilarProperties([]);
      } finally {
        setSimilarLoading(false);
      }
    };

    if (property) {
      fetchSimilarProperties();
    }
  }, [id, property]);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/company-properties/${id}`);
        const item = res.data.data;

        const mapped = {
          id: item._id,
          images: processImageUrls(item),
          price: item.maxPrice || "Unmentioned",
          areaUnit: item.areaUnit,
          maxPrice: item.maxPrice,
          minPrice: item.minPrice,
          priceUnit: item.priceUnit || "",
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
      } catch (err) {
        console.error("Fetch failed:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSimilarPropertyClick = (targetId) => {
    router.push(`/${company}/${targetId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="w-full h-screen flex items-center justify-center pt-16">
        Property not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f7f7f7] pt-16 pb-6 px-2 md:px-6 mt-10">
      <div className="max-w-full mx-auto">
        <Link
          href={`/${company}`}
          className="flex items-center text-primary mb-6"
        >
          <IoIosArrowBack className="mr-2" /> Back to Properties
        </Link>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <ImageGallery images={property.images} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="w-[700px] text-xl md:text-2xl font-bold text-gray-900 mr-2 truncate">
                {property.title}
              </h1>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-primary text-white">
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
              <span className="ml-2 text-primary font-semibold">
                PKR: {property.minPrice} - {property.maxPrice}{" "}
                {property.priceUnit}
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
                <TbRulerMeasure2 className="mr-1" /> {property.Area}{" "}
                {property.areaUnit}
              </div>
            </div>

            <div className="bg-gray-50 rounded p-4 mb-2">
              <div className="flex flex-wrap gap-4 mb-2 text-xs text-gray-500">
                <div>
                  Total Area:{" "}
                  <span className="font-semibold text-gray-700">
                    {property.Area} {property.areaUnit}
                  </span>
                </div>
                <div>
                  Dealer Name:{" "}
                  <span className="font-semibold text-gray-700">
                    {property.Dealer}
                  </span>
                </div>
                <div>
                  Posted:{" "}
                  <span className="font-semibold text-gray-700">
                    {property.Posted}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-2">
                <span className="font-semibold text-primary flex gap-x-3 truncate w-[1000px]">
                  Description:{" "}
                  <h1 className="text-black">{property.description}</h1>
                </span>
                <span></span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white rounded-lg shadow p-6 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-primary font-bold text-lg">
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
              <IoIosCall className="text-primary" />
              <span className="text-gray-700 text-sm">
                {property.DealerPhone}
              </span>
            </div>
            <Link
              href={`https://wa.me/${property.DealerPhone}`}
              className="flex gap-x-2 justify-center w-full mt-4 bg-primary items-center text-white py-2 rounded font-semibold text-sm"
            >
              <FaWhatsapp className="text-lg" /> WhatsApp
            </Link>
          </div>
        </div>

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

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Similar Properties
            </h3>
          </div>
          {similarLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : similarProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-primary group"
                  onClick={() => handleSimilarPropertyClick(prop.id)}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {prop.images && prop.images.length > 0 ? (
                      <Image
                        src={prop.images[0]}
                        alt={prop.description}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        quality={75}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <LuImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      {prop.BuyOrRent}
                    </span>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-gray-800 text-xs font-medium">
                        {prop.rating}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {prop.title}
                      </h4>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {prop.location} - {prop.city}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-primary font-bold text-lg">
                          PKR {prop.price}
                        </span>
                        {prop.price !== "Unmentioned" && (
                          <span className="text-xs text-gray-400">/Marla</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
                        <LuBed className="text-gray-400" />
                        <span>{prop.beds} Beds</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
                        <LuToilet className="text-gray-400" />
                        <span>{prop.Bath} Bath</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
                        <TbRulerMeasure2 className="text-gray-400" />
                        <span>
                          {prop.Area} {prop.areaUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No similar properties found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
