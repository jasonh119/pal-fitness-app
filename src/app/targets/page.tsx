import { Metadata } from 'next';
import TargetDashboard from './_components/TargetDashboard';

export const metadata: Metadata = {
  title: 'Fitness Targets | PAL Fitness',
  description: 'Set and track your weekly and monthly fitness goals',
};

export default function TargetsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fitness Targets
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Set goals, track progress, and achieve your fitness milestones
          </p>
        </div>
        
        <TargetDashboard />
      </div>
    </div>
  );
}