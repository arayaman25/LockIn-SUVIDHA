'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import Icon from '@/components/Icon';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';

interface ReviewStepProps {
  onGoToStep: (step: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export default function ReviewStep({
  onGoToStep,
  onSubmit,
  isLoading,
  errorMessage,
}: ReviewStepProps) {
  const { watch } = useFormContext<CitizenProfileFormValues>();
  const values = watch();

  const intentLabel =
    values.intent === 'business_loan'
      ? 'Business / Self-Employment'
      : values.intent === 'education_loan'
      ? 'Higher Education Assistance'
      : 'Skill Training & Certification';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
          Review Your Application Profile
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
          Verify your details below. The SUVIDHA Scheme Engine will score your profile against central welfare, affirmative credit, and interest subvention schemes.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-error-container/40 border border-error/30 rounded-2xl flex items-start gap-3 text-xs text-on-error-container">
          <Icon name="error" className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Service Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        
        {/* Section 1: Requirement & Purpose */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Requirement &amp; Purpose
            </span>
            <h4 className="text-base font-serif font-bold text-primary">
              {intentLabel}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              {values.projectType && (
                <p className="text-on-surface">
                  <span className="text-on-surface-variant">Project:</span>{' '}
                  <strong>{values.projectType}</strong>
                </p>
              )}
              {values.course && (
                <p className="text-on-surface">
                  <span className="text-on-surface-variant">Course:</span>{' '}
                  <strong>{values.course}</strong>
                </p>
              )}
              {values.requiredLoanAmount && (
                <p className="text-on-surface">
                  <span className="text-on-surface-variant">Requested Loan:</span>{' '}
                  <strong className="text-primary">
                    ₹{values.requiredLoanAmount.toLocaleString('en-IN')}
                  </strong>
                </p>
              )}
              {values.estimatedProjectCost && (
                <p className="text-on-surface">
                  <span className="text-on-surface-variant">Estimated Cost:</span>{' '}
                  <strong>₹{values.estimatedProjectCost.toLocaleString('en-IN')}</strong>
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 py-1 px-2.5 rounded-lg hover:bg-surface-container"
          >
            <Icon name="edit_document" className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Section 2: Personal Profile */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Personal &amp; Demographic Profile
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs pt-1">
              <div>
                <span className="text-on-surface-variant block">SC Status:</span>
                <span className="font-bold text-primary">
                  {values.isScheduledCaste ? 'Yes (SC Community)' : 'General / Other'}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Age &amp; Gender:</span>
                <span className="font-bold text-on-surface">
                  {values.age} Years · {values.gender}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Annual Household Income:</span>
                <span className="font-bold text-primary">
                  ₹{values.annualFamilyIncome?.toLocaleString('en-IN')} / year
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 py-1 px-2.5 rounded-lg hover:bg-surface-container"
          >
            <Icon name="edit_document" className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Section 3: Location */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Location &amp; Domicile
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs pt-1">
              <p className="text-on-surface">
                <span className="text-on-surface-variant">State:</span>{' '}
                <strong>{values.state}</strong>
              </p>
              <p className="text-on-surface">
                <span className="text-on-surface-variant">District:</span>{' '}
                <strong>{values.district}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 py-1 px-2.5 rounded-lg hover:bg-surface-container"
          >
            <Icon name="edit_document" className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Section 5: Education (if applicable) */}
        {values.intent === 'education_loan' && (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex justify-between items-start gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                Education Qualification
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs pt-1">
                <p className="text-on-surface">
                  <span className="text-on-surface-variant">Level:</span>{' '}
                  <strong className="capitalize">{values.educationStatus}</strong>
                </p>
                {values.institution && (
                  <p className="text-on-surface">
                    <span className="text-on-surface-variant">Institution:</span>{' '}
                    <strong>{values.institution}</strong>
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 py-1 px-2.5 rounded-lg hover:bg-surface-container"
            >
              <Icon name="edit_document" className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        )}

      </div>

      {/* Submission CTA */}
      <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onGoToStep(3)}
          className="px-6 py-2.5 border border-outline-variant rounded-xl text-xs sm:text-sm font-bold text-primary hover:bg-surface-container transition-colors"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="px-8 py-3.5 bg-primary text-white rounded-xl text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-md flex items-center gap-2.5 active:scale-[0.99] cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Finding schemes suitable for you…</span>
            </>
          ) : (
            <>
              <Icon name="verified" className="w-5 h-5 text-white" />
              <span>Find Suitable Schemes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
