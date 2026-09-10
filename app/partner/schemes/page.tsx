'use client';

import React from 'react';
import Link from 'next/link';
import { SUVIDHA_SCHEMES } from '@/lib/data';
import { useApp } from '@/context/AppContext';

export default function PartnerSchemesPage() {
  const { showNotification } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Partner
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Scheme Availability</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Branch Scheme Sanction Quotas &amp; Availability
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Active credit schemes available for direct assisted processing at this branch desk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUVIDHA_SCHEMES.map((scheme) => (
          <div
            key={scheme.id}
            className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-3"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container uppercase">
                {scheme.categoryLabel}
              </span>
              <span className="text-xs font-bold text-[#086d46] bg-primary-fixed/40 px-2 py-0.5 rounded">
                Available at Branch ✓
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-primary">
              {scheme.name}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {scheme.desc}
            </p>
            <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center text-xs">
              <span className="text-secondary font-bold">{scheme.interest}</span>
              <button
                type="button"
                onClick={() => showNotification(`Quota availability confirmed for ${scheme.name}.`, 'info')}
                className="text-primary font-bold hover:underline"
              >
                Check Quota Limit →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
