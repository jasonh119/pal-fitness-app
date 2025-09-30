'use client';

import { formatDistance, formatDuration, speedConverter } from '@/utils/gpsCalculations';

interface RouteStatsProps {
  totalDistance: number;
  elapsedTime: number;
  currentSpeed: number;
  averageSpeed: number;
  isTracking: boolean;
  isPaused: boolean;
  accuracy?: number;
}

export default function RouteStats({
  totalDistance,
  elapsedTime,
  currentSpeed,
  averageSpeed,
  isTracking,
  isPaused,
  accuracy
}: RouteStatsProps) {
  if (!isTracking) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        {/* Status Indicator */}
        <div className="flex items-center justify-center mb-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            isPaused 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'
            }`}></div>
            <span>{isPaused ? 'Paused' : 'Recording'}</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Distance */}
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {formatDistance(totalDistance)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              DISTANCE
            </div>
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {formatDuration(elapsedTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              TIME
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Current Pace */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentSpeed > 0 ? speedConverter.toPaceMinPerKm(currentSpeed).toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              MIN/KM
            </div>
          </div>

          {/* Average Pace */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {averageSpeed > 0 ? speedConverter.toPaceMinPerKm(averageSpeed).toFixed(1) : '--'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              AVG MIN/KM
            </div>
          </div>
        </div>

        {/* GPS Accuracy Indicator */}
        {accuracy && (
          <div className="mt-3 text-center">
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs ${
              accuracy <= 10 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : accuracy <= 25 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                accuracy <= 10 ? 'bg-green-500' : accuracy <= 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>GPS: ±{accuracy.toFixed(0)}m</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}