import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { schemeMatchingFormSchema } from '../src/lib/schemas/scheme-matching';

// Mirrors what the step-by-step wizard submits: occupation is not collected,
// so those fields still hold their blank form defaults.
const wizardSubmission = {
  intent: 'business_loan',
  isScheduledCaste: true,
  age: 28,
  gender: 'female',
  annualFamilyIncome: 180000,
  state: 'Maharashtra',
  district: 'Pune',
  occupationCategory: '',
  occupationType: '',
  customOccupation: '',
  projectType: 'Tailoring Shop',
  requiredLoanAmount: 120000,
};

describe('schemeMatchingFormSchema occupation fields', () => {
  it('accepts a submission whose occupation fields were left blank', () => {
    const result = schemeMatchingFormSchema.safeParse(wizardSubmission);

    assert.equal(result.success, true, JSON.stringify(result.error?.issues));
    assert.equal(result.data?.occupationCategory, undefined);
    assert.equal(result.data?.occupationType, undefined);
  });

  it('still passes through an occupation supplied by the conversational intake', () => {
    const result = schemeMatchingFormSchema.safeParse({
      ...wizardSubmission,
      occupationCategory: ' Tailoring & Garments ',
      occupationType: 'Tailor',
    });

    assert.equal(result.data?.occupationCategory, 'Tailoring & Garments');
    assert.equal(result.data?.occupationType, 'Tailor');
  });
});
