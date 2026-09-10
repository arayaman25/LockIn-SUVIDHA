'use client';

import React from 'react';
import Link from 'next/link';
import { Scheme } from '@/lib/data';
import Icon from '@/components/Icon';

export default function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-primary/50 transition-all duration-200">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="bg-secondary-container text-on-secondary-container text-xs px-2.5 py-0.5 rounded-full font-bold inline-block">
              {scheme.categoryLabel}
            </span>
            <span className="text-xs font-semibold text-secondary">
              {scheme.interest}
            </span>
          </div>
          <h3 className="text-lg font-bold font-serif text-primary">
            {scheme.name}
          </h3>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
          {scheme.desc}
        </p>

        <div className="space-y-2 py-3 border-y border-outline-variant/30 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Loan Limit:</span>
            <span className="font-bold text-primary">
              Up to ₹{scheme.maxAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Nodal Ministry:</span>
            <span className="font-medium text-on-surface truncate max-w-[180px]">
              {scheme.ministry}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Moratorium:</span>
            <span className="font-medium text-secondary">
              {scheme.moratorium > 0 ? `${scheme.moratorium} Months Relief` : 'Immediate Start'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between pt-2">
        <Link
          href={`/schemes/${scheme.id}`}
          className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
        >
          <span>View Details</span>
          <Icon name="arrow_forward" className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/apply?scheme=${scheme.id}`}
          className="px-3.5 py-1.5 bg-primary text-surface hover:bg-primary-container rounded-lg font-bold text-xs transition-colors"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
