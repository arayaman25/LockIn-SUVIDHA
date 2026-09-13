'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemeMatchingFormSchema, CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';
import { useSchemeRecommendations } from '@/src/lib/query';
import { ApiError } from '@/src/lib/api/axios';
import { RecommendationRequest } from '@/src/types';

import WizardProgress from './WizardProgress';
import PurposeStep from './PurposeStep';
import PersonalDetailsStep from './PersonalDetailsStep';
import RequirementStep from './RequirementStep';
import ReviewStep from './ReviewStep';
import RecommendationResults, { RecommendationSubmissionStatus } from './RecommendationResults';
import ConversationalIntake from '@/components/intake/ConversationalIntake';
import { useShowRecommendations } from '@/components/recommendations/useShowRecommendations';
import Icon from '@/components/Icon';
import { MANUAL_INTAKE_SESSION_KEY, readSessionValue, writeSessionValue } from '@/src/lib/intake-session';

// The engine answers 404 when no scheme passes the hard eligibility filters.
const NO_MATCH_STATUS_CODE = 404;

type RecommendationMutation = ReturnType<typeof useSchemeRecommendations>;

function toSubmissionStatus(mutation: RecommendationMutation): RecommendationSubmissionStatus {
  const { error, data } = mutation;
  if (error) {
    return error instanceof ApiError && error.statusCode === NO_MATCH_STATUS_CODE
      ? { status: 'no-match', message: error.message }
      : { status: 'error', message: error.message };
  }
  if (data && data.data.matches.length === 0) {
    return { status: 'no-match', message: data.data.reason };
  }
  // Pending, or matched and on its way to the recommendations page.
  return { status: 'searching' };
}

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const manualStateHydrated = useRef(false);

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

  const { trigger, getValues, handleSubmit, setValue, reset, watch } = methods;
  const recommendationMutation = useSchemeRecommendations();
  const showRecommendations = useShowRecommendations();

  useEffect(() => {
    const savedForm = readSessionValue<Partial<CitizenProfileFormValues>>(MANUAL_INTAKE_SESSION_KEY);
    if (savedForm) {
      reset(savedForm);
    }
    manualStateHydrated.current = true;
  }, [reset]);

  useEffect(() => {
    // react-hook-form's watch subscription is the supported field-level change API here.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((values) => {
      if (manualStateHydrated.current) {
        writeSessionValue(MANUAL_INTAKE_SESSION_KEY, values);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Step navigation gate: cannot access steps 3-5 if isScheduledCaste is false
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
      setCurrentStep((prev) => Math.min(prev + 1, 5));
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

  // Submission from Review -> Call Backend API & Advance to Results
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
    setCurrentStep(5);
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
      onSuccess: (response) => {
        // An empty result stays on this step, which renders the no-match state.
        if (response.data.matches.length > 0) {
          showRecommendations({ kind: 'wizard', profile: payload });
        }
      },
      onError: (err) => {
        console.error('[SchemeWizard] Recommendation mutation error:', err);
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

  // Results View (Step 5)
  if (currentStep === 5) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <RecommendationResults
          submission={toSubmissionStatus(recommendationMutation)}
          onRetry={handleRetry}
          onReviewProfile={() => {
            setEntryMode('form');
            handleJumpToStep(4);
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
            <RequirementStep onContinue={handleNext} onPrevious={handleBack} />
          )}

          {currentStep === 4 && (
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
