import { getPendingProperties } from "@/app/model/properties";

export async function GET() {
  try {
    const response = await getPendingProperties();
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching pending properties" }),
      { status: 500 }
    );
  }
}