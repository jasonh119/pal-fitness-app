import { GPSPoint } from '@/types/gps';

/**
 * Calculate distance between two GPS points using Haversine formula
 * @param point1 First GPS point
 * @param point2 Second GPS point
 * @returns Distance in meters
 */
export function calculateDistance(point1: GPSPoint, point2: GPSPoint): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate total distance of a route
 * @param points Array of GPS points
 * @returns Total distance in meters
 */
export function calculateRouteDistance(points: GPSPoint[]): number {
  if (points.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += calculateDistance(points[i - 1], points[i]);
  }
  
  return totalDistance;
}

/**
 * Calculate speed between two GPS points
 * @param point1 First GPS point
 * @param point2 Second GPS point
 * @returns Speed in m/s
 */
export function calculateSpeed(point1: GPSPoint, point2: GPSPoint): number {
  const distance = calculateDistance(point1, point2);
  const timeDiff = (point2.timestamp.getTime() - point1.timestamp.getTime()) / 1000; // seconds
  
  if (timeDiff === 0) return 0;
  return distance / timeDiff;
}

/**
 * Calculate average speed for a route
 * @param points Array of GPS points
 * @returns Average speed in m/s
 */
export function calculateAverageSpeed(points: GPSPoint[]): number {
  if (points.length < 2) return 0;
  
  const totalDistance = calculateRouteDistance(points);
  const totalTime = (points[points.length - 1].timestamp.getTime() - points[0].timestamp.getTime()) / 1000;
  
  if (totalTime === 0) return 0;
  return totalDistance / totalTime;
}

/**
 * Convert speed from m/s to various units
 */
export const speedConverter = {
  toKmh: (speedMs: number) => speedMs * 3.6,
  toMph: (speedMs: number) => speedMs * 2.237,
  toPaceMinPerKm: (speedMs: number) => speedMs > 0 ? 1000 / (speedMs * 60) : 0,
  toPaceMinPerMile: (speedMs: number) => speedMs > 0 ? 1609.34 / (speedMs * 60) : 0,
};

/**
 * Format distance for display
 * @param meters Distance in meters
 * @param unit Preferred unit
 * @returns Formatted distance string
 */
export function formatDistance(meters: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    const miles = meters * 0.000621371;
    return miles >= 1 ? `${miles.toFixed(2)} mi` : `${(meters * 3.28084).toFixed(0)} ft`;
  }
  
  return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters.toFixed(0)} m`;
}

/**
 * Format time duration
 * @param seconds Duration in seconds
 * @returns Formatted time string (HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Filter GPS points by accuracy threshold
 * @param points Array of GPS points
 * @param maxAccuracy Maximum allowed accuracy in meters
 * @returns Filtered GPS points
 */
export function filterByAccuracy(points: GPSPoint[], maxAccuracy: number = 50): GPSPoint[] {
  return points.filter(point => point.accuracy <= maxAccuracy);
}

/**
 * Smooth GPS points to reduce noise
 * @param points Array of GPS points
 * @param windowSize Number of points to average
 * @returns Smoothed GPS points
 */
export function smoothGPSPoints(points: GPSPoint[], windowSize: number = 3): GPSPoint[] {
  if (points.length < windowSize) return points;
  
  const smoothed: GPSPoint[] = [];
  
  for (let i = 0; i < points.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(points.length, start + windowSize);
    const window = points.slice(start, end);
    
    const avgLat = window.reduce((sum, p) => sum + p.latitude, 0) / window.length;
    const avgLng = window.reduce((sum, p) => sum + p.longitude, 0) / window.length;
    const avgAccuracy = window.reduce((sum, p) => sum + p.accuracy, 0) / window.length;
    
    smoothed.push({
      ...points[i],
      latitude: avgLat,
      longitude: avgLng,
      accuracy: avgAccuracy,
    });
  }
  
  return smoothed;
}