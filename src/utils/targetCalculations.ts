import { Target, TargetPeriod, TargetType } from '@/types/target';

/**
 * Calculate the progress percentage for a target
 */
export const calculateProgress = (target: Target): number => {
  if (target.targetValue === 0) return 0;
  return Math.min((target.currentValue / target.targetValue) * 100, 100);
};

/**
 * Calculate the time remaining for a target
 */
export const getTimeRemaining = (target: Target): number => {
  const now = new Date();
  // Ensure endDate is a Date object
  const endDate = target.endDate instanceof Date ? target.endDate : new Date(target.endDate);
  const timeLeft = endDate.getTime() - now.getTime();
  return Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
};

/**
 * Get the end date for a target based on period
 */
export const calculateEndDate = (startDate: Date | string, period: TargetPeriod): Date => {
  // Ensure startDate is a Date object
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const endDate = new Date(start);
  
  if (period === 'weekly') {
    endDate.setDate(endDate.getDate() + 7);
  } else if (period === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  
  // Set to end of day
  endDate.setHours(23, 59, 59, 999);
  return endDate;
};

/**
 * Get the default unit for a target type
 */
export const getDefaultUnit = (type: TargetType): string => {
  switch (type) {
    case 'distance':
      return 'km';
    case 'time':
      return 'minutes';
    case 'activities':
      return 'activities';
    case 'steps':
      return 'steps';
    case 'calories':
      return 'calories';
    default:
      return '';
  }
};

/**
 * Format target value with appropriate unit
 */
export const formatTargetValue = (value: number, unit: string): string => {
  if (unit === 'minutes') {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
  
  return `${value.toLocaleString()} ${unit}`;
};

/**
 * Check if a target is expired
 */
export const isTargetExpired = (target: Target): boolean => {
  return new Date() > target.endDate && target.status === 'active';
};

/**
 * Check if a target is completed
 */
export const isTargetCompleted = (target: Target): boolean => {
  return target.currentValue >= target.targetValue || target.status === 'completed';
};

/**
 * Generate a mock target ID (for development)
 */
export const generateTargetId = (): string => {
  return `target-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};