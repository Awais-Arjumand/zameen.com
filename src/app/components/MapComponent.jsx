"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const LeafletMap = dynamic(() => import("./RealMapComponent"), {
  ssr: false,
});

export default function MapComponent({ city, description }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <LeafletMap city={city} description={description} />;
}
