"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

interface MapComponentProps {
  lat: number;
  lng: number;
  locationName?: string;
}

// Component to handle map updates when props change
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
    // Ensure map tiles/panes are recalculated after any layout changes.
    map.invalidateSize();
  }, [lat, lng, map]);
  
  return null;
}

export default function MapComponent({ lat, lng, locationName }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const markerIcon = useMemo(
    () =>
      L.icon({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),
    []
  );

  if (!isMounted) {
    return (
      <div
        style={{
          width: "100%",
          height: "320px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-soft)"
        }}
      />
    );
  }

  return (
    <div style={{ width: "100%", height: "320px", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: 12 }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>
            <div style={{ fontWeight: 500 }}>
              {locationName || `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
            </div>
          </Popup>
        </Marker>
        <MapUpdater lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}






