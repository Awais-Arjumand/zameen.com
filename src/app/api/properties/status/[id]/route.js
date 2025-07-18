import { updatePropertyStatus } from "@/app/model/properties";

export async function PATCH(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const response = await updatePropertyStatus({ params: { id }, body });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating property status" }),
      { status: 500 }
    );
  }
}