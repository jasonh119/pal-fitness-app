import { Metadata } from 'next';
import TargetCreationForm from '../_components/TargetCreationForm';

export const metadata: Metadata = {
  title: 'Create Target | PAL Fitness',
  description: 'Create a new fitness target',
};

export default function CreateTargetPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Target
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Set a new fitness goal to track your progress
          </p>
        </div>
        
        <TargetCreationForm />
      </div>
    </div>
  );
}