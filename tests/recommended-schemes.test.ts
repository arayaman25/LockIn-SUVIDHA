import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toRecommendedSchemesView } from '../components/recommendations/recommended-schemes';
import type {
  SchemeRecommendationItem,
  SchemeSummaryResponse,
} from '../src/types/scheme-matching';

const match = (overrides: Partial<SchemeRecommendationItem>): SchemeRecommendationItem => ({
  schemeId: 'id-mcf',
  schemeCode: 'MCF',
  schemeName: 'Micro Finance Scheme',
  description: 'Loans for small income-generating projects.',
  matchScore: 80,
  reasoning: 'Fits a small project within the income limit.',
  minLoanAmount: '10000',
  maxLoanAmount: '140000',
  interestRateMin: '5',
  interestRateMax: '5',
  repaymentTenureMonths: 36,
  moratoriumMonthsMin: 3,
  moratoriumMonthsMax: 6,
  requiredDocuments: [],
  scoreBreakdown: {
    intentFit: 20,
    loanAmountFit: 20,
    projectCostFit: 15,
    occupationFit: 10,
    incomeFit: 10,
    educationFit: 0,
    locationFit: 5,
  },
  ...overrides,
});

const response = (data: Partial<SchemeSummaryResponse['data']>): SchemeSummaryResponse => ({
  success: true,
  data: { language: 'en', overallSummary: 'Overall.', schemeSummaries: [], matches: [], ...data },
});

describe('toRecommendedSchemesView', () => {
  it('keeps the backend ranking order even when summaries arrive in a different order', () => {
    const view = toRecommendedSchemesView(
      response({
        matches: [match({}), match({ schemeId: 'id-tl', schemeCode: 'TL', schemeName: 'Term Loan' })],
        schemeSummaries: [
          { schemeCode: 'TL', schemeId: 'id-tl', schemeName: 'Term Loan', headline: 'TL headline', whyItFits: 'TL fit', keyTerms: ['TL term'], nextSteps: ['TL step'], matchScore: 70 },
          { schemeCode: 'MCF', schemeId: 'id-mcf', schemeName: 'Micro Finance Scheme', headline: 'MCF headline', whyItFits: 'MCF fit', keyTerms: ['MCF term'], nextSteps: ['MCF step'], matchScore: 80 },
        ],
      }),
    );

    assert.deepEqual(view.schemes.map((scheme) => scheme.schemeCode), ['MCF', 'TL']);
    assert.equal(view.schemes[0].headline, 'MCF headline');
    assert.equal(view.schemes[0].description, 'Loans for small income-generating projects.');
    assert.deepEqual(view.schemes[1].nextSteps, ['TL step']);
    assert.equal(view.overallSummary, 'Overall.');
  });

  it('falls back to rules-engine data for a scheme the summariser skipped', () => {
    const [scheme] = toRecommendedSchemesView(response({ matches: [match({})] })).schemes;

    assert.equal(scheme.headline, 'Fits a small project within the income limit.');
    assert.equal(scheme.whyItFits, null);
    assert.deepEqual(scheme.nextSteps, []);
    assert.ok(scheme.keyTerms.includes('Interest rate: 5% per year'));
    assert.ok(scheme.keyTerms.includes('Moratorium: 3–6 months'));
  });
});
