import { NextResponse } from "next/server";

// Define public and admin routes
const publicRoutes = ["/", "/property", "/property/:id"];
const adminRoutes = ["/admin"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    route.includes(":id") ? pathname.startsWith("/property/") : pathname === route
  );

  // Check if the current path is an admin route
  const isAdminRoute = pathname.startsWith("/admin");

  // For admin routes, you can implement authentication later
  // Currently allowing all requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
