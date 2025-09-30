'use client';

import { useTargets } from './useTargets';
import TargetProgress from './TargetProgress';

export default function TargetHistory() {
  const { targets, isLoading } = useTargets();
  
  // Get completed targets sorted by completion date
  const completedTargets = targets
    .filter(target => target.status === 'completed')
    .sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return b.completedAt.getTime() - a.completedAt.getTime();
    });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (completedTargets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No completed targets yet
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Complete some targets to see your achievement history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Achievement History
      </h2>
      
      <div className="space-y-4">
        {completedTargets.map((target) => (
          <div
            key={target.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-green-500 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {target.type} Target
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {target.period} • Completed {target.completedAt?.toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center text-green-600 dark:text-green-400">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>

            <div className="mb-4">
              <TargetProgress target={target} showTooltip={false} />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Target:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {target.targetValue.toLocaleString()} {target.unit}
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 dark:text-gray-400">Achieved:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {target.currentValue.toLocaleString()} {target.unit}
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {target.completedAt && target.startDate
                    ? Math.ceil((target.completedAt.getTime() - target.startDate.getTime()) / (1000 * 60 * 60 * 24))
                    : 0
                  } days
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}