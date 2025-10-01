import { create } from 'zustand';
import { GPSTrackingStore, GPSPoint } from '@/types/gps';
import { SavedRoute } from '@/types/route';
import { calculateDistance, calculateSpeed } from '@/utils/gpsCalculations';

const initialState = {
  // Tracking States
  isTracking: false,
  isPaused: false,
  isAutoLocked: false,
  
  // Location Data
  currentPosition: null,
  routePoints: [],
  accuracy: 0,
  
  // Activity Data
  startTime: null,
  elapsedTime: 0,
  totalDistance: 0,
  currentSpeed: 0,
  averageSpeed: 0,
  
  // Map States
  mapCenter: [1.3521, 103.8198] as [number, number], // Default to Singapore (Marina Bay area)
  zoomLevel: 15,
  followUser: true,
  mapType: 'street' as const,
  
  // Error States
  locationError: null,
  permissionDenied: false,
};

export const useGPSStore = create<GPSTrackingStore>((set, get) => ({
  ...initialState,

  startTracking: () => {
    const now = new Date();
    set({
      isTracking: true,
      isPaused: false,
      startTime: now,
      elapsedTime: 0,
      totalDistance: 0,
      routePoints: [],
      locationError: null,
    });
  },

  pauseTracking: () => {
    set({ isPaused: true });
  },

  resumeTracking: () => {
    set({ isPaused: false });
  },

  stopTracking: () => {
    const state = get();
    
    // Save the route if there are points
    if (state.routePoints.length > 0) {
      const now = new Date();
      const route: SavedRoute = {
        id: Date.now().toString(),
        name: `${state.routePoints.length > 0 ? 'Running' : 'Activity'} - ${now.toLocaleDateString()}`,
        points: state.routePoints,
        totalDistance: state.totalDistance,
        duration: state.elapsedTime,
        averageSpeed: state.averageSpeed,
        startTime: state.startTime!,
        endTime: now,
        activityType: 'running', // Default, could be made dynamic
        createdAt: now,
      };
      
      // Store in the new format
      const savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
      savedRoutes.unshift(route); // Add to beginning of array
      localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
    }
    
    set({
      ...initialState,
      mapCenter: state.mapCenter, // Keep current map center
    });
  },

  updatePosition: (position: GeolocationPosition) => {
    const state = get();
    
    if (!state.isTracking || state.isPaused) return;
    
    const newPoint: GPSPoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: new Date(),
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude ?? undefined,
      speed: position.coords.speed ?? undefined,
    };
    
    const updatedPoints = [...state.routePoints, newPoint];
    
    // Calculate new distance and speed
    let newDistance = state.totalDistance;
    let currentSpeed = 0;
    
    if (state.routePoints.length > 0) {
      const lastPoint = state.routePoints[state.routePoints.length - 1];
      const segmentDistance = calculateDistance(lastPoint, newPoint);
      newDistance += segmentDistance;
      currentSpeed = calculateSpeed(lastPoint, newPoint);
    }
    
    // Calculate elapsed time
    const elapsedTime = state.startTime 
      ? (newPoint.timestamp.getTime() - state.startTime.getTime()) / 1000 
      : 0;
    
    // Calculate average speed
    const averageSpeed = elapsedTime > 0 ? newDistance / elapsedTime : 0;
    
    set({
      currentPosition: position,
      routePoints: updatedPoints,
      accuracy: position.coords.accuracy,
      totalDistance: newDistance,
      currentSpeed,
      averageSpeed,
      elapsedTime,
      mapCenter: state.followUser 
        ? [position.coords.latitude, position.coords.longitude]
        : state.mapCenter,
      locationError: null,
    });
  },

  setMapCenter: (center: [number, number]) => {
    set({ mapCenter: center, followUser: false });
  },

  toggleFollowUser: () => {
    const state = get();
    const newFollowUser = !state.followUser;
    
    set({
      followUser: newFollowUser,
      mapCenter: newFollowUser && state.currentPosition
        ? [state.currentPosition.coords.latitude, state.currentPosition.coords.longitude]
        : state.mapCenter,
    });
  },

  setError: (error: string | null) => {
    set({ 
      locationError: error,
      permissionDenied: error?.includes('permission') || error?.includes('denied') || false,
    });
  },

  clearRoute: () => {
    set({
      routePoints: [],
      totalDistance: 0,
      elapsedTime: 0,
      currentSpeed: 0,
      averageSpeed: 0,
    });
  },
}));