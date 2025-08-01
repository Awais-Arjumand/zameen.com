import { getServerSession } from "next-auth";
import clientPromise from "../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return Response.json({ error: "Company ID required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Adjust this query based on your actual schema
    const properties = await db
      .collection("properties")
      .find({
        companyId: companyId,
      })
      .toArray();

    return Response.json({
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
