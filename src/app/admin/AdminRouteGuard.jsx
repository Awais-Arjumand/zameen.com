"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/settings",
  "/admin/reports",
  // Add all your admin routes here
];

export default function AdminRouteGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume authenticated for now
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if current route is an admin route
    const isAdminRoute = ADMIN_ROUTES.some((route) =>
      window.location.pathname.startsWith(route)
    );

    if (!isAdminRoute) {
      // If user navigates outside admin routes, redirect to sign-in
      // You can implement your own authentication check here
      router.push("/sign-in");
      return;
    }

    // Here you would check if the user is authenticated
    // For now, we'll assume they are
  }, [router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 bg-pink-500 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
