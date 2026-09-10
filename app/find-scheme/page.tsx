'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SchemeWizard from '@/src/components/scheme-matching/SchemeWizard';
import Icon from '@/components/Icon';

function FindSchemeContent() {
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
        <span className="font-bold text-primary">Find My Scheme</span>
      </nav>

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
