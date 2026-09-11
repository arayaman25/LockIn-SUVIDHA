export type PartnerTypeCode =
  | 'sca'
  | 'psb'
  | 'rrb'
  | 'nbfc_mfi'
  | 'cooperative_bank'
  | 'small_finance_bank';

export type RepaymentFrequency = 'monthly' | 'quarterly';

export type EducationLocation = 'india' | 'abroad';

export interface ChannelSlabItem {
  channel: PartnerTypeCode;
  channelName: string;
  ratePercent: number;
  description?: string;
}

export interface LocationLimit {
  maxLoanAmount: number;
  label: string;
  description?: string;
}

export interface SchemeFinancialTerms {
  code: string;
  name: string;
  nameHindi?: string;
  category: string;
  description: string;
  purpose: string;
  projectCostMin?: number;
  projectCostMax?: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  maxProjectCostCoveragePercent: number;
  moratoriumMonthsMin: number;
  moratoriumMonthsMax: number;
  repaymentTenureMonthsMax: number;
  repaymentFrequency: RepaymentFrequency;
  defaultBeneficiaryRatePercent: number;
  sourceUrl?: string;
  lastVerifiedAt?: string;
  channelSlabs: ChannelSlabItem[];
  hasChannelDependentRates: boolean;
  requiresEducationLocation?: boolean;
  locationSpecificLimits?: Record<EducationLocation, LocationLimit>;
  specialNotes?: string;
}

export interface EmiCalculationRequest {
  schemeCode: string;
  principal: number;
  annualRatePercent: number;
  tenureMonths: number;
  educationLocation?: EducationLocation;
  projectCost?: number;
  selectedChannel?: PartnerTypeCode;
}

export interface EmiCalculationResult {
  monthlyEmi: number;
  totalRepayment: number;
  totalInterest: number;
  principal: number;
  tenureMonths: number;
  annualRatePercent: number;
  repaymentFrequency: RepaymentFrequency;
  quarterlyEquivalentInstallment?: number;
  moratoriumPeriod: string;
  errors: string[];
}

export interface NearbyAgencyQuery {
  schemeCode: string;
  latitude: number;
  longitude: number;
  channel?: PartnerTypeCode;
  limit?: number;
}

export interface ChannelPartnerItem {
  partnerId: string;
  partnerName: string;
  partnerType: PartnerTypeCode | string;
  address: string;
  distanceKm: number;
  compositeScore?: number;
  latitude?: number;
  longitude?: number;
}
