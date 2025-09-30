export interface Target {
  id: string;
  userId: string;
  type: 'distance' | 'time' | 'activities' | 'steps' | 'calories';
  period: 'weekly' | 'monthly';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'failed' | 'paused';
  createdAt: Date;
  completedAt?: Date;
}

export interface Achievement {
  id: string;
  targetId: string;
  userId: string;
  achievedAt: Date;
  type: string;
  value: number;
  celebrated: boolean;
}

export interface TargetProgress {
  targetId: string;
  date: Date;
  value: number;
  percentage: number;
}

export interface TargetState {
  // UI States
  isLoading: boolean;
  isCreating: boolean;
  showAchievement: boolean;
  activeFilter: 'all' | 'active' | 'completed';
  
  // Data States
  targets: Target[];
  selectedTarget: Target | null;
  achievements: Achievement[];
  
  // Form States
  createFormData: Partial<Target>;
  formErrors: Record<string, string>;
  isDirty: boolean;
}

export interface CreateTargetData {
  type: Target['type'];
  period: Target['period'];
  targetValue: number;
  unit: string;
  startDate?: Date;
}

export type TargetType = Target['type'];
export type TargetPeriod = Target['period'];
export type TargetStatus = Target['status'];