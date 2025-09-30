'use client';

import dynamic from 'next/dynamic';

// Dynamically import the GPS tracker to avoid SSR issues with geolocation
const GPSTracker = dynamic(
  () => import('./_components/GPSTracker'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing GPS tracking...</p>
        </div>
      </div>
    )
  }
);

export default function GPSTrackingPage() {
  return (
    <main className="h-screen w-full">
      <GPSTracker />
    </main>
  );
}