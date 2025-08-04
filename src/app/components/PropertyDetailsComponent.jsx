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
  const validImages = useMemo(() => 
    images.filter(img => img && !img.includes('default-property.jpg') && !img.includes('default-img.png.jpg')),
    [images]
  );

  const handleImageLoad = (index) => {
    setLoadedIndices(prev => new Set(prev).add(index));
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
            className={`absolute inset-0 transition-opacity duration-300 ${selected === idx ? 'opacity-100' : 'opacity-0'}`}
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
                selected === idx ? 'border-primary' : 'border-transparent'
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
  )
});

export default function PropertyDetail({ id, company }) {
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setSimilarProperties([
          { ...mapped, id: mapped.id + "1" },
          { ...mapped, id: mapped.id + "2" },
          { ...mapped, id: mapped.id + "3" },
        ]);
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
    <div className="w-full min-h-screen bg-[#f7f7f7] pt-16 pb-6 px-2 md:px-6">
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
                PKR: {property.minPrice} - {property.maxPrice} {property.priceUnit}
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
                <TbRulerMeasure2 className="mr-1" /> {property.Area} {property.areaUnit}
              </div>
            </div>

            <div className="bg-gray-50 rounded p-4 mb-2">
              <div className="flex flex-wrap gap-4 mb-2 text-xs text-gray-500">
                <div>
                  Total Area: <span className="font-semibold text-gray-700">{property.Area} {property.areaUnit}</span>
                </div>
                <div>
                  Dealer Name: <span className="font-semibold text-gray-700">{property.Dealer}</span>
                </div>
                <div>
                  Posted: <span className="font-semibold text-gray-700">{property.Posted}</span>
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-2">
                  
                  <span className="font-semibold text-primary flex gap-x-3 truncate w-[1000px]">Description: <h1 className="text-black">{property.description}</h1></span> 
                <span>

                  </span>
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
            Location <span className="text-gray-500 text-base">({property.location})</span>
          </div>
          <div className="mt-2 h-96 bg-gray-100 rounded flex items-center justify-center">
            <MapComponent city={property.city} description={property.description} />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Similar Properties</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
                onClick={() => handleSimilarPropertyClick(prop.id)}
              >
                <div className="relative h-40 w-full bg-gray-100">
                  {prop.images?.[0] ? (
                    <Image
                      src={prop.images[0]}
                      alt={prop.description}
                      fill
                      className="object-cover"
                      loading="lazy"
                      quality={75}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LuImage className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold bg-primary text-white">
                    {prop.BuyOrRent}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-base font-semibold mb-1 w-80 truncate">
                    {prop.title}
                  </h4>
                  <p className="text-gray-600 text-xs mb-2">{prop.location}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary font-medium text-sm">
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
                      <TbRulerMeasure2 className="mr-1" /> {prop.Area} {prop.areaUnit}
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