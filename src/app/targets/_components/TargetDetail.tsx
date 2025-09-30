'use client';

import { useTargets } from './useTargets';
import TargetProgress from './TargetProgress';
import ProgressChart from './ProgressChart';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface TargetDetailProps {
  targetId: string;
}

export default function TargetDetail({ targetId }: TargetDetailProps) {
  const { 
    getTargetById, 
    calculateTargetProgress, 
    getTargetTimeRemaining,
    updateTarget,
    deleteTarget
  } = useTargets();

  const target = getTargetById(targetId);

  if (!target) {
    notFound();
  }

  const progress = calculateTargetProgress(target);
  const timeRemaining = getTargetTimeRemaining(target);
  const isCompleted = target.status === 'completed';
  const isExpired = timeRemaining <= 0 && target.status === 'active';

  const handleStatusUpdate = async (status: 'active' | 'paused' | 'completed') => {
    await updateTarget(target.id, { 
      status,
      completedAt: status === 'completed' ? new Date() : target.completedAt
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this target? This action cannot be undone.')) {
      const result = await deleteTarget(target.id);
      if (result.success) {
        window.location.href = '/targets';
      }
    }
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600 dark:text-green-400';
    if (isExpired) return 'text-red-600 dark:text-red-400';
    if (target.status === 'paused') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isExpired) return 'Expired';
    if (target.status === 'paused') return 'Paused';
    return 'Active';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/targets"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Targets
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize mb-2">
            {target.type} Target
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="capitalize">{target.period}</span>
            <span>•</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span>•</span>
            <span>
              {timeRemaining > 0 ? `${timeRemaining} days remaining` : 'Expired'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {target.status !== 'completed' && (
            <>
              {target.status === 'paused' ? (
                <button
                  onClick={() => handleStatusUpdate('active')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Resume
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate('paused')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Pause
                </button>
              )}
              
              {progress >= 100 && (
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </>
          )}
          
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Progress Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Progress Overview
          </h2>
          
          <div className="space-y-6">
            <TargetProgress target={target} showTooltip={false} />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {target.currentValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Current
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(target.targetValue - target.currentValue).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Remaining
                </div>
              </div>
            </div>

            {isCompleted && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <div>
                    <h3 className="text-green-800 dark:text-green-200 font-medium">
                      Congratulations! 🎉
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      You&apos;ve achieved your target of {target.targetValue.toLocaleString()} {target.unit}!
                      {target.completedAt && (
                        <> Completed on {target.completedAt.toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Target Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-300">Type</dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {target.type}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-300">Period</dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {target.period}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-300">Target</dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {target.targetValue.toLocaleString()} {target.unit}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-300">Start Date</dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {target.startDate.toLocaleDateString()}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-300">End Date</dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {target.endDate.toLocaleDateString()}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-300">Created</dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {target.createdAt.toLocaleDateString()}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Progress Timeline
        </h2>
        <ProgressChart target={target} />
      </div>
    </div>
  );
}