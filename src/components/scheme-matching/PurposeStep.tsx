'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import Icon from '@/components/Icon';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';

interface PurposeStepProps {
  onContinue: () => void;
}

export default function PurposeStep({ onContinue }: PurposeStepProps) {
  const { watch, setValue } = useFormContext<CitizenProfileFormValues>();
  const currentIntent = watch('intent');

  const options = [
    {
      id: 'business_loan' as const,
      title: 'Business / Self-Employment',
      desc: 'Working capital, machinery, inventory, shop setup, or enterprise expansion.',
      icon: 'storefront',
      badge: 'Concessional Credit',
    },
    {
      id: 'education_loan' as const,
      title: 'Education Assistance',
      desc: 'Higher education loans, professional degrees, and 100% interest moratorium subsidies.',
      icon: 'school',
      badge: 'Interest Subvention',
    },
    {
      id: 'skill_training' as const,
      title: 'Skill Training',
      desc: 'Vocational training programs, toolkit allowances, and certified artisan support.',
      icon: 'handyman',
      badge: 'Skill Development',
    },
  ];

  const handleSelect = (intent: 'business_loan' | 'education_loan' | 'skill_training') => {
    setValue('intent', intent, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
          What are you looking for?
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
          Select the primary type of government financial or educational assistance you require:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = currentIntent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-secondary-container/25 shadow-sm ring-1 ring-primary/40'
                  : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface-container text-secondary'
                    }`}
                  >
                    <Icon name={opt.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                    {opt.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-primary text-base">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {isSelected ? '✓ Selected' : 'Click to select'}
                </span>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  isSelected ? 'border-primary bg-primary text-white' : 'border-outline-variant text-transparent'
                }`}>
                  ✓
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action button */}
      <div className="pt-6 border-t border-outline-variant/30 flex justify-end">
        <button
          type="button"
          disabled={!currentIntent}
          onClick={onContinue}
          className={`px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            currentIntent
              ? 'bg-primary text-white hover:opacity-95 cursor-pointer shadow-sm active:scale-[0.99]'
              : 'bg-surface-container border border-outline-variant/60 text-on-surface-variant/50 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <Icon name="arrow_forward" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
