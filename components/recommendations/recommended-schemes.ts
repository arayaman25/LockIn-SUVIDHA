import type {
  SchemeRecommendationItem,
  SchemeSummaryItem,
  SchemeSummaryResponse,
} from '@/src/types/scheme-matching';

/** A ranked match joined with its plain-language explanation, ready to render. */
export interface RecommendedScheme {
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  /** The official scheme description from the catalogue, independent of the citizen. */
  description: string;
  headline: string;
  whyItFits: string | null;
  keyTerms: string[];
  nextSteps: string[];
}

export interface RecommendedSchemesView {
  overallSummary: string;
  schemes: RecommendedScheme[];
}

const formatRupees = (amount: string) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

const formatRange = (min: string | number, max: string | number) =>
  String(min) === String(max) ? `${min}` : `${min}–${max}`;

/**
 * Figures straight from the rules engine, used when the summariser did not
 * describe a scheme so the citizen still sees its terms.
 */
const keyTermsFromMatch = (match: SchemeRecommendationItem): string[] => [
  `Loan amount: ${formatRupees(match.minLoanAmount)} to ${formatRupees(match.maxLoanAmount)}`,
  `Interest rate: ${formatRange(match.interestRateMin, match.interestRateMax)}% per year`,
  `Moratorium: ${formatRange(match.moratoriumMonthsMin, match.moratoriumMonthsMax)} months`,
  `Repayment tenure: up to ${match.repaymentTenureMonths} months`,
];

const toRecommendedScheme = (
  match: SchemeRecommendationItem,
  summary: SchemeSummaryItem | undefined,
): RecommendedScheme => ({
  schemeId: match.schemeId,
  schemeCode: match.schemeCode,
  schemeName: match.schemeName,
  description: match.description,
  headline: summary?.headline ?? match.reasoning,
  whyItFits: summary?.whyItFits ?? null,
  keyTerms: summary?.keyTerms ?? keyTermsFromMatch(match),
  nextSteps: summary?.nextSteps ?? [],
});

/**
 * Keeps the backend's deterministic ranking order. The summariser may skip
 * a scheme, so explanations are joined onto matches rather than the reverse.
 */
export function toRecommendedSchemesView(
  response: SchemeSummaryResponse,
): RecommendedSchemesView {
  const { overallSummary, schemeSummaries, matches } = response.data;
  const summariesByCode = new Map(
    schemeSummaries.map((summary) => [summary.schemeCode, summary]),
  );

  return {
    overallSummary,
    schemes: matches.map((match) =>
      toRecommendedScheme(match, summariesByCode.get(match.schemeCode)),
    ),
  };
}

export const simpleExplanationHref = (scheme: RecommendedScheme) =>
  `/simple-explanation/${encodeURIComponent(scheme.schemeId)}`;

export const partnerLocatorHref = (scheme: RecommendedScheme) =>
  `/locator?scheme=${encodeURIComponent(scheme.schemeCode)}`;

export const emiCalculatorHref = (scheme: RecommendedScheme) =>
  `/calculator?scheme=${encodeURIComponent(scheme.schemeCode)}`;
