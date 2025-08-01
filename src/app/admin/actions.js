"use server";

import axios from "axios";

export async function deleteProperty(id) {
  try {
    // const res = await axios.delete(`http://localhost:3000/api/user/${id}`);
    const res = await apiClient.delete(`/user/${id}`);
    if (res.status !== 200) {
      throw new Error(`Failed to delete property with id ${id}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { success: false };
  }
}
