'use client';

import React from 'react';
import Icon from '@/components/Icon';

interface RateBadgeProps {
  ratePercent: number;
  channelName?: string;
}

export default function RateBadge({ ratePercent, channelName }: RateBadgeProps) {
  return (
    <div className="bg-secondary-container/30 border border-secondary/20 rounded-2xl p-4.5 space-y-2.5 transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon name="lock" size={16} />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-secondary block">
              NSFDC Mandated • Read Only
            </span>
            <span className="text-xs font-bold text-on-surface">
              Official Beneficiary Interest Rate (आधिकारिक ब्याज दर)
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-serif font-black text-primary tracking-tight">
            {ratePercent.toFixed(1)}%
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant block">
            per annum (वार्षिक)
          </span>
        </div>
      </div>

      {channelName && (
        <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
          <Icon name="info" size={14} className="text-secondary shrink-0" />
          <span>
            Financed through: <strong className="text-on-surface font-semibold">{channelName}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
