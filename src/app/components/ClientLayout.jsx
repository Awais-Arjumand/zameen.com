"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Loader from "./Loader/Loader";
import NewCompanyNavbar from "./NewCompanyNavbar/NewCompanyNavbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const isUserRole = pathname.startsWith("/user-role");
  const isSignIn = pathname.startsWith("/auth/signin");
  const isSignUp = pathname.startsWith("/auth/signup");
  const isVerify = pathname.startsWith("/auth/verify");
  const isCompanyPage = /^\/[^/]+\/[^/]+$/.test(pathname); // matches /[company]/[id]

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
  
      {/* Show default navbar only when not on company route or auth/user-role pages */}
      {!isUserRole && !isVerify && !pathname.startsWith("/auth") && !isCompanyPage && (
        <NavBar />
      )}
  
      {/* Show new company navbar only for /[company]/[id] and not on any auth routes */}
      {isCompanyPage && !pathname.startsWith("/auth") && <NewCompanyNavbar />}
  
      {children}
  
      {/* Show footer only if not on auth, user-role, or company page */}
      {!isUserRole && !isVerify && !pathname.startsWith("/auth") && !isCompanyPage && (
        <Footer />
      )}
  
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
  
}
