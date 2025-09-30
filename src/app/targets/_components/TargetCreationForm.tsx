'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateTargetData, TargetType, TargetPeriod } from '@/types/target';
import { useTargets } from './useTargets';
import { getDefaultUnit } from '@/utils/targetCalculations';

export default function TargetCreationForm() {
  const router = useRouter();
  const { createTarget, validateTargetForm, isCreating } = useTargets();
  
  const [formData, setFormData] = useState<Partial<CreateTargetData>>({
    type: undefined,
    period: undefined,
    targetValue: undefined,
    unit: '',
    startDate: new Date()
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const targetTypes: { value: TargetType; label: string; description: string }[] = [
    { value: 'distance', label: 'Distance', description: 'Total distance covered (km/miles)' },
    { value: 'time', label: 'Duration', description: 'Total active time (minutes/hours)' },
    { value: 'activities', label: 'Activities', description: 'Number of workout sessions' },
    { value: 'steps', label: 'Steps', description: 'Total step count' },
    { value: 'calories', label: 'Calories', description: 'Calories burned during activities' }
  ];

  const periods: { value: TargetPeriod; label: string; description: string }[] = [
    { value: 'weekly', label: 'Weekly', description: 'Goal resets every week' },
    { value: 'monthly', label: 'Monthly', description: 'Goal resets every month' }
  ];

  const handleFieldChange = (field: keyof CreateTargetData, value: string | number | Date | TargetType | TargetPeriod) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-update unit when type changes
    if (field === 'type') {
      newFormData.unit = getDefaultUnit(value as TargetType);
    }
    
    setFormData(newFormData);
    setTouched({ ...touched, [field]: true });
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTargetForm(formData);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }

    const result = await createTarget(formData as CreateTargetData);
    
    if (result.success) {
      router.push('/targets');
    } else {
      setErrors({ submit: result.error || 'Failed to create target' });
    }
  };

  const getFieldError = (field: string) => {
    return touched[field] ? errors[field] : '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Target Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {targetTypes.map((type) => (
              <div
                key={type.value}
                className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.type === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onClick={() => handleFieldChange('type', type.value)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={() => {}} // Handled by div click
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                  {formData.type === type.value && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
          {getFieldError('type') && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('type')}</p>
          )}
        </div>

        {/* Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Target Period
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {periods.map((period) => (
              <div
                key={period.value}
                className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.period === period.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onClick={() => handleFieldChange('period', period.value)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    value={period.value}
                    checked={formData.period === period.value}
                    onChange={() => {}} // Handled by div click
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {period.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {period.description}
                    </p>
                  </div>
                  {formData.period === period.value && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
          {getFieldError('period') && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('period')}</p>
          )}
        </div>

        {/* Target Value */}
        <div>
          <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Value
          </label>
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="number"
                id="targetValue"
                min="1"
                step={formData.type === 'distance' ? '0.1' : '1'}
                value={formData.targetValue || ''}
                onChange={(e) => handleFieldChange('targetValue', parseFloat(e.target.value) || 0)}
                onBlur={() => setTouched({ ...touched, targetValue: true })}
                className={`block w-full rounded-md border ${
                  getFieldError('targetValue')
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                } dark:bg-gray-700 dark:text-white px-3 py-2`}
                placeholder="Enter target value"
              />
            </div>
            <div className="w-24">
              <input
                type="text"
                value={formData.unit || ''}
                onChange={(e) => handleFieldChange('unit', e.target.value)}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Unit"
              />
            </div>
          </div>
          {getFieldError('targetValue') && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('targetValue')}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleFieldChange('startDate', new Date(e.target.value))}
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isCreating}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isCreating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : (
              'Create Target'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}