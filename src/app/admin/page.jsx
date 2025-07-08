// app/admin/page.tsx
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminRouteGuard from "./AdminRouteGuard";
import AdminPageClient from "../components/admin/AdminPageClient";

export default async function AdminPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

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

  const plainUser = {
    id: user?.id ?? null,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    imageUrl: user?.imageUrl ?? null,
  };

  return (
    <AdminRouteGuard>
      <AdminPageClient user={plainUser} apiData={apiData} />
    </AdminRouteGuard>
  );
}
