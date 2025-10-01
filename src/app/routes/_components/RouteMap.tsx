'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SavedRoute } from '@/types/route';

interface RouteMapProps {
  route: SavedRoute;
  interactive?: boolean;
}

// Map component that only renders on client
function RouteMapClient({ route, interactive = false }: RouteMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MapContainer, TileLayer, Polyline, useMap } = require('react-leaflet');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { LatLngBounds } = require('leaflet');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  function FitBounds({ route }: { route: SavedRoute }) {
    const map = useMap();

    useEffect(() => {
      if (route.points.length > 0) {
        const bounds = new LatLngBounds(
          route.points.map(point => [point.latitude, point.longitude])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, [route, map]);

    return null;
  }

  if (route.points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No route data available</p>
      </div>
    );
  }

  // Convert route points to Leaflet LatLng format
  const positions: [number, number][] = route.points.map(point => [
    point.latitude,
    point.longitude,
  ]);

  // Get center point (middle of route)
  const centerPoint = route.points[Math.floor(route.points.length / 2)];
  const center: [number, number] = [centerPoint.latitude, centerPoint.longitude];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={13}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        className="w-full h-full"
        style={{ minHeight: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route polyline */}
        <Polyline
          positions={positions}
          pathOptions={{
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Start marker (green) */}
        <Polyline
          positions={[positions[0]]}
          pathOptions={{
            color: '#10b981',
            weight: 12,
            opacity: 1,
            lineCap: 'round',
          }}
        />

        {/* End marker (red) */}
        <Polyline
          positions={[positions[positions.length - 1]]}
          pathOptions={{
            color: '#ef4444',
            weight: 12,
            opacity: 1,
            lineCap: 'round',
          }}
        />

        <FitBounds route={route} />
      </MapContainer>

      {/* Legend for start/end markers */}
      {interactive && (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-[1000] text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-700 dark:text-gray-300">End</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Default export with dynamic import (no SSR)
export default dynamic(() => Promise.resolve(RouteMapClient), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
});
