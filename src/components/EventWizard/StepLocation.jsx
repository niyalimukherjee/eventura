import React from "react";
import { Box, TextField, useMediaQuery } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import marker images directly for Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix default icon in Leaflet for React/Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function LocationPicker({ formData, setFormData }) {
  useMapEvents({
    click(e) {
      setFormData({
        ...formData,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        location: `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`,
      });
    },
  });

  return formData.lat && formData.lng ? (
    <Marker position={[formData.lat, formData.lng]} />
  ) : null;
}

export default function StepLocation({ formData, setFormData }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box>
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={13}
        style={{
          height: isMobile ? "60vh" : "40vh", // Taller on mobile
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationPicker formData={formData} setFormData={setFormData} />
      </MapContainer>

      <TextField
        sx={{ mt: isMobile ? 1.5 : 2 }}
        label="Selected Location"
        value={formData.location || ""}
        fullWidth
        InputProps={{ readOnly: true }}
      />
    </Box>
  );
}
