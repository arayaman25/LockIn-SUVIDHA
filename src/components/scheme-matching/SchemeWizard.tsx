'use client';

import React, { useState } from 'react';
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

interface SchemeWizardProps {
  initialIntent?: 'business_loan' | 'education_loan' | 'skill_training';
}

export default function SchemeWizard({
  initialIntent = 'business_loan',
}: SchemeWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resultsData, setResultsData] = useState<SchemeRecommendationResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<CitizenProfileFormValues>({
    resolver: zodResolver(schemeMatchingFormSchema) as any,
    defaultValues: {
      intent: initialIntent,
      isScheduledCaste: true,
      age: 28,
      gender: 'male',
      annualFamilyIncome: 180000,
      state: 'Maharashtra',
      district: 'Pune',
      occupationCategory: 'Tailoring & Garments',
      occupationType: 'Tailor',
      projectType: 'Tailoring Shop Expansion',
      estimatedProjectCost: 200000,
      requiredLoanAmount: 150000,
      educationStatus: undefined,
      course: '',
      institution: '',
      skillCategory: '',
      preferredDuration: '',
    },
    mode: 'onTouched',
  });

  const { trigger, getValues, handleSubmit } = methods;

  const recommendationMutation = useSchemeRecommendations();

  // Validate step fields before proceeding
  const handleNext = async () => {
    setSubmitError(null);
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(['intent']);
    } else if (currentStep === 2) {
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
    setSubmitError(null);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submission from Step 5 -> Call Backend API & Advance to Step 6
  const onSubmitReview = async (formData: CitizenProfileFormValues) => {
    console.log('[SchemeWizard] Submit triggered with valid formData:', formData);
    setSubmitError(null);
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let payload: RecommendationRequest;

    if (formData.intent === 'business_loan') {
      payload = {
        intent: 'business_loan',
        isScheduledCaste: formData.isScheduledCaste,
        age: Number(formData.age),
        gender: formData.gender,
        annualFamilyIncome: Number(formData.annualFamilyIncome),
        state: formData.state,
        district: formData.district,
        occupationCategory: formData.occupationCategory,
        occupationType: formData.customOccupation || formData.occupationType,
        customOccupation: formData.customOccupation,
        projectType: formData.projectType || 'General Enterprise',
        requiredLoanAmount: Number(formData.requiredLoanAmount || 100000),
        estimatedProjectCost: formData.estimatedProjectCost ? Number(formData.estimatedProjectCost) : undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    } else if (formData.intent === 'education_loan') {
      payload = {
        intent: 'education_loan',
        isScheduledCaste: formData.isScheduledCaste,
        age: Number(formData.age),
        gender: formData.gender,
        annualFamilyIncome: Number(formData.annualFamilyIncome),
        state: formData.state,
        district: formData.district,
        occupationCategory: formData.occupationCategory,
        occupationType: formData.customOccupation || formData.occupationType,
        customOccupation: formData.customOccupation,
        course: formData.course || '',
        educationStatus: (formData.educationStatus || 'secondary') as any,
        requiredLoanAmount: Number(formData.requiredLoanAmount || 200000),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    } else {
      payload = {
        intent: 'skill_training',
        isScheduledCaste: formData.isScheduledCaste,
        age: Number(formData.age),
        gender: formData.gender,
        annualFamilyIncome: Number(formData.annualFamilyIncome),
        state: formData.state,
        district: formData.district,
        occupationCategory: formData.occupationCategory,
        occupationType: formData.customOccupation || formData.occupationType,
        customOccupation: formData.customOccupation,
        requiredLoanAmount: formData.requiredLoanAmount ? Number(formData.requiredLoanAmount) : undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    }

    console.log('[SchemeWizard] Sending recommendation payload to API:', payload);

    recommendationMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log('[SchemeWizard] Recommendation mutation succeeded:', data);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step Progress Bar */}
      <WizardProgress currentStep={currentStep} onStepClick={handleJumpToStep} />

      {/* React Hook Form Context Provider */}
      <FormProvider {...methods}>
        <div className="mt-8">
          {currentStep === 1 && (
            <PurposeStep onContinue={handleNext} />
          )}

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
              onSubmit={handleSubmit(onSubmitReview, onInvalidSubmit)}
              isLoading={recommendationMutation.isPending}
              errorMessage={submitError || recommendationMutation.error?.message}
            />
          )}

          {currentStep === 6 && (
            <RecommendationResults
              isLoading={recommendationMutation.isPending}
              error={recommendationMutation.error}
              data={resultsData}
              onRetry={handleRetry}
              onReviewProfile={() => handleJumpToStep(5)}
            />
          )}
        </div>
      </FormProvider>
    </div>
  );
}
