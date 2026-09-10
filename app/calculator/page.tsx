'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import EmiCalculator from '@/components/EmiCalculator';
import Icon from '@/components/Icon';

export default function CalculatorPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">EMI Calculator</span>
      </nav>

      <div className="py-2">
        <Suspense fallback={<div className="p-8 text-center text-xs text-on-surface-variant">Loading EMI Calculator...</div>}>
          <EmiCalculator />
        </Suspense>
      </div>
    </div>
  );
}
