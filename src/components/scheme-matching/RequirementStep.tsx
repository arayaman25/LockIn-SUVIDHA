'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import Icon from '@/components/Icon';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';

interface RequirementStepProps {
  onContinue: () => void;
  onPrevious: () => void;
}

export default function RequirementStep({
  onContinue,
  onPrevious,
}: RequirementStepProps) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<CitizenProfileFormValues>();

  const intent = watch('intent');
  const requiredLoanAmount = watch('requiredLoanAmount');
  const estimatedProjectCost = watch('estimatedProjectCost');
  const educationStatus = watch('educationStatus');

  const handleNext = async () => {
    let fieldsToValidate: (keyof CitizenProfileFormValues)[] = ['requiredLoanAmount'];

    if (intent === 'business_loan') {
      fieldsToValidate = ['projectType', 'requiredLoanAmount'];
    } else if (intent === 'education_loan') {
      fieldsToValidate = ['course', 'educationStatus', 'requiredLoanAmount'];
    } else if (intent === 'skill_training') {
      fieldsToValidate = [];
    }

    const isValid = fieldsToValidate.length === 0 ? true : await trigger(fieldsToValidate);
    if (isValid) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
          {intent === 'business_loan' && 'Business & Financial Requirement'}
          {intent === 'education_loan' && 'Education & Course Details'}
          {intent === 'skill_training' && 'Skill Training & Vocational Preferences'}
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
          {intent === 'business_loan' &&
            'Specify the capital needed for your enterprise, tooling, raw materials, or expansion.'}
          {intent === 'education_loan' &&
            'Provide your academic program details to evaluate full interest moratorium eligibility.'}
          {intent === 'skill_training' &&
            'Tell us your preferred vocational specialization and stipend requirements.'}
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-civic space-y-6">
        
        {/* ======================================================== */}
        {/* BUSINESS LOAN FIELDS */}
        {/* ======================================================== */}
        {intent === 'business_loan' && (
          <>
            {/* Project / Business Type */}
            <div className="space-y-1.5">
              <label htmlFor="input-project-type" className="block text-xs font-bold text-on-surface">
                Business / Project Type <span className="text-error">*</span>
              </label>
              <input
                id="input-project-type"
                type="text"
                placeholder="e.g. Retail Kirana, Custom Tailoring Shop, Mobile Repair, Food Cart..."
                {...register('projectType')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
              <p className="text-[11px] text-on-surface-variant">
                Describe the trade or enterprise for which capital is sought.
              </p>
              {errors.projectType && (
                <p className="text-[11px] text-error font-medium flex items-center gap-1">
                  <Icon name="error" className="w-3 h-3 shrink-0" />
                  <span>{errors.projectType.message}</span>
                </p>
              )}
            </div>

            {/* Estimated Project Cost & Required Loan Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-outline-variant/30">
              
              {/* Estimated Project Cost */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-project-cost" className="block text-xs font-bold text-on-surface">
                    Estimated Project Cost (₹)
                  </label>
                  {typeof estimatedProjectCost === 'number' && estimatedProjectCost > 0 && (
                    <span className="text-xs font-bold text-primary">
                      ₹{estimatedProjectCost.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-xs font-bold text-on-surface-variant">
                    ₹
                  </span>
                  <input
                    id="input-project-cost"
                    type="number"
                    min={0}
                    step={5000}
                    placeholder="e.g. 500000"
                    {...register('estimatedProjectCost', { valueAsNumber: true })}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Total capital cost including machinery, inventory &amp; space.
                </p>
              </div>

              {/* Required Loan Amount */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-loan-amount" className="block text-xs font-bold text-on-surface">
                    Required Loan Amount (₹) <span className="text-error">*</span>
                  </label>
                  {typeof requiredLoanAmount === 'number' && requiredLoanAmount > 0 && (
                    <span className="text-xs font-bold text-primary">
                      ₹{requiredLoanAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-xs font-bold text-on-surface-variant">
                    ₹
                  </span>
                  <input
                    id="input-loan-amount"
                    type="number"
                    min={1000}
                    step={5000}
                    placeholder="e.g. 300000"
                    {...register('requiredLoanAmount', { valueAsNumber: true })}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Amount you wish to borrow under concessional terms.
                </p>
                {errors.requiredLoanAmount && (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <Icon name="error" className="w-3 h-3 shrink-0" />
                    <span>{errors.requiredLoanAmount.message}</span>
                  </p>
                )}
              </div>

            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* EDUCATION LOAN FIELDS */}
        {/* ======================================================== */}
        {intent === 'education_loan' && (
          <>
            {/* Education Status Level */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-on-surface">
                Current / Qualifying Education Level <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'secondary' as const, label: '10th / 12th Pass' },
                  { id: 'graduate' as const, label: 'Graduate' },
                  { id: 'postgraduate' as const, label: 'Post Graduate' },
                  { id: 'none' as const, label: 'Other / Diploma' },
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setValue('educationStatus', level.id, { shouldValidate: true })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                      educationStatus === level.id
                        ? 'border-primary bg-primary text-white font-bold shadow-xs'
                        : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/40'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
              {errors.educationStatus && (
                <p className="text-[11px] text-error font-medium flex items-center gap-1">
                  <Icon name="error" className="w-3 h-3 shrink-0" />
                  <span>{errors.educationStatus.message}</span>
                </p>
              )}
            </div>

            {/* Course and Institution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-outline-variant/30">
              
              {/* Course */}
              <div className="space-y-1.5">
                <label htmlFor="input-course" className="block text-xs font-bold text-on-surface">
                  Degree / Course Name <span className="text-error">*</span>
                </label>
                <input
                  id="input-course"
                  type="text"
                  placeholder="e.g. B.Tech Computer Science, MBBS, MBA..."
                  {...register('course')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
                <p className="text-[11px] text-on-surface-variant">
                  Central Sector Interest Subsidy (CSIS) covers professional technical degree courses.
                </p>
                {errors.course && (
                  <p className="text-[11px] text-error font-medium flex items-center gap-1">
                    <Icon name="error" className="w-3 h-3 shrink-0" />
                    <span>{errors.course.message}</span>
                  </p>
                )}
              </div>

              {/* Institution */}
              <div className="space-y-1.5">
                <label htmlFor="input-institution" className="block text-xs font-bold text-on-surface">
                  Institution / University Name
                </label>
                <input
                  id="input-institution"
                  type="text"
                  placeholder="e.g. IIT, AIIMS, State University, NAAC accredited college..."
                  {...register('institution')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
              </div>

            </div>

            {/* Required Loan Amount */}
            <div className="space-y-1.5 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center justify-between">
                <label htmlFor="input-edu-loan" className="block text-xs font-bold text-on-surface">
                  Required Education Loan Amount (₹) <span className="text-error">*</span>
                </label>
                {typeof requiredLoanAmount === 'number' && requiredLoanAmount > 0 && (
                  <span className="text-xs font-bold text-primary">
                    ₹{requiredLoanAmount.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-xs font-bold text-on-surface-variant">
                  ₹
                </span>
                <input
                  id="input-edu-loan"
                  type="number"
                  min={10000}
                  step={10000}
                  placeholder="e.g. 750000"
                  {...register('requiredLoanAmount', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant">
                CSIS provides 100% full interest moratorium subsidy on loans up to ₹10 Lakhs during course period + 1 year.
              </p>
              {errors.requiredLoanAmount && (
                <p className="text-[11px] text-error font-medium flex items-center gap-1">
                  <Icon name="error" className="w-3 h-3 shrink-0" />
                  <span>{errors.requiredLoanAmount.message}</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* SKILL TRAINING FIELDS */}
        {/* ======================================================== */}
        {intent === 'skill_training' && (
          <>
            <div className="space-y-1.5">
              <label htmlFor="input-skill-course" className="block text-xs font-bold text-on-surface">
                Preferred Vocational Skill / Trade
              </label>
              <input
                id="input-skill-course"
                type="text"
                placeholder="e.g. Solar Technician, Advanced Tailoring, CNC Operator, Electrician..."
                {...register('course')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
              <p className="text-[11px] text-on-surface-variant">
                PM Vishwakarma and National Skill Development Corp programs provide free certification &amp; ₹15,000 toolkits.
              </p>
            </div>

            <div className="space-y-1.5 pt-4 border-t border-outline-variant/30">
              <label htmlFor="input-skill-loan" className="block text-xs font-bold text-on-surface">
                Optional Stipend / Toolkit Loan Assistance (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-xs font-bold text-on-surface-variant">
                  ₹
                </span>
                <input
                  id="input-skill-loan"
                  type="number"
                  min={0}
                  step={5000}
                  placeholder="e.g. 50000"
                  {...register('requiredLoanAmount', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
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
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 bg-primary text-white rounded-xl text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-sm flex items-center gap-2 active:scale-[0.99]"
        >
          <span>Review Profile</span>
          <Icon name="arrow_forward" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
