'use client';

import { Target } from '@/types/target';
import { useTargets } from './useTargets';

interface TargetProgressProps {
  target: Target;
  showTooltip?: boolean;
}

export default function TargetProgress({ target, showTooltip = true }: TargetProgressProps) {
  const { calculateTargetProgress } = useTargets();
  
  const progress = calculateTargetProgress(target);
  const isCompleted = progress >= 100;
  
  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressBgColor = () => {
    if (isCompleted) return 'bg-green-100 dark:bg-green-900';
    return 'bg-gray-200 dark:bg-gray-700';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="relative group">
        <div className={`w-full h-3 md:h-4 rounded-full ${getProgressBgColor()}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {showTooltip && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            {target.currentValue.toLocaleString()} / {target.targetValue.toLocaleString()} {target.unit}
          </div>
        )}
      </div>
      
      {isCompleted && (
        <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Target achieved!
        </div>
      )}
    </div>
  );
}