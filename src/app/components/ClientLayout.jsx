"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Loader from "./Loader/Loader";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isUserRole = pathname.startsWith("/user-role");

  const isSignIn = pathname.startsWith("/auth/signin");
  const isSignUp = pathname.startsWith("/auth/signup");
  const isVerify = pathname.startsWith("/auth/verify");


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Show loader for 800ms on each page transition

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
      {!isUserRole && !isVerify && !isSignIn && !isSignUp  && (
        <NavBar />
      )}
      {children}
      {!isUserRole && !isVerify && !isSignIn && !isSignUp  && (
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
