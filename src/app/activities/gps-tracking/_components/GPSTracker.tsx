'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGPSTracking } from './useGPSTracking';
import ActivityControls from './ActivityControls';
import RouteStats from './RouteStats';
import { AlertCircle, MapPin } from 'lucide-react';

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
    <div className="text-gray-500">Loading map...</div>
  </div>
});

export default function GPSTracker() {
  const {
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    isTracking,
    isPaused,
    currentPosition,
    routePoints,
    totalDistance,
    currentSpeed,
    averageSpeed,
    elapsedTime,
    locationError,
    permissionDenied,
    mapCenter,
    followUser,
    toggleFollowUser,
  } = useGPSTracking();

  const [mapType, setMapType] = useState<'street' | 'satellite' | 'terrain'>('street');
  const [permissionState, setPermissionState] = useState<'unknown' | 'requesting' | 'granted' | 'denied'>('unknown');
  const [initialLocationLoaded, setInitialLocationLoaded] = useState(false);

  // Simple permission check - no automatic requests
  useEffect(() => {
    console.log('🚀 GPSTracker component mounted');
    
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported');
      setPermissionState('denied');
      return;
    }
    
    // Just check if we have permission, don't request location yet
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('🔍 Permission state:', result.state);
        if (result.state === 'granted') {
          setPermissionState('granted');
          setInitialLocationLoaded(true); // Skip the initial location loading
        } else if (result.state === 'denied') {
          setPermissionState('denied');
        } else {
          setPermissionState('unknown');
        }
      }).catch((error) => {
        console.warn('⚠️ Permissions API error:', error);
        setPermissionState('unknown');
      });
    } else {
      console.log('ℹ️ Permissions API not supported, showing permission request');
      setPermissionState('unknown');
    }
  }, []);

  const requestLocationPermission = () => {
    console.log('📍 Requesting location permission...');
    setPermissionState('requesting');
    
    // Very simple permission request
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Permission granted! Position:', position.coords.latitude, position.coords.longitude);
        setPermissionState('granted');
        setInitialLocationLoaded(true);
      },
      (error) => {
        console.error('❌ Permission error:', error.code, error.message);
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            setPermissionState('denied');
            break;
          case 2: // POSITION_UNAVAILABLE  
          case 3: // TIMEOUT
            // For these errors, permission was likely granted but GPS failed
            setPermissionState('granted');
            setInitialLocationLoaded(true);
            break;
          default:
            setPermissionState('unknown');
        }
      }
    );
  };

  const handleCenterMap = () => {
    toggleFollowUser();
  };

  // Show permission request screen
  if (permissionState === 'unknown') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto text-center p-6">
          <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Enable Location Access
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            To track your GPS routes, this app needs access to your location. Your location data stays on your device and is never shared.
          </p>
          <div className="space-y-2">
            <button
              onClick={requestLocationPermission}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium w-full"
            >
              Enable Location Access
            </button>
            <button
              onClick={() => {
                setPermissionState('granted');
                setInitialLocationLoaded(true);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm w-full"
            >
              Skip for Testing (No GPS)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show requesting permission state
  if (permissionState === 'requesting') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Requesting Location Access
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please allow location access when prompted by your browser.
          </p>
        </div>
      </div>
    );
  }

  // Show permission denied state
  if (permissionState === 'denied' || permissionDenied) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Location Permission Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            To track your routes, this app needs access to your location. Please enable location permissions in your browser settings and refresh the page.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Refresh Page
            </button>
            <button
              onClick={requestLocationPermission}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while getting initial location
  if (permissionState === 'granted' && !initialLocationLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading GPS location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-gray-100 p-4">
      {/* Debug Info Panel - Always on top */}
      <div className="mb-4 z-50 relative">
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="mb-3">
            <strong>🐛 DEBUG INFO:</strong><br />
            Permission: <span className="text-yellow-300 font-bold">{permissionState}</span><br />
            Loaded: <span className="text-green-300 font-bold">{initialLocationLoaded.toString()}</span><br />
            Tracking: <span className="text-blue-300 font-bold">{isTracking.toString()}</span><br />
            Current Position: <span className="text-purple-300">{currentPosition ? 'Available' : 'None'}</span>
          </div>
          <button 
            onClick={() => {
              console.log('🔄 Resetting to permission screen');
              setPermissionState('unknown');
              setInitialLocationLoaded(false);
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-bold"
          >
            🔄 Reset to Permission Screen
          </button>
        </div>
      </div>

      {/* Smaller Map for debugging */}
      <div className="h-64 w-full border-4 border-red-500 relative">
        <MapView
          center={mapCenter}
          zoom={15}
          routePoints={routePoints}
          currentPosition={currentPosition}
          followUser={followUser}
          mapType={mapType}
        />
      </div>

      {/* Show what should be rendered below map */}
      <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-500 rounded">
        <h3 className="font-bold mb-2">🔍 Component State Analysis:</h3>
        <p><strong>Should show permission screen:</strong> {String(permissionState) === 'unknown' ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Should show requesting screen:</strong> {String(permissionState) === 'requesting' ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Should show denied screen:</strong> {(String(permissionState) === 'denied' || permissionDenied) ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Should show loading screen:</strong> {(String(permissionState) === 'granted' && !initialLocationLoaded) ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Should show main GPS interface:</strong> {(String(permissionState) === 'granted' && initialLocationLoaded) ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Actual permission state type:</strong> {typeof permissionState}</p>
        <p><strong>Permission state value:</strong> &quot;{String(permissionState)}&quot;</p>
      </div>

      {/* Route Statistics */}
      <RouteStats
        totalDistance={totalDistance}
        elapsedTime={elapsedTime}
        currentSpeed={currentSpeed}
        averageSpeed={averageSpeed}
        isTracking={isTracking}
        isPaused={isPaused}
        accuracy={currentPosition?.coords.accuracy}
      />

      {/* Activity Controls */}
      <ActivityControls
        isTracking={isTracking}
        isPaused={isPaused}
        onStart={startTracking}
        onPause={pauseTracking}
        onResume={resumeTracking}
        onStop={stopTracking}
        onCenterMap={handleCenterMap}
        followUser={followUser}
        disabled={!!locationError}
      />

      {/* Map Type Selector */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
          {(['street', 'satellite', 'terrain'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`block w-full px-3 py-2 text-sm font-medium transition-colors ${
                mapType === type
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {locationError && !permissionDenied && (
        <div className="absolute top-20 left-4 right-4 z-20">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{locationError}</span>
            </div>
          </div>
        </div>
      )}

      {/* No GPS Signal Warning */}
      {isTracking && currentPosition && currentPosition.coords.accuracy > 50 && (
        <div className="absolute top-20 left-4 right-4 z-20">
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-sm">Poor GPS signal. Consider moving to an open area.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}