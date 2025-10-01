// Script to add sample historical route data
import { SavedRoute } from '../src/types/route';
import { GPSPoint } from '../src/types/gps';

// Helper to generate GPS points along a path
function generateRoutePoints(
  startLat: number,
  startLng: number,
  distance: number, // in meters
  bearing: number, // initial direction in degrees
  variance: number = 0.0001 // randomness
): GPSPoint[] {
  const points: GPSPoint[] = [];
  const numPoints = Math.floor(distance / 10); // Point every 10 meters
  const earthRadius = 6371000; // Earth's radius in meters
  
  let currentLat = startLat;
  let currentLng = startLng;
  
  for (let i = 0; i < numPoints; i++) {
    // Add some randomness to create a more realistic path
    const randomBearing = bearing + (Math.random() - 0.5) * 30;
    const stepDistance = 10; // 10 meters per step
    
    // Calculate new position using Haversine
    const bearingRad = (randomBearing * Math.PI) / 180;
    const lat1Rad = (currentLat * Math.PI) / 180;
    const lng1Rad = (currentLng * Math.PI) / 180;
    
    const lat2Rad = Math.asin(
      Math.sin(lat1Rad) * Math.cos(stepDistance / earthRadius) +
      Math.cos(lat1Rad) * Math.sin(stepDistance / earthRadius) * Math.cos(bearingRad)
    );
    
    const lng2Rad = lng1Rad + Math.atan2(
      Math.sin(bearingRad) * Math.sin(stepDistance / earthRadius) * Math.cos(lat1Rad),
      Math.cos(stepDistance / earthRadius) - Math.sin(lat1Rad) * Math.sin(lat2Rad)
    );
    
    currentLat = (lat2Rad * 180) / Math.PI;
    currentLng = (lng2Rad * 180) / Math.PI;
    
    points.push({
      latitude: currentLat + (Math.random() - 0.5) * variance,
      longitude: currentLng + (Math.random() - 0.5) * variance,
      timestamp: new Date(Date.now() + i * 1000),
      accuracy: 5 + Math.random() * 10,
      altitude: 50 + Math.random() * 20,
      speed: undefined,
    });
  }
  
  return points;
}

// Sample routes data
const sampleRoutes: Omit<SavedRoute, 'id'>[] = [
  // Run 1 - Morning jog (2 weeks ago)
  {
    name: 'Morning Run - Marina Bay',
    activityType: 'running',
    totalDistance: 5200,
    duration: 1560, // 26 minutes
    averageSpeed: 3.33, // ~5 min/km pace
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000), // 7 AM, 14 days ago
    endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 1560000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    points: generateRoutePoints(1.3521, 103.8198, 5200, 45),
  },
  
  // Ride 1 - Cycling along East Coast (12 days ago)
  {
    name: 'East Coast Ride',
    activityType: 'cycling',
    totalDistance: 15000,
    duration: 2700, // 45 minutes
    averageSpeed: 5.56, // ~20 km/h
    startTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 4 PM, 12 days ago
    endTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000 + 2700000),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    points: generateRoutePoints(1.3048, 103.9180, 15000, 90),
  },
  
  // Run 2 - Evening run (9 days ago)
  {
    name: 'Evening Interval Run',
    activityType: 'running',
    totalDistance: 8000,
    duration: 2280, // 38 minutes
    averageSpeed: 3.51, // ~4:45 min/km pace
    startTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 6 PM, 9 days ago
    endTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000 + 2280000),
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    points: generateRoutePoints(1.3000, 103.8500, 8000, 180),
  },
  
  // Ride 2 - Weekend cycling (5 days ago)
  {
    name: 'Weekend Long Ride',
    activityType: 'cycling',
    totalDistance: 25000,
    duration: 4500, // 75 minutes
    averageSpeed: 5.56, // ~20 km/h
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 AM, 5 days ago
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 4500000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    points: generateRoutePoints(1.3700, 103.8000, 25000, 270),
  },
  
  // Run 3 - Recent morning run (2 days ago)
  {
    name: 'Recovery Run - Gardens',
    activityType: 'running',
    totalDistance: 3500,
    duration: 1260, // 21 minutes
    averageSpeed: 2.78, // ~6 min/km easy pace
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 AM, 2 days ago
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 1260000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    points: generateRoutePoints(1.2818, 103.8636, 3500, 135),
  },
];

// Function to add routes to localStorage
function addSampleRoutes() {
  if (typeof window === 'undefined') {
    console.log('This script must be run in a browser environment');
    return;
  }
  
  const routesWithIds: SavedRoute[] = sampleRoutes.map((route, index) => ({
    ...route,
    id: `sample-${Date.now()}-${index}`,
  }));
  
  // Get existing routes
  const existingRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
  
  // Add new routes
  const allRoutes = [...routesWithIds, ...existingRoutes];
  
  localStorage.setItem('savedRoutes', JSON.stringify(allRoutes));
  
  console.log(`✅ Added ${routesWithIds.length} sample routes`);
  console.log('Routes:', routesWithIds.map(r => `${r.name} (${r.activityType})`));
  
  return routesWithIds;
}

// Export for browser console or module usage
if (typeof window !== 'undefined') {
  (window as any).addSampleRoutes = addSampleRoutes;
}

export { addSampleRoutes, sampleRoutes };
