'use client';

import { useState } from 'react';
import { Play, Pause, Square, Navigation } from 'lucide-react';

interface ActivityControlsProps {
  isTracking: boolean;
  isPaused: boolean;
  onStart: (activityType: 'running' | 'cycling' | 'walking') => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onCenterMap: () => void;
  followUser: boolean;
  disabled?: boolean;
}

export default function ActivityControls({
  isTracking,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  onCenterMap,
  followUser,
  disabled = false
}: ActivityControlsProps) {
  const [activityType, setActivityType] = useState<'running' | 'cycling' | 'walking'>('running');
  const [showConfirmStop, setShowConfirmStop] = useState(false);

  const handleStart = () => {
    onStart(activityType);
  };

  const handleStop = () => {
    if (showConfirmStop) {
      onStop();
      setShowConfirmStop(false);
    } else {
      setShowConfirmStop(true);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setShowConfirmStop(false), 3000);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  if (!isTracking) {
    return (
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          {/* Activity Type Selection */}
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(['running', 'cycling', 'walking'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivityType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activityType === type
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStart}
              disabled={disabled}
              className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full shadow-lg transition-colors"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Map Controls */}
          <button
            onClick={onCenterMap}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors ${
              followUser
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Navigation className={`w-6 h-6 ${followUser ? 'text-white' : ''}`} />
          </button>

          {/* Activity Controls */}
          <div className="flex items-center space-x-4">
            {/* Pause/Resume Button */}
            <button
              onClick={handlePauseResume}
              disabled={disabled}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors ${
                isPaused
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              } disabled:bg-gray-400`}
            >
              {isPaused ? <Play className="w-6 h-6 ml-1" /> : <Pause className="w-6 h-6" />}
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              disabled={disabled}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors ${
                showConfirmStop
                  ? 'bg-red-600 animate-pulse'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white disabled:bg-gray-400`}
            >
              <Square className="w-6 h-6" />
            </button>
          </div>

          {/* Placeholder for symmetry */}
          <div className="w-12 h-12"></div>
        </div>

        {/* Confirmation Message */}
        {showConfirmStop && (
          <div className="mt-2 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Tap again to stop activity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}