'use client';

import React, { Suspense } from 'react';
import SchemeEmiCalculator from '@/components/calculator/SchemeEmiCalculator';
import { SchemeToolPageNav } from '@/components/PageNav';

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <SchemeToolPageNav current="EMI Calculator" />

      <div className="py-2">
        <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading SUVIDHA EMI Calculator...</div>}>
          <SchemeEmiCalculator />
        </Suspense>
      </div>
    </div>
  );
}
