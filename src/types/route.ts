import { GPSPoint } from './gps';

export interface SavedRoute {
  id: string;
  name: string;
  points: GPSPoint[];
  totalDistance: number;
  duration: number;
  averageSpeed: number;
  startTime: Date;
  endTime: Date;
  activityType: 'running' | 'cycling' | 'walking';
  createdAt: Date;
}

export interface RouteSegment {
  start: GPSPoint;
  end: GPSPoint;
  distance: number;
  duration: number;
  averageSpeed: number;
}

export interface RouteStore {
  routes: SavedRoute[];
  selectedRoute: SavedRoute | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addRoute: (route: SavedRoute) => void;
  removeRoute: (routeId: string) => void;
  selectRoute: (routeId: string | null) => void;
  loadRoutes: () => Promise<void>;
  exportRoute: (routeId: string, format: 'gpx' | 'json') => Promise<string>;
}