'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import Icon from '@/components/Icon';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';

interface PersonalDetailsStepProps {
  onContinue: () => void;
  onPrevious: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Puducherry',
];

export default function PersonalDetailsStep({
  onContinue,
  onPrevious,
}: PersonalDetailsStepProps) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<CitizenProfileFormValues>();

  const isScheduledCaste = watch('isScheduledCaste');
  const gender = watch('gender');
  const income = watch('annualFamilyIncome');

  const handleNext = async () => {
    const isValid = await trigger([
      'isScheduledCaste',
      'age',
      'gender',
      'annualFamilyIncome',
      'state',
      'district',
    ]);
    if (isValid) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
          Personal &amp; Demographic Profile
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
          Government welfare and affirmative credit schemes have statutory eligibility criteria. All declarations are strictly authenticated via e-KYC.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-civic space-y-6">
        
        {/* 1. SC Status — Explicit True/False */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-on-surface">
            Do you belong to the Scheduled Caste (SC) community? <span className="text-error">*</span>
          </label>
          <p className="text-[11px] text-on-surface-variant">
            Special affirmative schemes (such as NSFDC concessional loans and Stand-Up India) provide subsidized rates for verified SC applicants.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setValue('isScheduledCaste', true, { shouldValidate: true })}
              className={`py-3 px-4 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                isScheduledCaste === true
                  ? 'border-primary bg-secondary-container/25 text-primary shadow-xs ring-1 ring-primary/40'
                  : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/40'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                isScheduledCaste === true ? 'border-primary bg-primary text-white' : 'border-outline-variant'
              }`}>
                {isScheduledCaste === true ? '✓' : ''}
              </span>
              <span>Yes, I am an SC Beneficiary</span>
            </button>

            <button
              type="button"
              onClick={() => setValue('isScheduledCaste', false, { shouldValidate: true })}
              className={`py-3 px-4 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                isScheduledCaste === false
                  ? 'border-primary bg-secondary-container/25 text-primary shadow-xs ring-1 ring-primary/40'
                  : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/40'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                isScheduledCaste === false ? 'border-primary bg-primary text-white' : 'border-outline-variant'
              }`}>
                {isScheduledCaste === false ? '✓' : ''}
              </span>
              <span>No / General / Other</span>
            </button>
          </div>

          {errors.isScheduledCaste && (
            <p className="text-[11px] text-error font-medium flex items-center gap-1 mt-1">
              <Icon name="error" className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.isScheduledCaste.message}</span>
            </p>
          )}
        </div>

        {/* 2. Age and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-outline-variant/30">
          
          {/* Age */}
          <div className="space-y-1.5">
            <label htmlFor="input-age" className="block text-xs font-bold text-on-surface">
              Age of Applicant <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                id="input-age"
                type="number"
                min={18}
                max={120}
                placeholder="e.g. 28"
                {...register('age', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs text-on-surface-variant">
                Years
              </span>
            </div>
            {errors.age && (
              <p className="text-[11px] text-error font-medium flex items-center gap-1">
                <Icon name="error" className="w-3 h-3 shrink-0" />
                <span>{errors.age.message}</span>
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface">
              Gender <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'female' as const, label: 'Female' },
                { id: 'male' as const, label: 'Male' },
                { id: 'other' as const, label: 'Other' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setValue('gender', g.id, { shouldValidate: true })}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all text-center ${
                    gender === g.id
                      ? 'border-primary bg-primary text-white shadow-xs font-bold'
                      : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/40'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-[11px] text-error font-medium flex items-center gap-1">
                <Icon name="error" className="w-3 h-3 shrink-0" />
                <span>{errors.gender.message}</span>
              </p>
            )}
          </div>

        </div>

        {/* 3. Annual Family Income */}
        <div className="space-y-1.5 pt-4 border-t border-outline-variant/30">
          <div className="flex items-center justify-between">
            <label htmlFor="input-income" className="block text-xs font-bold text-on-surface">
              Annual Family Household Income (₹) <span className="text-error">*</span>
            </label>
            {typeof income === 'number' && !isNaN(income) && income >= 0 && (
              <span className="text-xs font-bold text-primary">
                ₹{income.toLocaleString('en-IN')} / year
              </span>
            )}
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Include total earnings of all working household members. Subsidies prioritize lower-income households.
          </p>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-xs font-bold text-on-surface-variant">
              ₹
            </span>
            <input
              id="input-income"
              type="number"
              min={0}
              step={10000}
              placeholder="e.g. 250000"
              {...register('annualFamilyIncome', { valueAsNumber: true })}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { label: 'Below ₹1.5L', value: 120000 },
              { label: '₹2.5L', value: 250000 },
              { label: '₹3.5L', value: 350000 },
              { label: '₹5L', value: 500000 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setValue('annualFamilyIncome', preset.value, { shouldValidate: true })}
                className="text-[11px] font-medium py-1 px-2.5 rounded-lg border border-outline-variant/60 bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {errors.annualFamilyIncome && (
            <p className="text-[11px] text-error font-medium flex items-center gap-1">
              <Icon name="error" className="w-3 h-3 shrink-0" />
              <span>{errors.annualFamilyIncome.message}</span>
            </p>
          )}
        </div>

        {/* 4. State and District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-outline-variant/30">
          
          {/* State */}
          <div className="space-y-1.5">
            <label htmlFor="select-state" className="block text-xs font-bold text-on-surface">
              State of Domicile <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                id="select-state"
                {...register('state')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs appearance-none cursor-pointer pr-9"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-on-surface-variant">
                <Icon name="expand_more" className="w-4 h-4" />
              </div>
            </div>
            {errors.state && (
              <p className="text-[11px] text-error font-medium flex items-center gap-1">
                <Icon name="error" className="w-3 h-3 shrink-0" />
                <span>{errors.state.message}</span>
              </p>
            )}
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label htmlFor="input-district" className="block text-xs font-bold text-on-surface">
              District <span className="text-error">*</span>
            </label>
            <input
              id="input-district"
              type="text"
              placeholder="e.g. Varanasi, Pune, Jaipur"
              {...register('district')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
            {errors.district && (
              <p className="text-[11px] text-error font-medium flex items-center gap-1">
                <Icon name="error" className="w-3 h-3 shrink-0" />
                <span>{errors.district.message}</span>
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Navigation buttons */}
      <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2.5 border border-outline-variant rounded-xl text-xs sm:text-sm font-bold text-primary hover:bg-surface-container transition-colors"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 bg-primary text-white rounded-xl text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-sm flex items-center gap-2 active:scale-[0.99]"
        >
          <span>Continue</span>
          <Icon name="arrow_forward" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
