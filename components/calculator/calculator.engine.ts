import {
  SchemeFinancialTerms,
  EmiCalculationRequest,
  EmiCalculationResult,
  EducationLocation,
  PartnerTypeCode,
} from './calculator.types';

/**
 * Standard Reducing-Balance Monthly EMI Calculator
 * Formula: EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]
 * where r = annualRatePercent / 12 / 100, n = tenureMonths
 */
export function calculateStandardEmi(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): {
  monthlyEmi: number;
  totalRepayment: number;
  totalInterest: number;
} {
  if (principal <= 0) {
    return { monthlyEmi: 0, totalRepayment: 0, totalInterest: 0 };
  }

  if (tenureMonths <= 0 || !Number.isInteger(tenureMonths)) {
    return { monthlyEmi: 0, totalRepayment: 0, totalInterest: 0 };
  }

  if (annualRatePercent < 0) {
    return { monthlyEmi: 0, totalRepayment: 0, totalInterest: 0 };
  }

  // Zero-interest concession case
  if (annualRatePercent === 0) {
    const rawEmi = principal / tenureMonths;
    const monthlyEmi = Math.round(rawEmi * 100) / 100;
    const totalRepayment = Math.round(monthlyEmi * tenureMonths * 100) / 100;
    return {
      monthlyEmi,
      totalRepayment,
      totalInterest: 0,
    };
  }

  const monthlyRate = annualRatePercent / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const rawEmi = (principal * monthlyRate * factor) / (factor - 1);

  const monthlyEmi = Math.round(rawEmi * 100) / 100;
  const totalRepayment = Math.round(monthlyEmi * tenureMonths * 100) / 100;
  const totalInterest = Math.max(
    0,
    Math.round((totalRepayment - principal) * 100) / 100
  );

  return {
    monthlyEmi,
    totalRepayment,
    totalInterest,
  };
}

/**
 * Resolves the official beneficiary interest rate and lending channel.
 * For UNY, selects between Cooperative Bank (13%) and Small Finance Bank (15%).
 */
export function resolveApplicableRateAndChannel(
  scheme: SchemeFinancialTerms,
  selectedChannel?: PartnerTypeCode
): {
  ratePercent: number;
  channel: PartnerTypeCode;
  channelName: string;
} {
  if (scheme.hasChannelDependentRates && scheme.channelSlabs.length > 0) {
    const matchedSlab = scheme.channelSlabs.find(
      (slab) => slab.channel === selectedChannel
    );
    if (matchedSlab) {
      return {
        ratePercent: matchedSlab.ratePercent,
        channel: matchedSlab.channel,
        channelName: matchedSlab.channelName,
      };
    }
    // Default to first slab if no match
    const firstSlab = scheme.channelSlabs[0];
    return {
      ratePercent: firstSlab.ratePercent,
      channel: firstSlab.channel,
      channelName: firstSlab.channelName,
    };
  }

  const defaultSlab = scheme.channelSlabs[0];
  return {
    ratePercent: scheme.defaultBeneficiaryRatePercent,
    channel: defaultSlab?.channel ?? 'sca',
    channelName: defaultSlab?.channelName ?? 'State Channelising Agency (SCA)',
  };
}

/**
 * Resolves the effective maximum permissible loan amount,
 * accounting for location-specific caps (ELS India vs Abroad)
 * and project cost coverage ceilings.
 */
export function resolveMaxPermissibleLoan(
  scheme: SchemeFinancialTerms,
  educationLocation?: EducationLocation,
  projectCost?: number
): {
  min: number;
  max: number;
  effectiveMax: number;
} {
  let schemeMax = scheme.maxLoanAmount;

  if (scheme.requiresEducationLocation && scheme.locationSpecificLimits) {
    const loc = educationLocation || 'india';
    const limit = scheme.locationSpecificLimits[loc];
    if (limit) {
      schemeMax = limit.maxLoanAmount;
    }
  }

  let effectiveMax = schemeMax;

  if (
    typeof projectCost === 'number' &&
    projectCost > 0 &&
    scheme.maxProjectCostCoveragePercent > 0 &&
    scheme.maxProjectCostCoveragePercent < 100
  ) {
    const coverageCeiling = Math.floor(
      (projectCost * scheme.maxProjectCostCoveragePercent) / 100
    );
    effectiveMax = Math.min(schemeMax, coverageCeiling);
  }

  // Ensure effective max does not drop below minLoanAmount
  effectiveMax = Math.max(scheme.minLoanAmount, effectiveMax);

  return {
    min: scheme.minLoanAmount,
    max: schemeMax,
    effectiveMax,
  };
}

/**
 * Computes deterministic scheme-aware EMI result with full validation errors.
 */
export function computeSchemeEmi(
  request: EmiCalculationRequest,
  scheme: SchemeFinancialTerms
): EmiCalculationResult {
  const errors: string[] = [];

  const { effectiveMax } = resolveMaxPermissibleLoan(
    scheme,
    request.educationLocation,
    request.projectCost
  );

  if (request.principal < scheme.minLoanAmount) {
    errors.push(
      `Loan amount cannot be less than the scheme minimum ₹${scheme.minLoanAmount.toLocaleString('en-IN')}.`
    );
  }

  if (request.principal > effectiveMax) {
    errors.push(
      `Loan amount cannot exceed the permissible limit of ₹${effectiveMax.toLocaleString('en-IN')}.`
    );
  }

  if (
    request.tenureMonths <= 0 ||
    request.tenureMonths > scheme.repaymentTenureMonthsMax
  ) {
    errors.push(
      `Repayment tenure cannot exceed ${scheme.repaymentTenureMonthsMax} months for this scheme.`
    );
  }

  const { ratePercent } = resolveApplicableRateAndChannel(
    scheme,
    request.selectedChannel
  );

  const safePrincipal = Math.max(0, request.principal);
  const safeTenure = Math.max(1, Math.round(request.tenureMonths));

  const { monthlyEmi, totalRepayment, totalInterest } = calculateStandardEmi(
    safePrincipal,
    ratePercent,
    safeTenure
  );

  let moratoriumPeriod = 'None';
  if (scheme.moratoriumMonthsMax > 0) {
    moratoriumPeriod =
      scheme.moratoriumMonthsMin === scheme.moratoriumMonthsMax
        ? `${scheme.moratoriumMonthsMax} Months`
        : `${scheme.moratoriumMonthsMin} - ${scheme.moratoriumMonthsMax} Months`;
  }

  const quarterlyEquivalentInstallment =
    scheme.repaymentFrequency === 'quarterly'
      ? Math.round(monthlyEmi * 3 * 100) / 100
      : undefined;

  return {
    monthlyEmi,
    totalRepayment,
    totalInterest,
    principal: safePrincipal,
    tenureMonths: safeTenure,
    annualRatePercent: ratePercent,
    repaymentFrequency: scheme.repaymentFrequency,
    quarterlyEquivalentInstallment,
    moratoriumPeriod,
    errors,
  };
}
