'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SchemeWizard from '@/src/components/scheme-matching/SchemeWizard';
import PageNav from '@/components/PageNav';

function WizardContent() {
  const searchParams = useSearchParams();
  const rawPurpose = searchParams.get('purpose') || searchParams.get('intent');
  
  // Skill training is not offered in the wizard, so ?purpose=skill falls back to business.
  const initialIntent: 'business_loan' | 'education_loan' =
    rawPurpose === 'education' || rawPurpose === 'education_loan' ? 'education_loan' : 'business_loan';

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      <PageNav current="Find My Scheme Wizard" />

      <div className="py-2">
        <SchemeWizard initialIntent={initialIntent} defaultMode="form" />
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-on-surface-variant">Loading scheme matching wizard...</p>
      </div>
    }>
      <WizardContent />
    </Suspense>
  );
}
