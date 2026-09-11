'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SchemeWizard from '@/src/components/scheme-matching/SchemeWizard';
import Icon from '@/components/Icon';

function WizardContent() {
  const searchParams = useSearchParams();
  const rawPurpose = searchParams.get('purpose') || searchParams.get('intent');
  
  let initialIntent: 'business_loan' | 'education_loan' | 'skill_training' = 'business_loan';
  if (rawPurpose === 'education' || rawPurpose === 'education_loan') {
    initialIntent = 'education_loan';
  } else if (rawPurpose === 'skill' || rawPurpose === 'skill_training') {
    initialIntent = 'skill_training';
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">Find My Scheme Eligibility Wizard</span>
      </nav>

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
