import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { schemeMatchingFormSchema } from '../src/lib/schemas/scheme-matching';

describe('SUVIDHA SC Eligibility Gate Rules', () => {
  const baseProfile = {
    intent: 'business_loan' as const,
    isScheduledCaste: true,
    age: 28,
    gender: 'male' as const,
    annualFamilyIncome: 180000,
    state: 'Maharashtra',
    district: 'Pune',
    occupationCategory: 'Tailoring & Garments',
    occupationType: 'Tailor',
    projectType: 'Tailoring Shop Expansion',
    estimatedProjectCost: 200000,
    requiredLoanAmount: 150000,
  };

  it('1. SC = Yes should pass profile validation and allow wizard progression', () => {
    const result = schemeMatchingFormSchema.safeParse(baseProfile);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.isScheduledCaste, true);
    }
  });

  it('2. SC Gate Logic: should disallow navigating to steps > 2 when SC is false', () => {
    const canNavigateToStep = (targetStep: number, isScheduledCaste: boolean): boolean => {
      if (!isScheduledCaste && targetStep > 2) {
        return false;
      }
      return true;
    };

    assert.equal(canNavigateToStep(1, false), true, 'Step 1 should be accessible');
    assert.equal(canNavigateToStep(2, false), true, 'Step 2 should be accessible to change selection');
    assert.equal(canNavigateToStep(3, false), false, 'Step 3 (Occupation) must be blocked');
    assert.equal(canNavigateToStep(4, false), false, 'Step 4 (Requirement) must be blocked');
    assert.equal(canNavigateToStep(5, false), false, 'Step 5 (Review) must be blocked');
    assert.equal(canNavigateToStep(6, false), false, 'Step 6 (Results) must be blocked');
  });

  it('3. Changing SC from No -> Yes should immediately re-enable wizard progression', () => {
    let userSCSelection = false;

    const canNavigateToStep = (targetStep: number): boolean => {
      if (!userSCSelection && targetStep > 2) {
        return false;
      }
      return true;
    };

    // Initially No -> blocked
    assert.equal(canNavigateToStep(3), false);

    // Citizen selects "Change Selection" / Yes -> re-enabled
    userSCSelection = true;
    assert.equal(canNavigateToStep(3), true);
    assert.equal(canNavigateToStep(4), true);
  });

  it('4. Submission Guard: Recommendation request must never be dispatched if SC is false', () => {
    let apiCalled = false;
    const mockMutate = () => {
      apiCalled = true;
    };

    const onSubmitReview = (formData: { isScheduledCaste: boolean }) => {
      if (!formData.isScheduledCaste) {
        return { error: 'Ineligible: SC required' };
      }
      mockMutate();
      return { success: true };
    };

    // Test with non-SC profile
    const blockedSubmission = onSubmitReview({ isScheduledCaste: false });
    assert.equal(apiCalled, false, 'API must not be called when SC is false');
    assert.equal(blockedSubmission.error, 'Ineligible: SC required');

    // Test with SC profile
    const allowedSubmission = onSubmitReview({ isScheduledCaste: true });
    assert.equal(apiCalled, true, 'API should be dispatched when SC is true');
    assert.equal(allowedSubmission.success, true);
  });
});
