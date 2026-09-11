'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './calculator.css';

import {
  PartnerTypeCode,
  EducationLocation,
} from './calculator.types';
import {
  NSFDC_SCHEMES,
  DEFAULT_SCHEME_CODE,
  getSchemeByCode,
} from './calculator.schemes';
import {
  resolveApplicableRateAndChannel,
  resolveMaxPermissibleLoan,
  computeSchemeEmi,
} from './calculator.engine';

import CalculatorInputPanel from './CalculatorInputPanel';
import CalculatorResults from './CalculatorResults';
import AgencyModal from './AgencyModal';
import Icon from '@/components/Icon';

export default function SchemeEmiCalculator() {
  const searchParams = useSearchParams();
  const initialSchemeParam = searchParams.get('scheme')?.toUpperCase();

  // Selected scheme code
  const [schemeCode, setSchemeCode] = useState<string>(() => {
    if (initialSchemeParam && NSFDC_SCHEMES.some((s) => s.code === initialSchemeParam)) {
      return initialSchemeParam;
    }
    return DEFAULT_SCHEME_CODE;
  });

  const selectedScheme = useMemo(() => {
    return getSchemeByCode(schemeCode) || NSFDC_SCHEMES[0];
  }, [schemeCode]);

  // Education location for schemes that require it (e.g. ELS)
  const [educationLocation, setEducationLocation] = useState<EducationLocation>('india');

  // Channel selection (e.g. for UNY which has cooperative_bank vs small_finance_bank)
  const [selectedChannel, setSelectedChannel] = useState<PartnerTypeCode | undefined>(() => {
    return selectedScheme.channelSlabs[0]?.channel;
  });

  // Project cost (for schemes with coverage limit such as TL)
  const [projectCost, setProjectCost] = useState<number | undefined>(() => {
    if (selectedScheme.projectCostMax && selectedScheme.projectCostMax > 0) {
      return Math.min(500000, selectedScheme.projectCostMax);
    }
    return undefined;
  });

  // Calculate effective max permissible loan
  const effectiveMaxLoan = useMemo(() => {
    return resolveMaxPermissibleLoan(selectedScheme, educationLocation, projectCost).effectiveMax;
  }, [selectedScheme, educationLocation, projectCost]);

  const minLoan = selectedScheme.minLoanAmount;

  // Principal loan amount
  const [principal, setPrincipal] = useState<number>(() => {
    // Sensible initial principal: 50% of effective max or 5,00,000, clamped to minLoan..maxLoan
    const initialEffectiveMax = resolveMaxPermissibleLoan(
      getSchemeByCode(initialSchemeParam && NSFDC_SCHEMES.some((s) => s.code === initialSchemeParam) ? initialSchemeParam : DEFAULT_SCHEME_CODE) || NSFDC_SCHEMES[0],
      'india'
    ).effectiveMax;
    const target = Math.min(500000, initialEffectiveMax);
    return Math.max(minLoan, target);
  });

  // Tenure in months
  const [tenureMonths, setTenureMonths] = useState<number>(() => {
    // Default to max tenure or 36 months, whichever is smaller
    return Math.min(36, selectedScheme.repaymentTenureMonthsMax);
  });

  // Agency discovery modal state
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState<boolean>(false);

  // Synchronize defaults whenever scheme code changes
  useEffect(() => {
    // Channel sync
    const firstChannel = selectedScheme.channelSlabs[0]?.channel;
    setSelectedChannel(firstChannel);

    // Project cost sync
    if (selectedScheme.projectCostMax && selectedScheme.projectCostMax > 0) {
      setProjectCost(Math.min(500000, selectedScheme.projectCostMax));
    } else {
      setProjectCost(undefined);
    }

    // Recalculate max loan and clamp principal
    const newEffectiveMax = resolveMaxPermissibleLoan(selectedScheme, educationLocation).effectiveMax;
    setPrincipal((prev) => {
      if (prev < selectedScheme.minLoanAmount) {
        return selectedScheme.minLoanAmount;
      }
      if (prev > newEffectiveMax) {
        return newEffectiveMax;
      }
      return prev;
    });

    // Clamp tenure
    setTenureMonths((prev) => {
      if (prev > selectedScheme.repaymentTenureMonthsMax) {
        return selectedScheme.repaymentTenureMonthsMax;
      }
      return Math.max(6, prev);
    });
  }, [schemeCode, selectedScheme, educationLocation]);

  // Resolve applicable interest rate & channel name deterministically
  const { ratePercent, channelName } = useMemo(() => {
    return resolveApplicableRateAndChannel(selectedScheme, selectedChannel);
  }, [selectedScheme, selectedChannel]);

  // Ensure principal stays within bounds when effectiveMaxLoan changes
  useEffect(() => {
    if (principal > effectiveMaxLoan) {
      setPrincipal(effectiveMaxLoan);
    } else if (principal < minLoan) {
      setPrincipal(minLoan);
    }
  }, [effectiveMaxLoan, minLoan, principal]);

  // Compute live deterministic EMI result
  const emiResult = useMemo(() => {
    return computeSchemeEmi(
      {
        schemeCode: selectedScheme.code,
        principal,
        annualRatePercent: ratePercent,
        tenureMonths,
        educationLocation,
        projectCost,
        selectedChannel,
      },
      selectedScheme
    );
  }, [
    selectedScheme,
    principal,
    ratePercent,
    tenureMonths,
    educationLocation,
    projectCost,
    selectedChannel,
  ]);

  // Validation messages for inline display
  const loanError = useMemo(() => {
    if (principal < minLoan) {
      return `Minimum permissible loan is ₹${minLoan.toLocaleString('en-IN')}.`;
    }
    if (principal > effectiveMaxLoan) {
      return `Maximum permissible loan under ${selectedScheme.code} is ₹${effectiveMaxLoan.toLocaleString('en-IN')}.`;
    }
    return undefined;
  }, [principal, minLoan, effectiveMaxLoan, selectedScheme.code]);

  const tenureError = useMemo(() => {
    if (tenureMonths <= 0) {
      return 'Tenure must be greater than 0 months.';
    }
    if (tenureMonths > selectedScheme.repaymentTenureMonthsMax) {
      return `Maximum repayment tenure for this scheme is ${selectedScheme.repaymentTenureMonthsMax} months (${selectedScheme.repaymentTenureMonthsMax / 12} years).`;
    }
    return undefined;
  }, [tenureMonths, selectedScheme.repaymentTenureMonthsMax]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#00472f] border border-emerald-200">
            <Icon name="verified_user" size={14} className="text-[#00472f]" />
            NSFDC Official Schemes
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs text-stone-500 font-medium">
            Ministry of Social Justice and Empowerment, Govt. of India
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Scheme-Aware EMI Calculator{' '}
          <span className="text-stone-500 font-normal text-xl sm:text-2xl block sm:inline">
            (ऋण किस्त कैलकुलेटर)
          </span>
        </h1>

        <p className="text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
          Calculate official monthly repayments, concessional interest rates, and loan terms for
          NSFDC (National Scheduled Castes Finance and Development Corporation) schemes.
          Interest rates are government-mandated and applied deterministically by scheme and channel.
        </p>
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-7">
          <CalculatorInputPanel
            selectedScheme={selectedScheme}
            onSchemeChange={(code) => setSchemeCode(code)}
            selectedChannel={selectedChannel}
            onChannelChange={(ch) => setSelectedChannel(ch)}
            educationLocation={educationLocation}
            onEducationLocationChange={(loc) => setEducationLocation(loc)}
            projectCost={projectCost}
            onProjectCostChange={(cost) => setProjectCost(cost)}
            principal={principal}
            onPrincipalChange={(amt) => setPrincipal(amt)}
            tenureMonths={tenureMonths}
            onTenureChange={(ten) => setTenureMonths(ten)}
            ratePercent={ratePercent}
            channelName={channelName}
            minLoan={minLoan}
            effectiveMaxLoan={effectiveMaxLoan}
            loanError={loanError}
            tenureError={tenureError}
          />
        </div>

        {/* Right Column: Results Panel */}
        <div className="lg:col-span-5 sticky top-6">
          <CalculatorResults
            scheme={selectedScheme}
            result={emiResult}
            effectiveMaxLoan={effectiveMaxLoan}
            onOpenAgencyModal={() => setIsAgencyModalOpen(true)}
          />
        </div>
      </div>

      {/* Nearby Channelising Agency Modal */}
      <AgencyModal
        isOpen={isAgencyModalOpen}
        onClose={() => setIsAgencyModalOpen(false)}
        scheme={selectedScheme}
        selectedChannel={selectedChannel}
      />
    </div>
  );
}
