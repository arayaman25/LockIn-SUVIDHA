'use client';

import React from 'react';
import Icon from '@/components/Icon';

interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

const STEP_LABELS = [
  'Purpose',
  'Personal',
  'Occupation',
  'Requirement',
  'Review',
  'Results',
];

export default function WizardProgress({
  currentStep,
  totalSteps = 6,
  onStepClick,
  canNavigateToStep,
}: WizardProgressProps) {
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100)
  );

  return (
    <div className="space-y-4 mb-8">
      {/* Mobile step label */}
      <div className="flex sm:hidden items-center justify-between text-xs">
        <span className="font-bold text-primary">
          Step {currentStep}: {STEP_LABELS[currentStep - 1] || 'Details'}
        </span>
        <span className="text-on-surface-variant font-medium">
          {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Desktop step indicators */}
      <div className="hidden sm:grid grid-cols-6 gap-2 text-center text-xs">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const isClickable =
            Boolean(onStepClick && canNavigateToStep && canNavigateToStep(stepNumber));

          return (
            <button
              key={label}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
              className={`flex flex-col items-center gap-1.5 py-1 px-1 rounded-lg transition-all ${
                isClickable ? 'cursor-pointer hover:bg-surface-container' : 'cursor-default'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-primary text-white shadow-xs'
                    : isCurrent
                    ? 'bg-primary-container text-white ring-2 ring-primary ring-offset-2'
                    : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                }`}
              >
                {isCompleted ? (
                  <Icon name="check" className="w-3.5 h-3.5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span
                className={`text-[11px] truncate max-w-full font-medium ${
                  isCurrent
                    ? 'font-bold text-primary'
                    : isCompleted
                    ? 'text-on-surface font-semibold'
                    : 'text-on-surface-variant/70'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual progress bar */}
      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
