"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuBed, LuToilet } from "react-icons/lu";
import { TbRulerMeasure2 } from "react-icons/tb";
import { FaWhatsapp } from "react-icons/fa6";
import { IoIosCall, IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
});

async function getParams() {
  return { id: "" };
}

export default function PropertyDetail({ params: paramsPromise }) {
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = use(paramsPromise || getParams());

  useEffect(() => {
    if (!params.id) return;

    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user/${params.id}`
        );
        const item = res.data.data;

        const mapped = {
          id: item._id,
          src: item.image?.startsWith("http")
            ? item.image
            : item.image?.startsWith("/uploads/")
            ? `http://localhost:3000${item.image}`
            : item.image || "/images/default-property.jpg",
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
          fullDescription: [
            `Category: ${item.category || "-"}`,
            `Posted: ${new Date(item.createdAt).toLocaleDateString()}`,
            `Price Unit: ${item.priceUnit}`,
            `Area Unit: ${item.areaUnit}`,
          ],
        };

        setProperty(mapped);

        // Dummy similar properties for now:
        setSimilarProperties([
          {
            ...mapped,
            id: mapped.id + "1",
            price: mapped.price,
            src: mapped.src,
          },
          {
            ...mapped,
            id: mapped.id + "2",
            price: mapped.price,
            src: mapped.src,
          },
        ]);
      } catch (err) {
        console.error("Error fetching:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  const handleSimilarPropertyClick = (id) => {
    router.push(`/property/${id}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Property not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          <IoIosArrowBack className="mr-2" /> Back to Properties
        </Link>

        {/* Main Property */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 w-full">
            <Image
              src={property.src}
              alt={property.description}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      property.BuyOrRent === "Rent"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {property.BuyOrRent}
                  </span>
                </div>

                <p className="text-lg text-gray-600 mt-2">
                  {property.location}
                </p>

                <div className="mt-6 flex items-center gap-6">
                  <div className="flex items-center">
                    <LuBed className="text-xl mr-2 text-gray-700" />
                    <span className="text-gray-700">{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <LuToilet className="text-xl mr-2 text-gray-700" />
                    <span className="text-gray-700">{property.Bath} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <TbRulerMeasure2 className="text-xl mr-2 text-gray-700" />
                    <span className="text-gray-700">
                      {property.Area} {property.areaUnit}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    PKR {property.price}
                  </h2>

                  {/* Expandable Description */}
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Property Description
                    </h2>
                    <ul className="list-disc flex flex-col pl-5 space-y-2">
                      <li>
                        <span className="text-green-600 font-semibold">
                          Description :
                        </span>{" "}
                        {property.description}
                      </li>
                      <li>
                        <span className="text-green-600 font-semibold">
                          TotalArea :
                        </span>{" "}
                        {property.Area} {property.areaUnit}
                      </li>
                      <li>
                        <span className="text-green-600 font-semibold">
                          Dealer Name :
                        </span>{" "}
                        {property.Dealer}
                      </li>
                      <li>
                        <span className="text-green-600 font-semibold">
                          Posted :
                        </span>
                        {property.Posted}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Agent Box */}
              {/* Contact Agent Box */}
              <div className="w-full md:w-80 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Agent
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    value={property.Dealer} // dealer name
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                 
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm rounded-l-md">
                      +92
                    </span>
                    <input
                      type="tel"
                      value={property.DealerPhone || "3001234567"} // fallback
                      readOnly
                      className="w-full border border-gray-300 rounded-r-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                
                </form>

                <div className="mt-6 flex justify-between">
                  <button className="p-2 bg-green-100 text-green-600 rounded-full">
                    <FaWhatsapp className="text-xl" />
                  </button>
                  <button className="p-2 bg-green-600 text-white rounded-full">
                    <IoIosCall className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900">Location</h3>
            <h1 className="text-xl font-semibold text-gray-900">
              {property.location}
            </h1>
            <div className="mt-4 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <MapComponent
                city={property.city}
                description={property.description}
              />
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Similar Properties
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleSimilarPropertyClick(prop.id)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={prop.src}
                    alt={prop.description}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{prop.title}</h4>
                  <p className="text-gray-600 mt-1">{prop.location}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-green-600 font-medium">
                      PKR {prop.price}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        prop.BuyOrRent === "Rent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {prop.BuyOrRent}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <LuBed className="mr-1" /> {prop.beds}
                    </span>
                    <span className="flex items-center">
                      <LuToilet className="mr-1" /> {prop.Bath}
                    </span>
                    <span className="flex items-center">
                      <TbRulerMeasure2 className="mr-1" /> {prop.Area}{" "}
                      {prop.TotalArea}
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
