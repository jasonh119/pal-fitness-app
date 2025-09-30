'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useGPSStore } from '@/store/gpsStore';

export const useGPSTracking = () => {
  const store = useGPSStore();
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTracking = useCallback(async (_activityType: 'running' | 'cycling' | 'walking') => {
    if (!navigator.geolocation) {
      store.setError('Geolocation is not supported by this browser');
      return;
    }

    // Request permission first
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        store.setError('Location permission denied. Please enable location access.');
        return;
      }
    } catch {
      console.warn('Permission API not supported, proceeding with geolocation request');
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    };

    const onSuccess = (position: GeolocationPosition) => {
      // Filter out inaccurate readings (> 50m accuracy)
      if (position.coords.accuracy <= 50) {
        store.updatePosition(position);
      }
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'GPS Error: ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out';
          break;
        default:
          errorMessage += 'Unknown error occurred';
          break;
      }
      store.setError(errorMessage);
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
    watchIdRef.current = watchId;
    
    // Start the activity (activity type stored in session later)
    store.startTracking();
    
    // Start elapsed time timer
    timerRef.current = setInterval(() => {
      if (store.isTracking && !store.isPaused && store.startTime) {
        // Timer runs to maintain real-time updates
        // Elapsed time is calculated in the store
      }
    }, 1000);
  }, [store]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    store.stopTracking();
  }, [store]);

  const pauseTracking = useCallback(() => {
    store.pauseTracking();
  }, [store]);

  const resumeTracking = useCallback(() => {
    store.resumeTracking();
  }, [store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    isTracking: store.isTracking,
    isPaused: store.isPaused,
    currentPosition: store.currentPosition,
    routePoints: store.routePoints,
    totalDistance: store.totalDistance,
    currentSpeed: store.currentSpeed,
    averageSpeed: store.averageSpeed,
    elapsedTime: store.elapsedTime,
    locationError: store.locationError,
    permissionDenied: store.permissionDenied,
    mapCenter: store.mapCenter,
    followUser: store.followUser,
    setMapCenter: store.setMapCenter,
    toggleFollowUser: store.toggleFollowUser,
  };
};