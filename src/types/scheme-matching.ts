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

export type IntakeResponseStatus = 'in_progress' | 'matched' | 'no_match';

export interface IntakeInProgressResponse {
  status: 'in_progress';
  language: string;
  question: string | null;
  partialProfile: Partial<CitizenProfile>;
}

export interface IntakeMatchedResponse {
  status: 'matched';
  language: string;
  matches: SchemeRecommendationItem[];
}

export interface IntakeNoMatchResponse {
  status: 'no_match';
  language: string;
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
