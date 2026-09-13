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
import ConversationalIntake from '@/components/intake/ConversationalIntake';
import { useShowRecommendations } from '@/components/recommendations/useShowRecommendations';
import Icon from '@/components/Icon';
import { MANUAL_INTAKE_SESSION_KEY, readSessionValue, writeSessionValue } from '@/src/lib/intake-session';

// The engine answers 404 when no scheme passes the hard eligibility filters.
const NO_MATCH_STATUS_CODE = 404;
const REVIEW_STEP = 4;

type RecommendationMutation = ReturnType<typeof useSchemeRecommendations>;

const NO_MATCH_MESSAGE =
  'No suitable schemes were found for the details provided. Check your loan amount, income and eligibility details and try again.';

/**
 * What the Review step should tell the citizen after a submission that did
 * not lead to the recommendations page. Null while idle, searching, or
 * redirecting with matches.
 */
function submissionMessage(mutation: RecommendationMutation): string | null {
  const { error, data } = mutation;
  if (error) {
    return error instanceof ApiError && error.statusCode === NO_MATCH_STATUS_CODE
      ? error.message || NO_MATCH_MESSAGE
      : error.message;
  }
  if (data && data.data.matches.length === 0) {
    return data.data.reason || NO_MATCH_MESSAGE;
  }
  return null;
}

// All fields except the intent start empty — populated by AI intake or user
// form input. Never seed with demo data; stale values break the
// fresh-conversation experience.
const emptyFormValues = (
  intent: CitizenProfileFormValues['intent'],
): Partial<CitizenProfileFormValues> => ({
  intent,
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
});

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
    defaultValues: emptyFormValues(initialIntent),
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

  // Step navigation gate: cannot access steps 3-4 if isScheduledCaste is false
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
      setCurrentStep((prev) => Math.min(prev + 1, REVIEW_STEP));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    recommendationMutation.reset();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToStep = (step: number) => {
    const isSC = getValues('isScheduledCaste');
    if (!isSC && step > 2) {
      return;
    }
    setSubmitError(null);
    // A previous "no match" no longer applies once the citizen edits details.
    recommendationMutation.reset();
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submission from Review -> call the engine; matches open the recommendations
  // page, while no-match and errors are shown on the Review step itself.
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
        if (response.data.matches.length > 0) {
          showRecommendations({ kind: 'wizard', profile: payload });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      onError: (err) => {
        console.error('[SchemeWizard] Recommendation mutation error:', err);
        // The notice sits at the top of the Review step.
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
          onReset={() => {
            // The chat mirrors every extracted field into this form, so starting
            // the chat over must clear those too, including the saved copy that
            // would otherwise be restored on the next visit.
            const cleared = emptyFormValues(initialIntent);
            reset(cleared);
            writeSessionValue(MANUAL_INTAKE_SESSION_KEY, cleared);
            recommendationMutation.reset();
            setSubmitError(null);
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

          {currentStep === REVIEW_STEP && (
            <ReviewStep
              onGoToStep={handleJumpToStep}
              onSubmit={handleSubmit((data) => onSubmitReview(data), onInvalidSubmit)}
              // Stay busy while redirecting to the recommendations page, so the
              // button does not flash back to clickable in between.
              isLoading={
                recommendationMutation.isPending ||
                (recommendationMutation.data?.data.matches.length ?? 0) > 0
              }
              errorMessage={submitError || submissionMessage(recommendationMutation)}
            />
          )}
        </div>
      </FormProvider>
    </div>
  );
}
