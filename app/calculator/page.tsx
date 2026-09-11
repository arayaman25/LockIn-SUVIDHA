'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import SchemeEmiCalculator from '@/components/calculator/SchemeEmiCalculator';
import Icon from '@/components/Icon';

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 pb-2 border-b border-stone-200">
        <Link href="/" className="hover:text-[#00472f] flex items-center gap-1 transition-colors">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#00472f]">EMI Calculator</span>
      </nav>

      <div className="py-2">
        <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading SUVIDHA EMI Calculator...</div>}>
          <SchemeEmiCalculator />
        </Suspense>
      </div>
    </div>
  );
}
