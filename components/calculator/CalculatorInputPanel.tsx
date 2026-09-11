'use client';

import React from 'react';
import {
  SchemeFinancialTerms,
  PartnerTypeCode,
  EducationLocation,
} from './calculator.types';
import { NSFDC_SCHEMES } from './calculator.schemes';
import CalculatorSlider from './CalculatorSlider';
import RateBadge from './RateBadge';
import Icon from '@/components/Icon';

interface CalculatorInputPanelProps {
  selectedScheme: SchemeFinancialTerms;
  onSchemeChange: (schemeCode: string) => void;
  selectedChannel?: PartnerTypeCode;
  onChannelChange: (channel: PartnerTypeCode) => void;
  educationLocation: EducationLocation;
  onEducationLocationChange: (loc: EducationLocation) => void;
  projectCost?: number;
  onProjectCostChange: (cost: number) => void;
  principal: number;
  onPrincipalChange: (amount: number) => void;
  tenureMonths: number;
  onTenureChange: (tenure: number) => void;
  ratePercent: number;
  channelName: string;
  minLoan: number;
  effectiveMaxLoan: number;
  loanError?: string;
  tenureError?: string;
}

export default function CalculatorInputPanel({
  selectedScheme,
  onSchemeChange,
  selectedChannel,
  onChannelChange,
  educationLocation,
  onEducationLocationChange,
  projectCost,
  onProjectCostChange,
  principal,
  onPrincipalChange,
  tenureMonths,
  onTenureChange,
  ratePercent,
  channelName,
  minLoan,
  effectiveMaxLoan,
  loanError,
  tenureError,
}: CalculatorInputPanelProps) {
  const showProjectCost =
    typeof selectedScheme.projectCostMax === 'number' &&
    selectedScheme.projectCostMax > 0 &&
    selectedScheme.maxProjectCostCoveragePercent < 100;

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/60 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="border-b border-outline-variant/30 pb-4">
        <h3 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
          <Icon name="sliders" size={18} className="text-secondary" />
          <span>Loan &amp; Scheme Parameters (ऋण एवं योजना चयन)</span>
        </h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Select an official NSFDC scheme to view designated interest ceilings, permissible limits, and tenures.
        </p>
      </div>

      {/* 1. Scheme Selector */}
      <div className="space-y-1.5">
        <label htmlFor="scheme-select" className="block text-xs sm:text-sm font-bold text-on-surface">
          Select Official Scheme (योजना का चयन करें) <span className="text-error">*</span>
        </label>
        <div className="relative">
          <select
            id="scheme-select"
            value={selectedScheme.code}
            onChange={(e) => onSchemeChange(e.target.value)}
            className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs appearance-none cursor-pointer"
          >
            {NSFDC_SCHEMES.map((scheme) => (
              <option key={scheme.code} value={scheme.code}>
                {scheme.name} — {scheme.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <Icon name="chevron-down" size={16} />
          </div>
        </div>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          {selectedScheme.description}
        </p>
      </div>

      {/* 2. Conditional: Education Location (for ELS) */}
      {selectedScheme.requiresEducationLocation && (
        <div className="p-4 rounded-xl bg-secondary-container/20 border border-secondary/20 space-y-2 animate-in fade-in duration-150">
          <label className="block text-xs font-bold text-on-surface">
            Location of Education (अध्ययन का स्थान) <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onEducationLocationChange('india')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
                educationLocation === 'india'
                  ? 'border-primary bg-primary text-white shadow-xs'
                  : 'border-outline-variant bg-surface text-on-surface hover:border-primary/40'
              }`}
            >
              <Icon name="map-pin" size={14} />
              <span>Studies in India (भारत में - Max ₹30L)</span>
            </button>
            <button
              type="button"
              onClick={() => onEducationLocationChange('abroad')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
                educationLocation === 'abroad'
                  ? 'border-primary bg-primary text-white shadow-xs'
                  : 'border-outline-variant bg-surface text-on-surface hover:border-primary/40'
              }`}
            >
              <Icon name="globe" size={14} />
              <span>Studies Abroad (विदेश में - Max ₹40L)</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Conditional: Lending Channel Selection (for UNY) */}
      {selectedScheme.hasChannelDependentRates && selectedScheme.channelSlabs.length > 1 && (
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2.5 animate-in fade-in duration-150">
          <label className="block text-xs font-bold text-on-surface">
            Select Financing Partner Channel (ऋणदाता चैनल का चयन करें) <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedScheme.channelSlabs.map((slab) => {
              const isSelected = (selectedChannel || selectedScheme.channelSlabs[0].channel) === slab.channel;
              return (
                <button
                  key={slab.channel}
                  type="button"
                  onClick={() => onChannelChange(slab.channel)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-secondary-container/30 ring-1 ring-primary/40 text-on-surface'
                      : 'border-outline-variant bg-surface text-on-surface-variant hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-on-surface">{slab.channelName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-extrabold text-[11px]">
                      {slab.ratePercent.toFixed(1)}% p.a.
                    </span>
                  </div>
                  {slab.description && (
                    <span className="text-[10px] text-on-surface-variant mt-1">{slab.description}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Official Read-Only Interest Rate Badge */}
      <RateBadge ratePercent={ratePercent} channelName={channelName} />

      {/* 5. Conditional: Project Cost Input */}
      {showProjectCost && (
        <div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
          <div className="flex items-center justify-between">
            <label htmlFor="project-cost-input" className="block text-xs sm:text-sm font-bold text-on-surface">
              Total Project Cost (कुल परियोजना लागत)
            </label>
            {projectCost && projectCost > 0 ? (
              <span className="text-xs font-bold text-primary">₹{projectCost.toLocaleString('en-IN')}</span>
            ) : null}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-xs font-bold text-on-surface-variant pointer-events-none">
              ₹
            </span>
            <input
              id="project-cost-input"
              type="text"
              inputMode="numeric"
              value={projectCost ? projectCost.toLocaleString('en-IN') : ''}
              placeholder="e.g. 1,00,000"
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                onProjectCostChange(raw ? parseInt(raw, 10) : 0);
              }}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Max loan coverage is {selectedScheme.maxProjectCostCoveragePercent}% of project cost (up to ₹{selectedScheme.maxLoanAmount.toLocaleString('en-IN')}).
          </p>
        </div>
      )}

      {/* 6. Loan Amount Slider & Input */}
      <div className="pt-2 border-t border-outline-variant/30">
        <CalculatorSlider
          label="Loan Amount"
          labelHindi="ऋण राशि"
          value={principal}
          min={minLoan}
          max={effectiveMaxLoan}
          step={minLoan >= 50000 ? 10000 : 5000}
          isCurrency={true}
          onChange={onPrincipalChange}
          error={loanError}
          helperText={`Permissible range: ₹${minLoan.toLocaleString('en-IN')} to ₹${effectiveMaxLoan.toLocaleString('en-IN')}`}
        />
      </div>

      {/* 7. Repayment Tenure Slider & Input */}
      <div className="pt-2 border-t border-outline-variant/30">
        <CalculatorSlider
          label="Repayment Tenure"
          labelHindi="पुनर्भुगतान अवधि"
          value={tenureMonths}
          min={6}
          max={selectedScheme.repaymentTenureMonthsMax}
          step={selectedScheme.repaymentTenureMonthsMax <= 36 ? 3 : 6}
          unitSuffix="Months (महीने)"
          onChange={onTenureChange}
          error={tenureError}
          helperText={`Maximum allowable tenure: ${selectedScheme.repaymentTenureMonthsMax} months (${(selectedScheme.repaymentTenureMonthsMax / 12).toFixed(1)} years)`}
        />
      </div>
    </div>
  );
}
