// app/admin/page.tsx
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminRouteGuard from "./AdminRouteGuard";
import AdminPageClient from "../components/admin/AdminPageClient";

export default async function AdminPage() {



  let apiData = [];
  try {
    const res = await fetch("http://localhost:3000/api/user", {
      cache: "no-store",
    });
    const json = await res.json();
    apiData = json.data;
  } catch (error) {
    console.error("Error fetching API data:", error);
  }


  return (
    <AdminRouteGuard>
      <AdminPageClient apiData={apiData} />
    </AdminRouteGuard>
  );
}
