'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SavedRoute } from '@/types/route';
import { useRouteStore } from '@/store/routeStore';
import RouteMap from './RouteMap';

interface RouteCardProps {
  route: SavedRoute;
}

export default function RouteCard({ route }: RouteCardProps) {
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { removeRoute, exportRoute } = useRouteStore();

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    return `${km.toFixed(2)} km`;
  };

  const formatPace = (metersPerSecond: number): string => {
    if (metersPerSecond === 0) return '0:00 /km';
    
    const secondsPerKm = 1000 / metersPerSecond;
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.floor(secondsPerKm % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  };

  const formatSpeed = (metersPerSecond: number): string => {
    const kmh = metersPerSecond * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'running':
        return '🏃';
      case 'cycling':
        return '🚴';
      case 'walking':
        return '🚶';
      default:
        return '📍';
    }
  };

  const handleDelete = async () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this route?')) {
      removeRoute(route.id);
    }
  };

  const handleExport = async (format: 'gpx' | 'json') => {
    setIsExporting(true);
    try {
      const data = await exportRoute(route.id, format);
      
      // Create download link
      const blob = new Blob([data], { 
        type: format === 'gpx' ? 'application/gpx+xml' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${route.name.replace(/\s+/g, '_')}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export route');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Map Preview */}
      <div 
        className="h-48 bg-gray-200 dark:bg-gray-700 cursor-pointer relative group"
        onClick={() => router.push(`/routes/${route.id}`)}
      >
        {showMap ? (
          <div onClick={(e) => e.stopPropagation()}>
            <RouteMap route={route} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-2 block">{getActivityIcon(route.activityType)}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to view details
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </div>

      {/* Route Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {route.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(route.startTime).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
            {route.activityType}
          </span>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatDistance(route.totalDistance)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatDuration(route.duration)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {route.activityType === 'cycling' ? 'Avg Speed' : 'Avg Pace'}
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {route.activityType === 'cycling' 
                ? formatSpeed(route.averageSpeed)
                : formatPace(route.averageSpeed)
              }
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Points</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {route.points.length}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExport('gpx');
            }}
            disabled={isExporting}
            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Export as GPX"
          >
            {isExporting ? 'Exporting...' : 'GPX'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExport('json');
            }}
            disabled={isExporting}
            className="flex-1 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Export as JSON"
          >
            JSON
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMap(!showMap);
            }}
            className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/20 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
            title="Toggle map preview"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            title="Delete route"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
