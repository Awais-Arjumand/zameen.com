import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import NewCompanyNavbar from "../components/NewCompanyNavbar/NewCompanyNavbar";
import CompanyHousesBoxes from "../[company_name]/CompanyHousesBoxes/CompanyHousesBoxes";
import axios from "axios";
import PropertySearchFilter from "../components/PropertySearchFilter/PropertySearchFilter";

const BACKEND_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

const mapAPIData = (apiData) => {
  return apiData.map((item) => {
    let imageUrl = "/images/default-property.jpg";
    if (item.image) {
      if (item.image.startsWith("http")) {
        imageUrl = item.image;
      } else if (item.image.startsWith("/uploads/")) {
        imageUrl = `${BACKEND_URL}${item.image}`;
      } else {
        imageUrl = item.image;
      }
    }

    return {
      id: item._id,
      src: imageUrl,
      images:
        item.images?.map((img) =>
          img.startsWith("http")
            ? img
            : img.startsWith("/uploads/")
            ? `${BACKEND_URL}${img}`
            : img
        ) || [],
      price: item.maxPrice || item.minPrice || "Unmentioned",
      beds: item.beds,
      Bath: item.Bath,
      location: item.location,
      Area: item.Area,
      TotalArea: item.TotalArea,
      areaUnit: item.areaUnit,
      description: item.description,
      city: item.city,
      buyOrRent: item.buyOrRent,
      category: item.category,
      propertyDealerName: item.propertyDealerName,
      createdAt: item.createdAt,
      phone: item.phone,
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
      `http://localhost:3000/api/users/${encodeURIComponent(session.user.phone)}`,
      { next: { revalidate: 0 } }
    );
    const userResponse = await userRes.json();
    userData = userResponse.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  let properties = [];
  try {
    const propRes = await axios.get(`http://localhost:3000/api/user`);
    properties = mapAPIData(propRes.data.data || []);
  } catch (error) {
    console.error("Error fetching properties:", error);
  }

  const combinedData = {
    ...session.user,
    ...(userData || {}),
    fullName: userData?.fullName || session.user?.fullName || "User",
  };

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
