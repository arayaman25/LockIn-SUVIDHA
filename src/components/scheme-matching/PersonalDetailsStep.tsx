'use client';

import React from 'react';
import Link from 'next/link';
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
  'Other State / UT',
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
    // If not SC, do not allow continuation
    if (!isScheduledCaste) {
      return;
    }

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
        
        {/* 1. SC Status — Explicit Gate */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-on-surface">
            Do you belong to the Scheduled Caste (SC) category? <span className="text-error">*</span>
          </label>
          <p className="text-[11px] text-on-surface-variant">
            Special affirmative schemes (such as NSFDC concessional loans and Stand-Up India) provide subsidized rates specifically for verified Scheduled Caste applicants.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
              <span>Yes, I belong to the SC category</span>
            </button>

            <button
              type="button"
              onClick={() => setValue('isScheduledCaste', false, { shouldValidate: true })}
              className={`py-3 px-4 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                isScheduledCaste === false
                  ? 'border-error bg-error/10 text-error shadow-xs ring-1 ring-error/40'
                  : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/40'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                isScheduledCaste === false ? 'border-error bg-error text-white' : 'border-outline-variant'
              }`}>
                {isScheduledCaste === false ? '✕' : ''}
              </span>
              <span>No, I do not belong to the SC category</span>
            </button>
          </div>

          {errors.isScheduledCaste && (
            <p className="text-[11px] text-error font-medium flex items-center gap-1 mt-1">
              <Icon name="error" className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.isScheduledCaste.message}</span>
            </p>
          )}
        </div>

        {/* Ineligible Notice Gate when SC is false */}
        {isScheduledCaste === false && (
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/80 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon name="info" className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm sm:text-base text-on-surface">
                  Scheduled Caste Eligibility Notice
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  SUVIDHA&apos;s current scheme-matching service is designed for Scheduled Caste beneficiaries. Based on your selection, this service cannot continue with the current eligibility flow.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setValue('isScheduledCaste', true, { shouldValidate: true })}
                className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-xs"
              >
                <Icon name="refresh-cw" className="w-4 h-4" />
                <span>Change Selection (I belong to SC)</span>
              </button>

              <Link
                href="/schemes"
                className="px-4 py-2.5 rounded-xl border border-primary text-primary text-xs sm:text-sm font-bold hover:bg-primary/5 transition-colors flex items-center gap-2"
              >
                <Icon name="external-link" className="w-4 h-4" />
                <span>Explore Other Government Schemes</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2. Remaining Fields (Only visible when SC is true) */}
        {isScheduledCaste === true && (
          <>
            {/* Age and Gender */}
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
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-xs font-bold text-on-surface-variant">
                  ₹
                </span>
                <input
                  id="input-income"
                  type="number"
                  min={0}
                  step={10000}
                  placeholder="e.g. 180000"
                  {...register('annualFamilyIncome', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Affirmative credit schemes typically provide maximum interest subvention for annual family incomes up to ₹3,00,000.
              </p>
              {errors.annualFamilyIncome && (
                <p className="text-[11px] text-error font-medium flex items-center gap-1">
                  <Icon name="error" className="w-3 h-3 shrink-0" />
                  <span>{errors.annualFamilyIncome.message}</span>
                </p>
              )}
            </div>

            {/* 4. Domicile State and District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-outline-variant/30">
              
              {/* State */}
              <div className="space-y-1.5">
                <label htmlFor="select-state" className="block text-xs font-bold text-on-surface">
                  Domicile State / Union Territory <span className="text-error">*</span>
                </label>
                <select
                  id="select-state"
                  {...register('state')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                >
                  <option value="">Select State / UT</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
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
                  District / City of Residence <span className="text-error">*</span>
                </label>
                <input
                  id="input-district"
                  type="text"
                  placeholder="e.g. Pune, Varanasi, Nagpur..."
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
          </>
        )}

      </div>

      {/* Navigation buttons */}
      <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2.5 border border-outline-variant rounded-xl text-xs sm:text-sm font-bold text-primary hover:bg-surface-container transition-colors"
        >
          {isScheduledCaste === false ? 'Go Back' : 'Previous'}
        </button>

        {isScheduledCaste === true ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 bg-primary text-white rounded-xl text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-sm flex items-center gap-2 active:scale-[0.99]"
          >
            <span>Continue</span>
            <Icon name="arrow-right" className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setValue('isScheduledCaste', true, { shouldValidate: true })}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-1.5"
          >
            <Icon name="refresh-cw" className="w-4 h-4" />
            <span>Change Selection</span>
          </button>
        )}
      </div>
    </div>
  );
}
