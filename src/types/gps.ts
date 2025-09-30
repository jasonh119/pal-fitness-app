export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy: number;
  altitude?: number;
  speed?: number;
}

export interface GPSTrackingState {
  // Tracking States
  isTracking: boolean;
  isPaused: boolean;
  isAutoLocked: boolean;
  
  // Location Data
  currentPosition: GeolocationPosition | null;
  routePoints: GPSPoint[];
  accuracy: number;
  
  // Activity Data
  startTime: Date | null;
  elapsedTime: number;
  totalDistance: number;
  currentSpeed: number;
  averageSpeed: number;
  
  // Map States
  mapCenter: [number, number];
  zoomLevel: number;
  followUser: boolean;
  mapType: 'street' | 'satellite' | 'terrain';
  
  // Error States
  locationError: string | null;
  permissionDenied: boolean;
}

export interface ActivitySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  isPaused: boolean;
  route: GPSPoint[];
  totalDistance: number;
  duration: number;
  activityType: 'running' | 'cycling' | 'walking';
}

export interface GPSTrackingStore extends GPSTrackingState {
  // Actions
  startTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => void;
  updatePosition: (position: GeolocationPosition) => void;
  setMapCenter: (center: [number, number]) => void;
  toggleFollowUser: () => void;
  setError: (error: string | null) => void;
  clearRoute: () => void;
}