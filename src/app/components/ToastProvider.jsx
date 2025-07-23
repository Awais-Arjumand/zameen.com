"use client";

import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function ToastifyStyles() {
  useEffect(() => {
    // This ensures CSS is loaded on client side
    require("react-toastify/dist/ReactToastify.css");
  }, []);

  return null;
}