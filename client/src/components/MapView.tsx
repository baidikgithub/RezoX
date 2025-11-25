"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the entire map component to avoid SSR issues
const MapComponent = dynamic(
  () => import("./MapComponent"),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        width: "100%", 
        height: "320px", 
        borderRadius: 12, 
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666",
        fontSize: 14
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 8 }}>🗺️</div>
          <div>Loading map...</div>
        </div>
      </div>
    )
  }
);

interface MapViewProps {
  lat?: number;
  lng?: number;
  locationName?: string;
}

export default function MapView({ lat = 12.9716, lng = 77.5946, locationName }: MapViewProps) {
  return <MapComponent lat={lat} lng={lng} locationName={locationName} />;
}
