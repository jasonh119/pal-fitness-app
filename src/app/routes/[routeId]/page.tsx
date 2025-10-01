'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRouteStore } from '@/store/routeStore';
import RouteMap from '../_components/RouteMap';

export default function RouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { loadRoutes, selectRoute, selectedRoute, removeRoute, exportRoute } = useRouteStore();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  useEffect(() => {
    if (params.routeId) {
      selectRoute(params.routeId as string);
    }
  }, [params.routeId, selectRoute]);

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

  const handleDelete = async () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this route?')) {
      removeRoute(params.routeId as string);
      router.push('/routes');
    }
  };

  const handleExport = async (format: 'gpx' | 'json') => {
    setIsExporting(true);
    try {
      const data = await exportRoute(params.routeId as string, format);
      
      // Create download link
      const blob = new Blob([data], { 
        type: format === 'gpx' ? 'application/gpx+xml' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedRoute?.name.replace(/\s+/g, '_')}.${format}`;
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

  if (!selectedRoute) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading route...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/routes')}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Routes
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedRoute.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(selectedRoute.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} at {new Date(selectedRoute.startTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
              {selectedRoute.activityType}
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="h-96">
            <RouteMap route={selectedRoute} interactive={true} />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Distance
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatDistance(selectedRoute.totalDistance)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Duration
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatDuration(selectedRoute.duration)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {selectedRoute.activityType === 'cycling' ? 'Avg Speed' : 'Avg Pace'}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedRoute.activityType === 'cycling' 
                ? formatSpeed(selectedRoute.averageSpeed)
                : formatPace(selectedRoute.averageSpeed)
              }
            </p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Route Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">GPS Points</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedRoute.points.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(selectedRoute.startTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">End Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(selectedRoute.endTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedRoute.activityType === 'cycling' ? 'Speed' : 'Pace'}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedRoute.activityType === 'cycling' 
                  ? formatSpeed(selectedRoute.averageSpeed)
                  : formatPace(selectedRoute.averageSpeed)
                }
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => handleExport('gpx')}
            disabled={isExporting}
            className="flex-1 px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? 'Exporting...' : 'Export as GPX'}
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex-1 px-6 py-3 text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Export as JSON
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete Route
          </button>
        </div>
      </div>
    </div>
  );
}
