'use client';

import React, { useState, useCallback } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemeMatchingFormSchema, CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';
import { useSchemeRecommendations } from '@/src/lib/query';
import { SchemeRecommendationResponse, RecommendationRequest } from '@/src/types';

import WizardProgress from './WizardProgress';
import PurposeStep from './PurposeStep';
import PersonalDetailsStep from './PersonalDetailsStep';
import OccupationStep from './OccupationStep';
import RequirementStep from './RequirementStep';
import ReviewStep from './ReviewStep';
import RecommendationResults from './RecommendationResults';
import ConversationalIntake from '@/components/intake/ConversationalIntake';
import Icon from '@/components/Icon';

interface SchemeWizardProps {
  initialIntent?: 'business_loan' | 'education_loan' | 'skill_training';
  defaultMode?: 'conversational' | 'form';
}

export default function SchemeWizard({
  initialIntent = 'business_loan',
  defaultMode = 'conversational',
}: SchemeWizardProps) {
  const [entryMode, setEntryMode] = useState<'conversational' | 'form'>(defaultMode);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resultsData, setResultsData] = useState<SchemeRecommendationResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<CitizenProfileFormValues>({
    resolver: zodResolver(schemeMatchingFormSchema) as any,
    defaultValues: {
      intent: initialIntent,
      // All other fields start empty — populated by AI intake or user form input.
      // Never seed with demo data; stale values break the fresh-conversation experience.
      isScheduledCaste: undefined,
      age: undefined,
      gender: undefined,
      annualFamilyIncome: undefined,
      state: '',
      district: '',
      occupationCategory: '',
      occupationType: '',
      projectType: '',
      estimatedProjectCost: undefined,
      requiredLoanAmount: undefined,
      educationStatus: undefined,
      course: '',
      institution: '',
      skillCategory: '',
      preferredDuration: '',
    },
    mode: 'onTouched',
  });

  const { trigger, getValues, handleSubmit, setValue } = methods;
  const recommendationMutation = useSchemeRecommendations();

  // Step navigation gate: cannot access steps 3-6 if isScheduledCaste is false
  const canNavigateToStep = (targetStep: number): boolean => {
    const isSC = getValues('isScheduledCaste');
    if (!isSC && targetStep > 2) {
      return false;
    }
    return targetStep <= currentStep || targetStep === currentStep + 1;
  };

  // Validate step fields before proceeding
  const handleNext = async () => {
    setSubmitError(null);
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(['intent']);
    } else if (currentStep === 2) {
      const isSC = getValues('isScheduledCaste');
      if (!isSC) {
        return;
      }
      isValid = await trigger([
        'isScheduledCaste',
        'age',
        'gender',
        'annualFamilyIncome',
        'state',
        'district',
      ]);
    } else if (currentStep === 3) {
      isValid = await trigger(['occupationCategory', 'occupationType']);
    } else if (currentStep === 4) {
      const intent = getValues('intent');
      if (intent === 'business_loan') {
        isValid = await trigger(['projectType', 'requiredLoanAmount', 'estimatedProjectCost']);
      } else if (intent === 'education_loan') {
        isValid = await trigger(['course', 'educationStatus', 'requiredLoanAmount']);
      } else {
        isValid = await trigger(['skillCategory', 'preferredDuration']);
      }
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToStep = (step: number) => {
    const isSC = getValues('isScheduledCaste');
    if (!isSC && step > 2) {
      return;
    }
    setSubmitError(null);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submission from Step 5 -> Call Backend API & Advance to Step 6
  const onSubmitReview = async (formData: Partial<CitizenProfileFormValues>) => {
    // Gate check: do not submit if not SC
    if (formData.isScheduledCaste === false) {
      setSubmitError(
        "SUVIDHA's current scheme-matching service is designed for Scheduled Caste beneficiaries. Based on your selection, this service cannot continue with the current eligibility flow."
      );
      setEntryMode('form');
      setCurrentStep(2);
      return;
    }

    setSubmitError(null);
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let payload: RecommendationRequest;

    if (formData.intent === 'education_loan') {
      payload = {
        intent: 'education_loan',
        isScheduledCaste: true,
        age: Number(formData.age || 22),
        gender: formData.gender || 'male',
        annualFamilyIncome: Number(formData.annualFamilyIncome || 200000),
        state: formData.state || 'Maharashtra',
        district: formData.district || 'Pune',
        occupationCategory: formData.occupationCategory || 'Student',
        occupationType: formData.customOccupation || formData.occupationType || 'Student',
        customOccupation: formData.customOccupation,
        course: formData.course || 'Professional Degree',
        educationStatus: (formData.educationStatus || 'secondary') as any,
        requiredLoanAmount: Number(formData.requiredLoanAmount || 250000),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    } else if (formData.intent === 'skill_training') {
      payload = {
        intent: 'skill_training',
        isScheduledCaste: true,
        age: Number(formData.age || 25),
        gender: formData.gender || 'male',
        annualFamilyIncome: Number(formData.annualFamilyIncome || 150000),
        state: formData.state || 'Maharashtra',
        district: formData.district || 'Pune',
        occupationCategory: formData.occupationCategory || 'Vocational Learner',
        occupationType: formData.customOccupation || formData.occupationType || 'Trainee',
        customOccupation: formData.customOccupation,
        requiredLoanAmount: formData.requiredLoanAmount ? Number(formData.requiredLoanAmount) : undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    } else {
      payload = {
        intent: 'business_loan',
        isScheduledCaste: true,
        age: Number(formData.age || 28),
        gender: formData.gender || 'male',
        annualFamilyIncome: Number(formData.annualFamilyIncome || 180000),
        state: formData.state || 'Maharashtra',
        district: formData.district || 'Pune',
        occupationCategory: formData.occupationCategory || 'General Enterprise',
        occupationType: formData.customOccupation || formData.occupationType || formData.projectType || 'Small Enterprise',
        customOccupation: formData.customOccupation,
        projectType: formData.projectType || 'General Enterprise',
        requiredLoanAmount: Number(formData.requiredLoanAmount || formData.estimatedProjectCost || 150000),
        estimatedProjectCost: formData.estimatedProjectCost ? Number(formData.estimatedProjectCost) : undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    }

    recommendationMutation.mutate(payload, {
      onSuccess: (data) => {
        setResultsData(data);
      },
      onError: (err) => {
        console.error('[SchemeWizard] Recommendation mutation error:', err);
        setResultsData(null);
      },
    });
  };

  const onInvalidSubmit = (errors: FieldErrors<CitizenProfileFormValues>) => {
    console.warn('[SchemeWizard] Form validation failed on submit:', errors);
    const errorKeys = Object.keys(errors);
    const errorMessages = Object.entries(errors)
      .map(([key, val]) => `${key}: ${val?.message || 'invalid'}`)
      .join(', ');
    setSubmitError(`Please check required fields: ${errorMessages || errorKeys.join(', ')}`);
  };

  const handleRetry = () => {
    const values = getValues();
    onSubmitReview(values);
  };

  /**
   * Idempotent field-by-field merge using setValue() instead of global reset().
   * Compares current vs new value; updates ONLY when genuinely changed.
   * Applying identical data multiple times performs zero updates and never causes a render loop.
   */
  const handleProfileUpdateFromAI = useCallback(
    (extracted: Partial<CitizenProfileFormValues>) => {
      if (!extracted || typeof extracted !== 'object') return;
      const current = getValues();

      for (const [key, val] of Object.entries(extracted)) {
        if (val !== null && val !== undefined && val !== '') {
          const currentVal = (current as any)[key];
          // Only update if value genuinely changed
          if (currentVal !== val) {
            setValue(key as any, val as any, {
              shouldDirty: true,
              shouldTouch: false,
              shouldValidate: false,
            });
          }
        }
      }
    },
    [getValues, setValue]
  );

  // Results View (Step 6)
  if (currentStep === 6) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <RecommendationResults
          isLoading={recommendationMutation.isPending}
          error={recommendationMutation.error}
          data={resultsData}
          onRetry={handleRetry}
          onReviewProfile={() => {
            setEntryMode('form');
            handleJumpToStep(5);
          }}
        />
      </div>
    );
  }

  // Primary Conversational Intake View
  if (entryMode === 'conversational') {
    return (
      <div className="w-full px-0 py-4">
        <ConversationalIntake
          initialProfile={getValues()}
          onProfileUpdate={handleProfileUpdateFromAI}
          onSwitchToForm={() => {
            setEntryMode('form');
            setCurrentStep(1);
          }}
          onFindSchemes={() => {
            setEntryMode('form');
            setCurrentStep(1);
          }}
          isMatchingSchemes={recommendationMutation.isPending}
        />
      </div>
    );
  }

  // Fallback Step-by-Step Wizard View
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Toggle back to AI Assistant */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setEntryMode('conversational')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-[#00472f] text-stone-700 hover:text-[#00472f] text-xs font-semibold bg-white shadow-xs transition-colors cursor-pointer"
        >
          <Icon name="record_voice_over" size={14} className="text-[#00472f]" />
          <span>Prefer conversational AI? (बोलकर या लिखकर बताएं)</span>
        </button>
      </div>

      {/* Step Progress Bar */}
      <WizardProgress
        currentStep={currentStep}
        onStepClick={handleJumpToStep}
        canNavigateToStep={canNavigateToStep}
      />

      {/* React Hook Form Context Provider */}
      <FormProvider {...methods}>
        <div className="mt-8">
          {currentStep === 1 && <PurposeStep onContinue={handleNext} />}

          {currentStep === 2 && (
            <PersonalDetailsStep onContinue={handleNext} onPrevious={handleBack} />
          )}

          {currentStep === 3 && (
            <OccupationStep onContinue={handleNext} onPrevious={handleBack} />
          )}

          {currentStep === 4 && (
            <RequirementStep onContinue={handleNext} onPrevious={handleBack} />
          )}

          {currentStep === 5 && (
            <ReviewStep
              onGoToStep={handleJumpToStep}
              onSubmit={handleSubmit((data) => onSubmitReview(data), onInvalidSubmit)}
              isLoading={recommendationMutation.isPending}
              errorMessage={submitError || recommendationMutation.error?.message}
            />
          )}
        </div>
      </FormProvider>
    </div>
  );
}
