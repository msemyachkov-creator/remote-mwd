import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  onLocationChange?: (lat: number, lng: number) => void;
}

export function MapComponent({ latitude, longitude, onLocationChange }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 2,
        zoomControl: true,
        attributionControl: false,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "",
      }).addTo(map);

      // Create custom marker icon
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: '<div style="width: 12px; height: 12px; background-color: #ef4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      // Add marker
      const marker = L.marker([latitude, longitude], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      // Handle marker drag
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onLocationChange?.(pos.lat, pos.lng);
      });

      // Handle map click
      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        onLocationChange?.(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.setView([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded overflow-hidden border border-border"
      style={{
        borderRadius: "var(--radius)",
        minHeight: "400px",
      }}
    />
  );
}
