import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import NewCompanyNavbar from "../components/NewCompanyNavbar/NewCompanyNavbar";
import CompanyHousesBoxes from "../[company_name]/CompanyHousesBoxes/CompanyHousesBoxes";
import axios from "axios";
import PropertySearchFilter from "../components/PropertySearchFilter/PropertySearchFilter";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const mapAPIData = (apiData) => {
  return apiData.map((item) => {
    // Handle image URL
    let imageUrl = "/images/default-property.jpg";
    if (item.image) {
      if (item.image.startsWith("http")) {
        imageUrl = item.image;
      } else if (item.image.startsWith("/uploads/")) {
        imageUrl = `${BACKEND_URL}${item.image}`;
      } else if (item.image.startsWith("uploads/")) {
        imageUrl = `${BACKEND_URL}/${item.image}`;
      } else {
        imageUrl = `${BACKEND_URL}/uploads/${item.image}`;
      }
    }

    // Handle images array
    const images = item.images?.map((img) => {
      if (img.startsWith("http")) return img;
      if (img.startsWith("/uploads/")) return `${BACKEND_URL}${img}`;
      if (img.startsWith("uploads/")) return `${BACKEND_URL}/${img}`;
      return `${BACKEND_URL}/uploads/${img}`;
    }) || [imageUrl];

    return {
      id: item._id,
      src: imageUrl,
      images: images,
      price: item.maxPrice || item.minPrice || "Unmentioned",
      priceUnit: item.priceUnit || "",
      beds: item.beds || 0,
      Bath: item.Bath || 0,
      location: item.location || "",
      Area: item.Area || "",
      TotalArea: item.TotalArea || "",
      areaUnit: item.areaUnit || "",
      description: item.description || "",
      city: item.city || "",
      buyOrRent: item.buyOrRent || "Buy",
      category: item.category || "",
      propertyDealerName: item.propertyDealerName || "",
      senderName: item.senderName || "",
      createdAt: item.createdAt,
      phone: item.phone || "",
    };
  });
};

const filterProperties = (properties, filters) => {
  return properties.filter((property) => {
    // Purpose filter
    if (filters.purpose && property.buyOrRent !== filters.purpose) {
      return false;
    }

    // Category filter
    if (filters.category && property.category !== filters.category) {
      return false;
    }

    // City filter
    if (filters.city && property.city !== filters.city) {
      return false;
    }

    // Beds filter
    if (filters.beds) {
      const bedsNum = parseInt(property.beds);
      if (filters.beds.endsWith('+')) {
        const minBeds = parseInt(filters.beds);
        if (bedsNum < minBeds) return false;
      } else if (bedsNum !== parseInt(filters.beds)) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceMin || filters.priceMax) {
      const price = parseInt(property.price) || 0;
      if (filters.priceMin && price < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && price > parseInt(filters.priceMax)) return false;
    }

    // Area range filter
    if (filters.areaMin || filters.areaMax) {
      const area = parseInt(property.Area) || 0;
      if (filters.areaMin && area < parseInt(filters.areaMin)) return false;
      if (filters.areaMax && area > parseInt(filters.areaMax)) return false;
    }

    // Location filter
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const searchFields = [
        property.description,
        property.location,
        property.city,
        property.category,
        property.buyOrRent,
      ].join(' ').toLowerCase();
      
      if (!searchFields.includes(keyword)) {
        return false;
      }
    }

    return true;
  });
};

export default async function CompanyPage({ params, searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const companyNameFromSession = session.user?.companyName;
  if (companyNameFromSession && params.company_name !== companyNameFromSession) {
    redirect(`/${companyNameFromSession}`);
  }

  let properties = [];
  try {
    const propRes = await axios.get(`${BACKEND_URL}/api/company-properties`);
    properties = mapAPIData(propRes.data.data || []);
  } catch (error) {
    console.error("Error fetching properties:", error);
  }

  // Apply filters if any searchParams exist
  const filteredProperties = searchParams && Object.keys(searchParams).length > 0 
    ? filterProperties(properties, searchParams)
    : properties;

  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex flex-col gap-y-5 ">
      <NewCompanyNavbar />

      <div className="mt-28 w-full h-fit bg-[#fafafa] py-7 px-6 flex flex-col gap-y-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-y-5">
          <PropertySearchFilter 
            logoColor={session.user?.logoColor || "#3B404C"} 
            initialFilters={searchParams}
          />
          {filteredProperties.length === 0 ? (
            <p className="text-center text-gray-500">No properties found.</p>
          ) : (
            <CompanyHousesBoxes
              houseData={filteredProperties}
              companyName={params.company_name}
            />
          )}
        </div>
      </div>
    </div>
  );
}