import { getApprovedProperties } from "@/app/model/properties";

export async function GET() {
  try {
    const response = await getApprovedProperties();
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching approved properties" }),
      { status: 500 }
    );
  }
}