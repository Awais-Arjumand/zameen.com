"use client";

import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const ADMIN_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/settings",
  "/admin/reports",
  // Add all your admin routes here
];

export default function AdminRouteGuard({ children }) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    // Check if current route is an admin route
    const isAdminRoute = ADMIN_ROUTES.some((route) =>
      window.location.pathname.startsWith(route)
    );

    if (!isAdminRoute) {
      // If user navigates outside admin routes, sign them out
      signOut(() => router.push("/sign-in"));
      return;
    }

    // Add your admin role check here if needed
    // For example, check user.publicMetadata.isAdmin
    if (!user /* || !user.publicMetadata.isAdmin */) {
      signOut(() => router.push("/sign-in"));
    }
  }, [isLoaded, user, router, signOut]);

  if (!isLoaded || !user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 bg-pink-500 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
