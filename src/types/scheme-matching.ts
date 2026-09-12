export type IntentType = 'business_loan' | 'education_loan' | 'skill_training';
export type GenderType = 'male' | 'female' | 'other';
export type EducationStatusType = 'none' | 'secondary' | 'graduate' | 'postgraduate';

export interface ScoreBreakdown {
  intentFit: number;
  loanAmountFit: number;
  projectCostFit: number;
  occupationFit: number;
  incomeFit: number;
  educationFit: number;
  locationFit: number;
}

export interface BaseCitizenProfile {
  isScheduledCaste: boolean;
  age: number;
  gender: GenderType;
  annualFamilyIncome: number;
  state: string;
  district: string;
  occupationCategory?: string;
  occupationType?: string;
  customOccupation?: string;
  estimatedProjectCost?: number;
  latitude?: number;
  longitude?: number;
}

export interface BusinessProfile extends BaseCitizenProfile {
  intent: 'business_loan';
  projectType: string;
  requiredLoanAmount: number;
  educationStatus?: EducationStatusType;
  course?: string;
}

export interface EducationProfile extends BaseCitizenProfile {
  intent: 'education_loan';
  projectType?: string;
  requiredLoanAmount: number;
  educationStatus: EducationStatusType;
  course: string;
}

export interface SkillTrainingProfile extends BaseCitizenProfile {
  intent: 'skill_training';
  projectType?: string;
  requiredLoanAmount?: number;
  educationStatus?: EducationStatusType;
  course?: string;
}

export type CitizenProfile = BusinessProfile | EducationProfile | SkillTrainingProfile;

export type RecommendationRequest = CitizenProfile & {
  userId?: string;
};

export interface SchemeRecommendationItem {
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  description?: string;
  sourceUrl?: string | null;
  eligibilityRules?: Record<string, unknown>;
  matchScore: number;
  reasoning: string;
  minLoanAmount: string;
  maxLoanAmount: string;
  interestRateMin: string;
  interestRateMax: string;
  repaymentTenureMonths: number;
  moratoriumMonthsMin: number;
  moratoriumMonthsMax: number;
  requiredDocuments: string[];
  scoreBreakdown: ScoreBreakdown;
  summary?: string;
  whyItFits?: string;
}

export interface SchemeRecommendationResult {
  matches: SchemeRecommendationItem[];
  reason?: string;
}

export interface RecommendationResponse {
  success: boolean;
  data: SchemeRecommendationResult;
}

export type SchemeRecommendationResponse = RecommendationResponse;

export interface ScoredPartner {
  partnerId: string;
  partnerName: string;
  partnerType: string;
  address: string;
  distanceKm: number;
  compositeScore: number;
  scoreBreakdown: {
    quotaScore: number;
    healthScore: number;
    proximityScore: number;
    confidenceScore: number;
  };
  quotaSource: 'partner_reported' | 'admin_entered';
  latitude?: number;
  longitude?: number;
}

export interface PartnerLocatorResult {
  partners: ScoredPartner[];
  hasEligiblePartners: boolean;
}

export interface PartnerLocatorResponse {
  success: boolean;
  data: PartnerLocatorResult;
}

export interface NearbyPartnersRequest {
  citizenLat: number;
  citizenLng: number;
  limit?: number;
}

export interface IntakeRequest {
  message: string;
  channelId: string;
  userId?: string;
}

export type IntakeResponseStatus = 'in_progress' | 'needs_clarification' | 'matched' | 'no_match';

export interface IntakeInProgressResponse {
  status: 'in_progress' | 'needs_clarification';
  language?: string;
  detectedLanguage?: string;
  question?: string | null;
  clarifyingQuestion?: string | null;
  partialProfile?: Partial<CitizenProfile> | Record<string, unknown>;
  extractedProfile?: Partial<CitizenProfile> | Record<string, unknown>;
  missingFields?: string[];
  missingRequiredFields?: string[];
}

export interface IntakeMatchedResponse {
  status: 'matched';
  language?: string;
  detectedLanguage?: string;
  matches: SchemeRecommendationItem[];
  channelId?: string;
}

export interface SchemeSummaryItem {
  schemeCode: string;
  schemeId: string;
  schemeName: string;
  headline: string;
  whyItFits: string;
  keyTerms: string[];
  nextSteps: string[];
  matchScore: number;
}

export interface SchemeSummaryResponse {
  success: boolean;
  data: {
    language: string;
    overallSummary: string;
    schemeSummaries: SchemeSummaryItem[];
    matches: SchemeRecommendationItem[];
  };
}

export interface IntakeNoMatchResponse {
  status: 'no_match';
  language?: string;
  detectedLanguage?: string;
  message: string;
}

export type IntakeResponseData =
  | IntakeInProgressResponse
  | IntakeMatchedResponse
  | IntakeNoMatchResponse;

export interface IntakeResponse {
  success: boolean;
  data: IntakeResponseData;
}

export interface PartnerStatusReport {
  acceptingApplications: boolean;
  utilizedAmount?: number;
}

export interface PartnerStatusResponse {
  success: boolean;
  data: unknown;
}

export interface AssignSchemeInput {
  partnerId: string;
  schemeId: string;
  totalQuotaAmount: number;
}

export interface AssignSchemeResponse {
  success: boolean;
  data: unknown;
}

export interface ReportOutcomeInput {
  partnerId: string;
  schemeId: string;
  applicationId?: string;
  userId?: string;
  outcome: 'received_loan' | 'not_received' | 'still_pending';
}

export interface ReportOutcomeResponse {
  success: boolean;
  data: unknown;
}
