'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SchemeWizard from '@/src/components/scheme-matching/SchemeWizard';
import PageNav from '@/components/PageNav';

function FindSchemeContent() {
  const searchParams = useSearchParams();
  const rawPurpose = searchParams.get('purpose') || searchParams.get('intent');
  
  // Skill training is not offered in the wizard, so ?purpose=skill falls back to business.
  const initialIntent: 'business_loan' | 'education_loan' =
    rawPurpose === 'education' || rawPurpose === 'education_loan' ? 'education_loan' : 'business_loan';

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-8">
      <PageNav current="Find My Scheme" />

      {/* Hero Intro Header */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 bg-secondary-container text-secondary text-xs font-semibold rounded-full mb-2">
          Official Ministry Scheme Engine
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-on-surface">
          Find Ministry Schemes Suited for You
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">
          Answer a few quick questions about your livelihood, community profile, and credit needs to discover customized government credit and subsidy programs.
        </p>
      </div>

      <div className="py-2">
        <SchemeWizard initialIntent={initialIntent} />
      </div>
    </div>
  );
}

export default function FindSchemePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-on-surface-variant">Loading scheme matching assistant...</p>
      </div>
    }>
      <FindSchemeContent />
    </Suspense>
  );
}
