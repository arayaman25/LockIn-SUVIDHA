'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';

export default function FindSchemeResultsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
        <Icon name="search" size={28} />
      </div>
      <h1 className="text-3xl font-serif font-bold text-on-surface mb-3">
        Scheme Recommendations
      </h1>
      <p className="text-on-surface-variant max-w-md mx-auto text-sm leading-relaxed mb-8">
        Scheme recommendations are generated specifically based on your caste status, income bracket, occupation, and financial requirements.
      </p>
      <Link
        href="/find-scheme"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-sm transition-colors"
      >
        <Icon name="sparkles" size={16} />
        Start Scheme Matching Wizard
      </Link>
    </div>
  );
}
