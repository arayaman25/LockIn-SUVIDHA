'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SUVIDHA_SCHEMES, Scheme } from '@/lib/data';
import Icon from '@/components/Icon';

interface ScheduleRow {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function EmiCalculator() {
  const searchParams = useSearchParams();
  const schemeParam = searchParams.get('scheme');

  // Core Calculator State (Sensible Defaults as specified)
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.0);
  const [loanTenure, setLoanTenure] = useState<number>(5);
  const [moratorium, setMoratorium] = useState<string>('0');

  // Slider bounds
  const [minAmount, setMinAmount] = useState<number>(10000);
  const [maxAmount, setMaxAmount] = useState<number>(1000000);
  const minRate = 4.0;
  const maxRate = 15.0;
  const minTenure = 1;
  const maxTenure = 10;

  // Manual editing input states for inline pills
  const [isEditingAmount, setIsEditingAmount] = useState<boolean>(false);
  const [rawAmountInput, setRawAmountInput] = useState<string>('500000');

  // UI state
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Pre-fill from scheme URL param if arrived from scheme details
  useEffect(() => {
    if (!schemeParam) return;
    const scheme = SUVIDHA_SCHEMES.find(
      (s) => s.id.toLowerCase() === schemeParam.toLowerCase()
    );
    if (!scheme) return;

    setSelectedScheme(scheme);

    // Adjust max/default amount if scheme has specific ceiling
    if (scheme.maxAmount && scheme.maxAmount > 0) {
      const schemeMax = Math.max(1000000, scheme.maxAmount);
      setMaxAmount(schemeMax);
      setLoanAmount(Math.min(500000, scheme.maxAmount));
    }

    // Pre-fill moratorium if scheme indicates it
    const m = scheme.moratorium ?? 0;
    if (m >= 12) setMoratorium('12');
    else if (m >= 9) setMoratorium('9');
    else if (m >= 6) setMoratorium('6');
    else if (m >= 3) setMoratorium('3');
    else setMoratorium('0');

    // Pre-fill interest rate from scheme data if available
    const rateMatch = scheme.interest?.match(/^(\d+(?:\.\d+)?)/);
    if (rateMatch) {
      const parsedRate = parseFloat(rateMatch[1]);
      if (!isNaN(parsedRate) && parsedRate >= minRate && parsedRate <= maxRate) {
        setInterestRate(parsedRate);
      }
    }
  }, [schemeParam]);

  // Reactive Standard Reducing-Balance EMI Calculation
  // Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
  const calculation = useMemo(() => {
    const P = loanAmount;
    const annualRate = interestRate;
    const tenureYears = loanTenure;
    const n = Math.round(tenureYears * 12);
    const r = annualRate / (12 * 100);

    let emi = 0;
    if (r === 0) {
      emi = Math.round(P / n);
    } else {
      const pow = Math.pow(1 + r, n);
      emi = Math.round((P * r * pow) / (pow - 1));
    }

    const totalRepayment = emi * n;
    const totalInterest = Math.max(0, totalRepayment - P);

    // Repayment schedule
    const schedule: ScheduleRow[] = [];
    let balance = P;
    for (let m = 1; m <= n; m++) {
      const monthInterest = Math.round(balance * r);
      let monthPrincipal = emi - monthInterest;
      if (m === n || monthPrincipal > balance) {
        monthPrincipal = balance;
      }
      const remainingBalance = Math.max(0, balance - monthPrincipal);
      schedule.push({
        month: m,
        principal: monthPrincipal,
        interest: monthInterest,
        balance: remainingBalance,
      });
      balance = remainingBalance;
    }

    return {
      emi,
      totalInterest,
      totalRepayment,
      n,
      schedule,
    };
  }, [loanAmount, interestRate, loanTenure]);

  // Reset calculator to default baseline
  const handleReset = () => {
    setLoanAmount(500000);
    setInterestRate(8.0);
    setLoanTenure(5);
    setMoratorium('0');
    setShowSchedule(false);
    setSelectedScheme(null);
    setMinAmount(10000);
    setMaxAmount(1000000);
  };

