'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GPSPoint } from '@/types/gps';
import * as L from 'leaflet';

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

// Import useMap hook differently for TypeScript
import { useMap } from 'react-leaflet';

interface MapViewProps {
  center: [number, number];
  zoom: number;
  routePoints: GPSPoint[];
  currentPosition: GeolocationPosition | null;
  followUser: boolean;
  mapType: 'street' | 'satellite' | 'terrain';
}

// Component to handle map center changes
function MapController({ center, followUser }: { center: [number, number]; followUser: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    if (followUser && map) {
      map.setView(center, map.getZoom());
    }
  }, [center, followUser, map]);
  
  return null;
}

export default function MapView({
  center,
  zoom,
  routePoints,
  currentPosition,
  followUser,
  mapType
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Convert GPS points to leaflet format
  const routePath = routePoints.map(point => [point.latitude, point.longitude] as [number, number]);

  // Get tile layer URL based on map type
  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapType) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      case 'terrain':
        return '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    }
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        ref={mapRef}
        whenReady={() => {
          // Leaflet CSS is imported in globals.css
          console.log('Map ready');
        }}
      >
        <MapController center={center} followUser={followUser} />
        
        <TileLayer
          url={getTileLayerUrl()}
          attribution={getTileLayerAttribution()}
          maxZoom={19}
        />
        
        {/* Route polyline */}
        {routePath.length > 1 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
        
        {/* Current location marker */}
        {currentPosition && (
          <Circle
            center={[currentPosition.coords.latitude, currentPosition.coords.longitude]}
            radius={5}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 1,
              weight: 3,
            }}
          />
        )}
        
        {/* Accuracy circle */}
        {currentPosition && currentPosition.coords.accuracy && (
          <Circle
            center={[currentPosition.coords.latitude, currentPosition.coords.longitude]}
            radius={currentPosition.coords.accuracy}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 1,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}