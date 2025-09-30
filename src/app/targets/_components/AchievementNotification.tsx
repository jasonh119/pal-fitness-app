'use client';

import { Target } from '@/types/target';
import { useTargets } from './useTargets';

interface AchievementNotificationProps {
  target: Target;
}

export default function AchievementNotification({ target }: AchievementNotificationProps) {
  const { hideAchievementNotification } = useTargets();

  const handleClose = () => {
    hideAchievementNotification();
  };

  const handleShare = () => {
    // In a real app, this would implement social sharing
    if (navigator.share) {
      navigator.share({
        title: 'Achievement Unlocked!',
        text: `I just completed my ${target.type} target of ${target.targetValue} ${target.unit}!`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `I just completed my ${target.type} target of ${target.targetValue} ${target.unit}! 🎉`
      );
      alert('Achievement shared to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transform animate-pulse">
        {/* Celebration Animation */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🎉 Achievement Unlocked!
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
            You completed your {target.period} {target.type} target!
          </p>
          
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {target.targetValue.toLocaleString()} {target.unit}
          </p>
        </div>

        {/* Celebration Confetti Effect */}
        <div className="flex justify-center mb-6">
          <div className="text-4xl animate-bounce">
            🎊 🎉 🏆 🎉 🎊
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleShare}
            className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Share Achievement
          </button>
          
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}