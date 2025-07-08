// app/components/WraperComponent.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";

// Dynamically import ToastContainer to avoid SSR issues
const ToastContainer = dynamic(
  () => import("react-toastify").then((c) => c.ToastContainer),
  {
    ssr: false,
    loading: () => null,
  }
);

const WraperComponent = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <NavBar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <main className="min-h-[calc(100vh-140px)]">{children}</main>
      <Footer />
    </>
  );
};

export default WraperComponent;