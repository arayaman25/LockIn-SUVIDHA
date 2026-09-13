'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/Icon';
import { SchemeRecommendationItem } from '@/src/types/scheme-matching';

interface BackToPreferredSchemesProps {
  currentSchemeTitle?: string;
  className?: string;
}

export default function BackToPreferredSchemes({
  currentSchemeTitle,
  className = '',
}: BackToPreferredSchemesProps) {
  const searchParams = useSearchParams();
  const fromWizard = searchParams.get('from') === 'wizard';
  const paramSchemeName = searchParams.get('schemeName');

  const [hasSavedSchemes, setHasSavedSchemes] = useState(false);
  const [preferredMatches, setPreferredMatches] = useState<SchemeRecommendationItem[]>([]);
  const [wizardOrigin, setWizardOrigin] = useState<string>('/wizard?step=results');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem('suvidha_preferred_schemes');
      if (saved) {
        const parsed = JSON.parse(saved);
        const matches = parsed?.results?.data?.matches;
        if (Array.isArray(matches) && matches.length > 0) {
          setHasSavedSchemes(true);
          setPreferredMatches(matches);
        }
      }
    } catch (e) {
      console.warn('Failed to read preferred schemes from sessionStorage', e);
    }
  }, []);

  // Only show when explicitly navigated from the scheme matchmaking wizard (from=wizard)
  if (!fromWizard) {
    return null;
  }

  const activeTitle = currentSchemeTitle || paramSchemeName || 'Selected Scheme';
  const matchCount = preferredMatches.length || 3;

  return (
    <div
      className={`mb-6 p-4 rounded-2xl bg-surface-container-lowest border-2 border-primary/30 shadow-sm space-y-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
            <Icon name="verified" className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                Scheme Recommendation Session
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-white">
                {matchCount} Schemes Matched
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Viewing details for <strong className="text-primary font-semibold">{activeTitle}</strong>. You can return to your top recommended schemes list at any time.
            </p>
          </div>
        </div>

        {/* Primary Back Button */}
        <Link
          href={wizardOrigin}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 active:scale-[0.98] cursor-pointer"
        >
          <Icon name="arrow_back" className="w-4 h-4" />
          <span>Back to Preferred Schemes ({matchCount})</span>
        </Link>
      </div>

      {/* Quick switcher if multiple preferred schemes are loaded */}
      {preferredMatches.length > 1 && (
        <div className="pt-2.5 border-t border-outline-variant/30 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-on-surface-variant font-medium text-[11px]">
            Quick jump to another matched scheme:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {preferredMatches.map((m, idx) => {
              const code = m.schemeCode || m.schemeId;
              const isCurrent =
                (code && searchParams.get('scheme')?.toUpperCase() === code.toUpperCase()) ||
                activeTitle.toLowerCase().includes(m.schemeName.toLowerCase());

              return (
                <Link
                  key={m.schemeId || idx}
                  href={`?scheme=${encodeURIComponent(code)}&from=wizard&schemeName=${encodeURIComponent(m.schemeName)}`}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40'
                  }`}
                >
                  <span className="opacity-75">#{idx + 1}</span>
                  <span>{m.schemeName}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
