'use client';

import React, { Suspense } from 'react';
import PartnerLocator from '@/components/PartnerLocator';
import { SchemeToolPageNav } from '@/components/PageNav';

export default function LocatorPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      <SchemeToolPageNav current="Channel Partner Locator" />

      <div className="py-2">
        <Suspense fallback={<div className="min-h-[460px]" />}>
          <PartnerLocator />
        </Suspense>
      </div>
    </div>
  );
}
