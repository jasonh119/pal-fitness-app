import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Target, Achievement, TargetState, CreateTargetData } from '@/types/target';
import { generateTargetId, calculateEndDate, getDefaultUnit } from '@/utils/targetCalculations';

// Helper function to ensure all dates are Date objects
const normalizeTarget = (target: Target | (Omit<Target, 'startDate' | 'endDate' | 'createdAt' | 'completedAt'> & {
  startDate: string | Date;
  endDate: string | Date;
  createdAt: string | Date;
  completedAt?: string | Date;
})): Target => ({
  ...target,
  startDate: target.startDate instanceof Date ? target.startDate : new Date(target.startDate),
  endDate: target.endDate instanceof Date ? target.endDate : new Date(target.endDate),
  createdAt: target.createdAt instanceof Date ? target.createdAt : new Date(target.createdAt),
  completedAt: target.completedAt ? 
    (target.completedAt instanceof Date ? target.completedAt : new Date(target.completedAt)) : 
    undefined,
});

const normalizeAchievement = (achievement: Achievement | (Omit<Achievement, 'achievedAt'> & {
  achievedAt: string | Date;
})): Achievement => ({
  ...achievement,
  achievedAt: achievement.achievedAt instanceof Date ? achievement.achievedAt : new Date(achievement.achievedAt),
});

interface TargetStore extends TargetState {
  // Actions
  fetchTargets: () => Promise<void>;
  createTarget: (target: CreateTargetData) => Promise<void>;
  updateTarget: (id: string, updates: Partial<Target>) => Promise<void>;
  deleteTarget: (id: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  setSelectedTarget: (target: Target | null) => void;
  setActiveFilter: (filter: 'all' | 'active' | 'completed') => void;
  setFormData: (data: Partial<Target>) => void;
  clearFormData: () => void;
  setFormErrors: (errors: Record<string, string>) => void;
  showAchievementNotification: (target: Target) => void;
  hideAchievementNotification: () => void;
}

// Mock data for development
const mockTargets: Target[] = [
  {
    id: 'target-1',
    userId: 'user-123',
    type: 'distance',
    period: 'weekly',
    targetValue: 50,
    currentValue: 32.5,
    unit: 'km',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'target-2',
    userId: 'user-123',
    type: 'activities',
    period: 'monthly',
    targetValue: 20,
    currentValue: 15,
    unit: 'activities',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

const mockAchievements: Achievement[] = [
  {
    id: 'achievement-1',
    targetId: 'target-1',
    userId: 'user-123',
    achievedAt: new Date('2025-09-25T10:00:00.000Z'),
    type: 'distance',
    value: 50,
    celebrated: true
  }
];

export const useTargetStore = create<TargetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoading: false,
      isCreating: false,
      showAchievement: false,
      activeFilter: 'all',
      targets: [],
      selectedTarget: null,
      achievements: [],
      createFormData: {},
      formErrors: {},
      isDirty: false,

  // Actions
  fetchTargets: async () => {
    console.log('Fetching targets...'); // Debug log
    set({ isLoading: true });
    try {
      // Check if we already have persisted data
      const { targets } = get();
      if (targets && targets.length > 0) {
        console.log('Using persisted targets:', targets);
        // Normalize dates in case they were stored as strings
        const normalizedTargets = targets.map(normalizeTarget);
        set({ targets: normalizedTargets, isLoading: false });
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay
      
      console.log('Setting mock targets:', mockTargets); // Debug log
      // For now, use mock data only if no persisted data exists
      set({ 
        targets: mockTargets,
        achievements: mockAchievements,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch targets:', error);
      set({ isLoading: false });
    }
  },  createTarget: async (targetData: CreateTargetData) => {
    set({ isCreating: true });
    try {
      const startDate = targetData.startDate || new Date();
      const endDate = calculateEndDate(startDate, targetData.period);
      const unit = targetData.unit || getDefaultUnit(targetData.type);
      
      const newTarget: Target = {
        id: generateTargetId(),
        userId: 'user-123', // This would come from auth context
        type: targetData.type,
        period: targetData.period,
        targetValue: targetData.targetValue,
        currentValue: 0,
        unit,
        startDate,
        endDate,
        status: 'active',
        createdAt: new Date()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        targets: [...state.targets, newTarget],
        isCreating: false,
        createFormData: {},
        formErrors: {},
        isDirty: false
      }));
    } catch (error) {
      console.error('Failed to create target:', error);
      set({ isCreating: false });
    }
  },

  updateTarget: async (id: string, updates: Partial<Target>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        targets: state.targets.map(target =>
          target.id === id ? { ...target, ...updates } : target
        )
      }));
    } catch (error) {
      console.error('Failed to update target:', error);
    }
  },

  deleteTarget: async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        targets: state.targets.filter(target => target.id !== id),
        selectedTarget: state.selectedTarget?.id === id ? null : state.selectedTarget
      }));
    } catch (error) {
      console.error('Failed to delete target:', error);
    }
  },

  updateProgress: async (id: string, progress: number) => {
    const target = get().targets.find(t => t.id === id);
    if (!target) return;

    const wasCompleted = target.currentValue >= target.targetValue;
    const isNowCompleted = progress >= target.targetValue;

    await get().updateTarget(id, { 
      currentValue: progress,
      status: isNowCompleted ? 'completed' : target.status,
      completedAt: isNowCompleted && !wasCompleted ? new Date() : target.completedAt
    });

    // Show achievement notification if target was just completed
    if (isNowCompleted && !wasCompleted) {
      const updatedTarget = get().targets.find(t => t.id === id);
      if (updatedTarget) {
        get().showAchievementNotification(updatedTarget);
      }
    }
  },

  setSelectedTarget: (target: Target | null) => {
    set({ selectedTarget: target });
  },

  setActiveFilter: (filter: 'all' | 'active' | 'completed') => {
    set({ activeFilter: filter });
  },

  setFormData: (data: Partial<Target>) => {
    set(state => ({
      createFormData: { ...state.createFormData, ...data },
      isDirty: true
    }));
  },

  clearFormData: () => {
    set({ 
      createFormData: {},
      formErrors: {},
      isDirty: false
    });
  },

  setFormErrors: (errors: Record<string, string>) => {
    set({ formErrors: errors });
  },

  showAchievementNotification: (target: Target) => {
    set({ showAchievement: true, selectedTarget: target });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set({ showAchievement: false });
    }, 5000);
  },

  hideAchievementNotification: () => {
    set({ showAchievement: false });
  }
}), {
  name: 'pal-fitness-targets', // localStorage key
  storage: createJSONStorage(() => localStorage),
  partialize: (state: TargetStore) => ({
    targets: state.targets,
    achievements: state.achievements,
  }),
  onRehydrateStorage: () => (state) => {
    if (state?.targets) {
      state.targets = state.targets.map(normalizeTarget);
    }
    if (state?.achievements) {
      state.achievements = state.achievements.map(normalizeAchievement);
    }
  },
}));