"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const getRandomCoords = (city) => {
  const coordsMap = {
    Karachi: [24.8607, 67.0011],
    Lahore: [31.5204, 74.3587],
    Islamabad: [33.6844, 73.0479],
    Rawalpindi: [33.5651, 73.0169],
    Peshawar: [34.0151, 71.5805],
    Faisalabad: [31.418, 73.0791],
  };
  return coordsMap[city] || [30.3753, 69.3451];
};

export default function RealMapComponent({ city, description }) {
  const position = getRandomCoords(city);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="h-64 w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{description}</Popup>
      </Marker>
    </MapContainer>
  );
}
