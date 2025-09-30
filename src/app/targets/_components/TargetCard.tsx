'use client';

import { Target } from '@/types/target';
import { useTargets } from './useTargets';
import TargetProgress from './TargetProgress';
import Link from 'next/link';

interface TargetCardProps {
  target: Target;
}

export default function TargetCard({ target }: TargetCardProps) {
  const { 
    getTargetTimeRemaining, 
    deleteTarget,
    updateTarget
  } = useTargets();

  const timeRemaining = getTargetTimeRemaining(target);
  const isCompleted = target.status === 'completed';
  const isExpired = timeRemaining <= 0 && target.status === 'active';

  const handlePauseResume = async () => {
    const newStatus = target.status === 'paused' ? 'active' : 'paused';
    await updateTarget(target.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this target?')) {
      await deleteTarget(target.id);
    }
  };

  const getStatusColor = () => {
    if (isCompleted) return 'border-green-500';
    if (isExpired) return 'border-red-500';
    if (target.status === 'paused') return 'border-yellow-500';
    return 'border-blue-500';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isExpired) return 'Expired';
    if (target.status === 'paused') return 'Paused';
    return 'Active';
  };

  const getTypeIcon = () => {
    switch (target.type) {
      case 'distance':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'time':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'activities':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'steps':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'calories':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${getStatusColor()}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-blue-500 dark:text-blue-400">
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {target.type} Target
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {target.period}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Status Badge */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              isCompleted 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : isExpired
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : target.status === 'paused'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {getStatusText()}
            </span>
            
            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              <div className="absolute right-0 top-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1 w-32">
                  {target.status !== 'completed' && (
                    <button
                      onClick={handlePauseResume}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {target.status === 'paused' ? 'Resume' : 'Pause'}
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <TargetProgress target={target} />
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
          <span>
            {target.currentValue.toLocaleString()} / {target.targetValue.toLocaleString()} {target.unit}
          </span>
          <span>
            {timeRemaining > 0 ? `${timeRemaining} days left` : 'Expired'}
          </span>
        </div>

        {/* Action Button */}
        <Link
          href={`/targets/${target.id}`}
          className="block w-full text-center py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}