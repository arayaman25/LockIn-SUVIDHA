'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SchemeFinancialTerms, EmiCalculationResult } from './calculator.types';
import Icon from '@/components/Icon';

interface CalculatorResultsProps {
  scheme: SchemeFinancialTerms;
  result: EmiCalculationResult;
  effectiveMaxLoan: number;
}

function formatINR(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export default function CalculatorResults({
  scheme,
  result,
  effectiveMaxLoan,
}: CalculatorResultsProps) {
  const router = useRouter();
  const isQuarterly = result.repaymentFrequency === 'quarterly';
  const quarterlyAmount = result.quarterlyEquivalentInstallment ?? result.monthlyEmi * 3;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero EMI Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#00472f] via-[#005a3c] to-[#013824] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-[#005a3c]/30">
        {/* Background watermark badge */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Icon name="calculate" size={180} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200/90 bg-emerald-900/40 border border-emerald-400/20 px-3 py-1 rounded-full">
              {scheme.code} • {isQuarterly ? 'Quarterly Schedule (त्रैमासिक)' : 'Monthly Schedule (मासिक)'}
            </span>
            <span className="text-xs text-emerald-200/70">
              Reducing Balance (घटते शेष पर)
            </span>
          </div>

          <p className="text-sm font-medium text-emerald-100/90 mt-2">
            Estimated Monthly Installment (अनुमानित मासिक किस्त)
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
              ₹{formatINR(result.monthlyEmi)}
            </span>
            <span className="text-sm text-emerald-200/80 font-normal">/ month</span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-200/80 mt-2">
            Tenure: <span className="font-semibold text-white">{result.tenureMonths} months</span> @{' '}
            <span className="font-semibold text-white">{result.annualRatePercent}% p.a.</span>
            {' '}(अवधि: {result.tenureMonths} माह @ {result.annualRatePercent}% प्रति वर्ष)
          </p>
        </div>
      </div>

      {/* Quarterly Explanatory Alert (Amber) */}
      {isQuarterly && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-900 shadow-sm flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
            <Icon name="info" size={20} />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold text-amber-950">
              Quarterly Repayment Schedule Notice (त्रैमासिक भुगतान सूचना)
            </p>
            <p className="mt-1 text-amber-900/90">
              Under <strong>{scheme.name} ({scheme.code})</strong>, installments are collected{' '}
              <strong>quarterly (every 3 months)</strong>. The monthly figure above (₹{formatINR(result.monthlyEmi)}/mo)
              is an annualized benchmark for easy comparison.
            </p>
            <p className="mt-1 font-semibold text-amber-950">
              Your actual quarterly installment will be approx. ₹{formatINR(quarterlyAmount)} per quarter (प्रति तिमाही).
            </p>
          </div>
        </div>
      )}

      {/* Key Financial Metrics (4-grid) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Principal */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            Principal Amount (मूल ऋण राशि)
          </div>
          <div className="text-lg sm:text-xl font-bold text-stone-900 font-mono mt-1">
            ₹{formatINR(result.principal)}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Disbursed amount</div>
        </div>

        {/* Total Interest */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            Total Interest (कुल ब्याज)
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-800 font-mono mt-1">
            ₹{formatINR(result.totalInterest)}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            Over {result.tenureMonths} months
          </div>
        </div>

        {/* Total Repayment */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            Total Repayment (कुल देय राशि)
          </div>
          <div className="text-lg sm:text-xl font-bold text-stone-900 font-mono mt-1">
            ₹{formatINR(result.totalRepayment)}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Principal + Interest</div>
        </div>

        {/* Moratorium */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            Moratorium (मोराटोरियम अवधि)
          </div>
          <div className="text-base sm:text-lg font-bold text-stone-800 mt-1">
            {result.moratoriumPeriod}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Repayment holiday</div>
        </div>
      </div>

      {/* Scheme Parameters Card */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="verified" size={16} className="text-[#00472f]" />
          Official Scheme Parameters (योजना विवरण)
        </h4>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Category (श्रेणी):</span>
            <span className="font-semibold text-stone-800 text-right">{scheme.category}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Maximum Loan Ceiling (अधिकतम ऋण सीमा):</span>
            <span className="font-semibold text-stone-800 font-mono text-right">
              ₹{formatINR(effectiveMaxLoan)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Repayment Frequency (भुगतान आवृत्ति):</span>
            <span className="font-semibold text-stone-800 text-right">
              {scheme.repaymentFrequency === 'quarterly'
                ? 'Quarterly (त्रैमासिक - हर 3 माह)'
                : 'Monthly (मासिक)'}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Repayment Tenure (अधिकतम अवधि):</span>
            <span className="font-semibold text-stone-800 text-right">
              Up to {scheme.repaymentTenureMonthsMax} months ({scheme.repaymentTenureMonthsMax / 12} years)
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Moratorium Permitted (मोराटोरियम):</span>
            <span className="font-semibold text-stone-800 text-right">
              {scheme.moratoriumMonthsMax > 0
                ? `${scheme.moratoriumMonthsMin} to ${scheme.moratoriumMonthsMax} months`
                : 'None'}
            </span>
          </div>

          {scheme.specialNotes && (
            <div className="pt-2">
              <span className="text-stone-500 block mb-1">Special Guidelines (विशेष टिप्पणी):</span>
              <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 leading-relaxed">
                {scheme.specialNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {/* Primary Action */}
        <button
          type="button"
          onClick={() => router.push('/locator')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00472f] hover:bg-[#003824] text-white text-sm font-semibold shadow-md transition-all active:scale-[0.99]"
        >
          <Icon name="location_on" size={18} />
          <span>Find Nearby Agency (निकटतम एजेंसी खोजें)</span>
        </button>

        {/* Secondary Action */}
        {scheme.sourceUrl && (
          <a
            href="https://nsfdc.nic.in/scheme"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs sm:text-sm font-medium shadow-sm transition-colors"
          >
            <Icon name="open_in_new" size={16} className="text-stone-500" />
            <span>NSFDC Guidelines (दिशानिर्देश)</span>
          </a>
        )}
      </div>
    </div>
  );
}
