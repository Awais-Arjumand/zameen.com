import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add property detail route to publicRoutes
const publicRoutes = ["/sign-in", "/", "/property", "/property/:id"];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  // Allow all /property and /property/[id] as public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes(":id")) {
      return req.nextUrl.pathname.startsWith("/property/");
    }
    return req.nextUrl.pathname === route;
  });

  if (!userId && !isPublicRoute) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (userId && isPublicRoute && req.nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
