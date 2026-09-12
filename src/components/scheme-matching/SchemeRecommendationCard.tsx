'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { SchemeRecommendationItem } from '@/src/types/scheme-matching';
import PartnerRecommendations from './PartnerRecommendations';

interface SchemeRecommendationCardProps {
  scheme: SchemeRecommendationItem;
  rank: number;
  citizenDistrict?: string;
  citizenState?: string;
}

export default function SchemeRecommendationCard({
  scheme,
  rank,
  citizenDistrict,
  citizenState,
}: SchemeRecommendationCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showPartners, setShowPartners] = useState(false);

  const formatAmount = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return val;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Crore`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const isTopMatch = rank === 1;

  return (
    <div
      className={`rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
        isTopMatch
          ? 'border-primary bg-surface-container-lowest shadow-civic ring-1 ring-primary/25'
          : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/40 shadow-xs'
      }`}
    >
      {/* Header: Rank, Score Badge, Scheme Name */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          {isTopMatch && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-white flex items-center gap-1 shadow-xs">
              <Icon name="verified" className="w-3.5 h-3.5 text-white" />
              <span>Top Recommendation</span>
            </span>
          )}
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
            Rank #{rank}
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-on-surface-variant font-medium">Match Fit:</span>
          <span className="text-sm sm:text-base font-serif font-bold text-primary px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">
            {scheme.matchScore}% Match
          </span>
        </div>
      </div>

      {/* Scheme Title and Reasoning */}
      <div className="space-y-2">
        <h4 className="text-lg sm:text-xl font-serif font-bold text-primary">
          {scheme.schemeName}
        </h4>
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface leading-relaxed">
          <p className="font-medium">
            <span className="text-primary font-bold">Why it suits you: </span>
            {scheme.reasoning}
          </p>
        </div>
      </div>

      {/* Financial terms grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
            Loan Range
          </span>
          <span className="font-serif font-bold text-primary text-sm mt-0.5 block">
            {formatAmount(scheme.minLoanAmount)} – {formatAmount(scheme.maxLoanAmount)}
          </span>
        </div>

        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
            Interest Rate
          </span>
          <span className="font-serif font-bold text-secondary text-sm mt-0.5 block">
            {scheme.interestRateMin}% – {scheme.interestRateMax}% p.a.
          </span>
        </div>

        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
            Repayment Tenure
          </span>
          <span className="font-serif font-bold text-primary text-sm mt-0.5 block">
            Up to {scheme.repaymentTenureMonths} Months
          </span>
        </div>

        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
            Moratorium Relief
          </span>
          <span className="font-serif font-bold text-primary text-sm mt-0.5 block">
            {scheme.moratoriumMonthsMin === scheme.moratoriumMonthsMax
              ? `${scheme.moratoriumMonthsMin} Months`
              : `${scheme.moratoriumMonthsMin} – ${scheme.moratoriumMonthsMax} Months`}
          </span>
        </div>
      </div>

      {/* Expandable Score Breakdown */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowBreakdown((prev) => !prev)}
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 py-1"
        >
          <span>{showBreakdown ? 'Hide match score breakdown' : 'Why this was recommended (Score Details)'}</span>
          <Icon name={showBreakdown ? 'expand_less' : 'expand_more'} className="w-4 h-4 text-primary" />
        </button>

        {showBreakdown && (
          <div className="mt-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-xs font-bold text-primary">Detailed Fit Breakdown</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Weighted Eligibility Model</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Purpose Fit</span>
                <span className="font-bold text-primary">{scheme.scoreBreakdown.intentFit} / 20 pts</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Loan Amount Fit</span>
                <span className="font-bold text-primary">{scheme.scoreBreakdown.loanAmountFit} / 20 pts</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Project Cost Fit</span>
                <span className="font-bold text-primary">{scheme.scoreBreakdown.projectCostFit} / 15 pts</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Occupation Fit</span>
                <span className="font-bold text-primary">{scheme.scoreBreakdown.occupationFit} / 15 pts</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Income Headroom Fit</span>
                <span className="font-bold text-primary">{scheme.scoreBreakdown.incomeFit} / 10 pts</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant block text-[11px]">Location &amp; Education</span>
                <span className="font-bold text-primary">
                  {scheme.scoreBreakdown.educationFit + scheme.scoreBreakdown.locationFit} / 15 pts
                </span>
              </div>
            </div>

            {/* Documents checklist */}
            {scheme.requiredDocuments?.length > 0 && (
              <div className="pt-2 border-t border-outline-variant/20">
                <span className="text-[11px] font-bold text-primary block mb-1.5">
                  Required Verification Documents:
                </span>
                <ul className="space-y-1 text-xs text-on-surface-variant">
                  {scheme.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-secondary font-bold">✓</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* View Details */}
          <Link
            href={`/schemes/${scheme.schemeCode || scheme.schemeId}?from=wizard&schemeName=${encodeURIComponent(scheme.schemeName)}`}
            className="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface text-xs font-bold text-primary transition-all shadow-xs"
          >
            View Details
          </Link>

          {/* Calculate EMI */}
          <Link
            href={`/calculator?scheme=${scheme.schemeCode || scheme.schemeId}&from=wizard&schemeName=${encodeURIComponent(scheme.schemeName)}`}
            className="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface text-xs font-bold text-secondary hover:text-primary transition-all shadow-xs flex items-center gap-1.5"
          >
            <Icon name="calculate" className="w-3.5 h-3.5" />
            <span>Calculate EMI</span>
          </Link>

          {/* Find Partner Toggle */}
          <button
            type="button"
            onClick={() => setShowPartners((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              showPartners
                ? 'bg-secondary text-white border-secondary'
                : 'border-outline-variant bg-surface-container-lowest hover:bg-surface text-secondary hover:text-primary'
            }`}
          >
            <Icon name="pin_drop" className="w-3.5 h-3.5" />
            <span>{showPartners ? 'Hide Desk' : 'Nodal Desk Info'}</span>
          </button>

          {/* CA & Partner Desk Finder */}
          <Link
            href={`/locator?scheme=${encodeURIComponent(scheme.schemeCode || scheme.schemeId)}&from=wizard&schemeName=${encodeURIComponent(scheme.schemeName)}`}
            className="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface text-xs font-bold text-secondary hover:text-primary transition-all shadow-xs flex items-center gap-1.5"
          >
            <Icon name="location_on" className="w-3.5 h-3.5" />
            <span>CA &amp; Partner Finder</span>
          </Link>
        </div>

        {/* Primary Apply Action */}
        <Link
          href={`/apply?scheme=${scheme.schemeCode || scheme.schemeId}&from=wizard&schemeName=${encodeURIComponent(scheme.schemeName)}`}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-sm flex items-center gap-2 active:scale-[0.99]"
        >
          <span>Apply Now</span>
          <Icon name="arrow_forward" className="w-4 h-4" />
        </Link>
      </div>

      {/* Embedded Partner Finder when requested */}
      {showPartners && (
        <PartnerRecommendations
          schemeId={scheme.schemeId}
          schemeName={scheme.schemeName}
          citizenDistrict={citizenDistrict}
          citizenState={citizenState}
        />
      )}
    </div>
  );
}
