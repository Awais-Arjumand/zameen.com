// Add this temporary route at app/api/debug/route.js
import { ObjectId } from 'mongodb';
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(companyId)
    });

    return Response.json(user);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}