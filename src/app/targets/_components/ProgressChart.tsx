'use client';

import { Target } from '@/types/target';

interface ProgressChartProps {
  target: Target;
}

export default function ProgressChart({ target }: ProgressChartProps) {
  // Mock data for the chart - in a real app, this would come from actual progress history
  const generateMockData = () => {
    const days = [];
    const startDate = new Date(target.startDate);
    const today = new Date();
    const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= Math.min(totalDays, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Simulate progressive increase towards current value
      const progressRatio = i / totalDays;
      const value = target.currentValue * progressRatio + (Math.random() * 0.1 - 0.05) * target.targetValue;
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.max(0, Math.min(value, target.targetValue)),
        percentage: Math.min((value / target.targetValue) * 100, 100)
      });
    }
    
    return days;
  };

  const chartData = generateMockData();
  const maxValue = target.targetValue;
  const chartHeight = 200;

  return (
    <div className="space-y-4">
      {/* Chart Container */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 w-12">
          <span>{maxValue.toLocaleString()}</span>
          <span>{Math.round(maxValue * 0.75).toLocaleString()}</span>
          <span>{Math.round(maxValue * 0.5).toLocaleString()}</span>
          <span>{Math.round(maxValue * 0.25).toLocaleString()}</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="ml-14 relative" style={{ height: chartHeight }}>
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <div
                key={ratio}
                className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                style={{ top: `${(1 - ratio) * 100}%` }}
              />
            ))}
          </div>

          {/* Target line */}
          <div className="absolute w-full border-t-2 border-dashed border-green-500 dark:border-green-400" style={{ top: '0%' }}>
            <span className="absolute right-0 -top-2 text-xs text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 px-1">
              Target
            </span>
          </div>

          {/* Progress Line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={chartData
                .map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - (point.value / maxValue) * 100;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            
            {/* Data points */}
            {chartData.map((point, index) => {
              const x = (index / (chartData.length - 1)) * 100;
              const y = 100 - (point.value / maxValue) * 100;
              
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="rgb(59, 130, 246)"
                  className="hover:r-6 transition-all duration-200 cursor-pointer"
                >
                  <title>{`${point.date}: ${point.value.toFixed(1)} ${target.unit}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="ml-14 flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          {chartData.filter((_, index) => index % Math.ceil(chartData.length / 6) === 0).map((point, index) => (
            <span key={index}>{point.date}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-300">Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-green-500 border-dashed mr-2"></div>
          <span className="text-gray-600 dark:text-gray-300">Target</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {Math.round((target.currentValue / target.targetValue) * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Complete</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {target.currentValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Current</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {(target.targetValue - target.currentValue).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Remaining</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {target.targetValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Target</div>
        </div>
      </div>
    </div>
  );
}