'use client';

import { useCallback, useEffect } from 'react';
import { useTargetStore } from '@/store/targetStore';
import { Target, CreateTargetData } from '@/types/target';
import { calculateProgress, getTimeRemaining } from '@/utils/targetCalculations';

export const useTargets = () => {
  const store = useTargetStore();

  useEffect(() => {
    // Fetch initial targets
    store.fetchTargets();
    
    // Set up real-time progress updates (mock implementation)
    const progressInterval = setInterval(() => {
      store.targets.forEach(target => {
        if (target.status === 'active') {
          // In a real app, this would calculate progress from actual activity data
          // For now, we'll simulate small progress updates
          const currentProgress = target.currentValue;
          const randomIncrease = Math.random() * 0.1; // Small random increase
          const newProgress = Math.min(currentProgress + randomIncrease, target.targetValue);
          
          if (newProgress !== currentProgress && Math.random() > 0.95) { // 5% chance of update
            store.updateProgress(target.id, newProgress);
          }
        }
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(progressInterval);
  }, []); // Empty dependency array is intentional - we want this to run only once

  const createTarget = useCallback(async (targetData: CreateTargetData) => {
    try {
      await store.createTarget(targetData);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to create target:', error);
      return { success: false, error: 'Failed to create target' };
    }
  }, [store.createTarget]);

  const updateTarget = useCallback(async (id: string, updates: Partial<Target>) => {
    try {
      await store.updateTarget(id, updates);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update target:', error);
      return { success: false, error: 'Failed to update target' };
    }
  }, [store.updateTarget]);

  const deleteTarget = useCallback(async (id: string) => {
    try {
      await store.deleteTarget(id);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to delete target:', error);
      return { success: false, error: 'Failed to delete target' };
    }
  }, [store.deleteTarget]);

  const getFilteredTargets = useCallback(() => {
    const { targets, activeFilter } = store;
    
    switch (activeFilter) {
      case 'active':
        return targets.filter(target => target.status === 'active');
      case 'completed':
        return targets.filter(target => target.status === 'completed');
      default:
        return targets;
    }
  }, [store.targets, store.activeFilter]);

  const getTargetById = useCallback((id: string) => {
    return store.targets.find(target => target.id === id);
  }, [store.targets]);

  const calculateTargetProgress = useCallback((target: Target) => {
    return calculateProgress(target);
  }, []);

  const getTargetTimeRemaining = useCallback((target: Target) => {
    return getTimeRemaining(target);
  }, []);

  const validateTargetForm = useCallback((data: Partial<CreateTargetData>) => {
    const errors: Record<string, string> = {};

    if (!data.type) {
      errors.type = 'Target type is required';
    }

    if (!data.period) {
      errors.period = 'Target period is required';
    }

    if (!data.targetValue || data.targetValue <= 0) {
      errors.targetValue = 'Target value must be greater than 0';
    }

    if (data.targetValue && data.targetValue > 999999) {
      errors.targetValue = 'Target value is too large';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  return {
    // State
    ...store,
    filteredTargets: getFilteredTargets(),

    // Actions
    createTarget,
    updateTarget,
    deleteTarget,
    getTargetById,
    calculateTargetProgress,
    getTargetTimeRemaining,
    validateTargetForm,
  };
};