  // Indian currency formatting helper
  const fmt = (num: number): string => '₹' + Math.round(num).toLocaleString('en-IN');

  // Slider dynamic track fill calculation
  const getTrackStyle = (val: number, min: number, max: number) => {
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    return {
      background: `linear-gradient(to right, #1b4332 0%, #1b4332 ${pct}%, #e5e2db ${pct}%, #e5e2db 100%)`,
    };
  };

  const principalPercent = calculation.totalRepayment > 0
    ? Math.round((loanAmount / calculation.totalRepayment) * 100)
    : 100;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary tracking-tight">
          EMI Calculator
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
          Interactive repayment estimator for first-time and experienced borrowers.
        </p>
      </div>

      {/* Scheme context notice if accessed via a specific scheme */}
      {selectedScheme && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-secondary/10 border border-secondary/25 rounded-2xl text-xs">
          <div className="flex items-center gap-2.5">
            <Icon name="verified" className="w-4 h-4 text-primary shrink-0" />
            <span className="text-on-surface">
              Based on:{' '}
              <strong className="font-bold text-primary">{selectedScheme.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedScheme(null)}
            className="text-[11px] text-on-surface-variant hover:text-error transition-colors underline text-left sm:text-right"
          >
            Clear Scheme Preset
          </button>
        </div>
      )}

      {/* Main 2-Column Responsive Layout: Left ~55%, Right ~45% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================= */}
        {/* LEFT COLUMN: Interactive Sliders & Controls (~55%) */}
        {/* ======================================================= */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-7 shadow-civic space-y-7">
          
          {/* 1. Loan Amount Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="loan-amount-slider" className="text-xs sm:text-sm font-bold text-on-surface">
                Loan Amount
              </label>

              {/* Editable badge pill */}
              <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <span className="text-xs sm:text-sm font-bold text-primary mr-1 select-none">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={isEditingAmount ? rawAmountInput : loanAmount.toLocaleString('en-IN')}
                  onFocus={() => {
                    setIsEditingAmount(true);
                    setRawAmountInput(loanAmount.toString());
                  }}
                  onBlur={() => {
                    setIsEditingAmount(false);
                    const parsed = parseInt(rawAmountInput.replace(/,/g, ''), 10);
                    if (!isNaN(parsed)) {
                      setLoanAmount(Math.min(maxAmount, Math.max(minAmount, parsed)));
                    }
                  }}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9]/g, '');
                    setRawAmountInput(cleaned);
                    const parsed = parseInt(cleaned, 10);
                    if (!isNaN(parsed) && parsed >= minAmount && parsed <= maxAmount) {
                      setLoanAmount(parsed);
                    }
                  }}
                  aria-label="Edit Loan Amount"
                  className="w-24 sm:w-28 text-right font-serif font-bold text-sm sm:text-base text-primary bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Slider */}
            <div className="py-1">
              <input
                id="loan-amount-slider"
                type="range"
                min={minAmount}
                max={maxAmount}
                step={5000}
                value={loanAmount}
                style={getTrackStyle(loanAmount, minAmount, maxAmount)}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                aria-label="Loan Amount Slider"
                aria-valuemin={minAmount}
                aria-valuemax={maxAmount}
                aria-valuenow={loanAmount}
                className="suvidha-slider"
              />
            </div>

            {/* Bounds labels */}
            <div className="flex justify-between items-center text-[11px] font-medium text-on-surface-variant">
              <span>{fmt(minAmount)}</span>
              <span>{fmt(maxAmount)}</span>
            </div>
          </div>

          {/* 2. Interest Rate Slider */}
          <div className="space-y-3 pt-1 border-t border-outline-variant/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label htmlFor="interest-rate-slider" className="text-xs sm:text-sm font-bold text-on-surface block">
                  Interest Rate
                </label>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">
                  Interest rate (% per year)
                </span>
              </div>

              {/* Editable badge pill */}
              <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <input
                  type="number"
                  step="0.1"
                  min={minRate}
                  max={maxRate}
                  value={interestRate}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) setInterestRate(parsed);
                  }}
                  onBlur={() => {
                    if (interestRate < minRate) setInterestRate(minRate);
                    else if (interestRate > maxRate) setInterestRate(maxRate);
                  }}
                  aria-label="Edit Interest Rate"
                  className="w-14 sm:w-16 text-right font-serif font-bold text-sm sm:text-base text-primary bg-transparent focus:outline-none"
                />
                <span className="text-xs sm:text-sm font-bold text-primary ml-1 select-none">%</span>
              </div>
            </div>

            {/* Slider */}
            <div className="py-1">
              <input
                id="interest-rate-slider"
                type="range"
                min={minRate}
                max={maxRate}
                step={0.1}
                value={interestRate}
                style={getTrackStyle(interestRate, minRate, maxRate)}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                aria-label="Interest Rate Slider"
                aria-valuemin={minRate}
                aria-valuemax={maxRate}
                aria-valuenow={interestRate}
                className="suvidha-slider"
              />
            </div>

            {/* Bounds labels */}
            <div className="flex justify-between items-center text-[11px] font-medium text-on-surface-variant">
              <span>{minRate}%</span>
              <span>{maxRate}%</span>
            </div>
          </div>

          {/* 3. Loan Tenure Slider */}
          <div className="space-y-3 pt-1 border-t border-outline-variant/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label htmlFor="loan-tenure-slider" className="text-xs sm:text-sm font-bold text-on-surface block">
                  Loan Tenure
                </label>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">
                  {calculation.n} monthly installments
                </span>
              </div>

              {/* Editable badge pill */}
              <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <input
                  type="number"
                  step="1"
                  min={minTenure}
                  max={maxTenure}
                  value={loanTenure}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    if (!isNaN(parsed)) setLoanTenure(parsed);
                  }}
                  onBlur={() => {
                    if (loanTenure < minTenure) setLoanTenure(minTenure);
                    else if (loanTenure > maxTenure) setLoanTenure(maxTenure);
                  }}
                  aria-label="Edit Loan Tenure"
                  className="w-10 sm:w-12 text-right font-serif font-bold text-sm sm:text-base text-primary bg-transparent focus:outline-none"
                />
                <span className="text-xs sm:text-sm font-bold text-primary ml-1 select-none">
                  {loanTenure === 1 ? 'Year' : 'Years'}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="py-1">
              <input
                id="loan-tenure-slider"
                type="range"
                min={minTenure}
                max={maxTenure}
                step={1}
                value={loanTenure}
                style={getTrackStyle(loanTenure, minTenure, maxTenure)}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                aria-label="Loan Tenure Slider"
                aria-valuemin={minTenure}
                aria-valuemax={maxTenure}
                aria-valuenow={loanTenure}
                className="suvidha-slider"
              />
            </div>

            {/* Bounds labels */}
            <div className="flex justify-between items-center text-[11px] font-medium text-on-surface-variant">
              <span>{minTenure} Year</span>
              <span>{maxTenure} Years</span>
            </div>
          </div>

          {/* 4. Moratorium Dropdown */}
          <div className="space-y-2 pt-1 border-t border-outline-variant/30">
            <label htmlFor="moratorium-select" className="block text-xs sm:text-sm font-bold text-on-surface">
              Moratorium
            </label>
            <div className="relative">
              <select
                id="moratorium-select"
                value={moratorium}
                onChange={(e) => setMoratorium(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer pr-10"
              >
                <option value="0">None</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="9">9 Months</option>
                <option value="12">12 Months</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
                <Icon name="expand_more" className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Moratorium treatment may vary by scheme and lending partner.
            </p>
          </div>

          {/* Footer of Controls: Reset Action */}
          <div className="pt-2 flex items-center justify-between border-t border-outline-variant/30">
            <button
              type="button"
              id="reset-calculator-btn"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-surface-container"
            >
              <Icon name="sync" className="w-3.5 h-3.5" />
              <span>Reset Calculator</span>
            </button>
            <span className="text-[11px] text-on-surface-variant">
              Live updates enabled
            </span>
          </div>

        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN: Result Panel (~45%) */}
        {/* ======================================================= */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/50 rounded-2xl p-6 sm:p-7 shadow-civic space-y-6 lg:sticky lg:top-24">
          <div className="border-b border-outline-variant/30 pb-3">
            <h2 className="text-base sm:text-lg font-serif font-bold text-primary">
              Your Estimated Repayment
            </h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Standard reducing balance schedule
            </p>
          </div>

          {/* Monthly EMI — Primary Visual Highlight */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border-2 border-primary/20 shadow-sm space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">
              Monthly EMI
            </span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-primary tracking-tight">
                {fmt(calculation.emi)}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-on-surface-variant">
                / month
              </span>
            </div>
            {moratorium !== '0' && (
              <p className="text-[11px] text-secondary font-medium pt-1">
                Repayment installments commence after {moratorium} months moratorium.
              </p>
            )}
          </div>

          {/* Secondary Values Grid: Total Interest & Total Repayment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40 space-y-1">
              <span className="block text-[11px] uppercase tracking-wide font-semibold text-on-surface-variant">
                Total Interest
              </span>
              <span className="block text-xl font-serif font-bold text-secondary">
                {fmt(calculation.totalInterest)}
              </span>
            </div>

            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40 space-y-1">
              <span className="block text-[11px] uppercase tracking-wide font-semibold text-on-surface-variant">
                Total Repayment
              </span>
              <span className="block text-xl font-serif font-bold text-primary">
                {fmt(calculation.totalRepayment)}
              </span>
            </div>
          </div>

          {/* Visual Breakdown Bar: Principal vs Interest */}
          <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40 space-y-2.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                Principal ({principalPercent}%)
              </span>
              <span className="text-secondary flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                Interest ({interestPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
              <div
                style={{ width: `${principalPercent}%` }}
                className="h-full bg-primary transition-all duration-300"
              />
              <div
                style={{ width: `${interestPercent}%` }}
                className="h-full bg-secondary transition-all duration-300"
              />
            </div>
          </div>

          {/* Repayment Schedule Toggle CTA */}
          <button
            type="button"
            id="view-schedule-toggle-btn"
            onClick={() => setShowSchedule((prev) => !prev)}
            className="w-full py-3 px-4 rounded-xl border border-outline-variant/80 bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center justify-center gap-2"
          >
            <span>{showSchedule ? 'Hide Repayment Schedule' : 'View Repayment Schedule →'}</span>
            <Icon name={showSchedule ? 'expand_less' : 'expand_more'} className="w-4 h-4 text-primary" />
          </button>

          {/* Proceed to Apply CTA */}
          <Link
            href={selectedScheme ? `/apply?scheme=${selectedScheme.id}` : '/wizard'}
            className="w-full py-3.5 px-4 bg-primary text-on-primary rounded-xl font-bold text-xs sm:text-sm hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
          >
            <span>Proceed to Apply</span>
            <Icon name="arrow_forward" className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* ======================================================= */}
      {/* EXPANDABLE REPAYMENT SCHEDULE TABLE */}
      {/* ======================================================= */}
      {showSchedule && (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-7 shadow-civic space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/30">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-primary">
                Monthly Repayment Schedule
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Principal and interest amortization over {loanTenure} years ({calculation.n} monthly installments)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary px-3 py-1 bg-surface-container-low rounded-lg border border-outline-variant/40">
                Total Installments: {calculation.n}
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border border-outline-variant/40 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant sticky top-0 border-b border-outline-variant/40 shadow-sm">
                <tr>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4 text-right">Principal</th>
                  <th className="py-3 px-4 text-right">Interest</th>
                  <th className="py-3 px-4 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {calculation.schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-on-surface">
                      Month {row.month}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-primary">
                      {fmt(row.principal)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-secondary">
                      {fmt(row.interest)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-on-surface-variant font-mono">
                      {fmt(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
