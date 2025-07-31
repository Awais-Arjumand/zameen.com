// pages/[company_name]/page.js
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
    }) || [imageUrl]; // Fallback to main image if images array is empty

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
      createdAt: item.createdAt,
      phone: item.phone || "",
    };
  });
};

export default async function CompanyPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const companyNameFromSession = session.user?.companyName;
  if (companyNameFromSession && params.company_name !== companyNameFromSession) {
    redirect(`/${companyNameFromSession}`);
  }

  let userData = null;
  try {
    const userRes = await fetch(
      `${BACKEND_URL}/api/users/${encodeURIComponent(session.user.phone)}`,
      { next: { revalidate: 0 } }
    );
    const userResponse = await userRes.json();
    userData = userResponse.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  const combinedData = {
    ...session.user,
    ...(userData || {}),
    fullName: userData?.fullName || session.user?.fullName || "User",
    phone: session.user?.phone || userData?.phone || "",
  };

  let properties = [];
  try {
    const propRes = await axios.get(`${BACKEND_URL}/api/company-properties`);
    const allProperties = mapAPIData(propRes.data.data || []);
    
    // Filter properties where phone matches session user's phone
    properties = allProperties.filter(
      (property) => property.phone === combinedData.phone
    );
    
  } catch (error) {
    console.error("Error fetching properties:", error);
  }

  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex flex-col gap-y-5 ">
      <NewCompanyNavbar />

      <div className="mt-28 w-full h-fit bg-[#fafafa] py-7 px-6 flex flex-col gap-y-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-y-5">
          <PropertySearchFilter logoColor={combinedData?.logoColor || "#3B404C"} />
          <CompanyHousesBoxes
            houseData={properties}
            companyName={params.company_name}
          />
        </div>
      </div>
    </div>
  );
}