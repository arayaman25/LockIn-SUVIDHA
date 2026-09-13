import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseRecommendationSource,
  toSummaryRequest,
  type RecommendationSource,
} from '../src/lib/recommendation-source';
import type { CitizenProfile } from '../src/types/scheme-matching';

const wizardProfile: CitizenProfile = {
  intent: 'business_loan',
  isScheduledCaste: true,
  age: 28,
  gender: 'female',
  annualFamilyIncome: 180000,
  state: 'Maharashtra',
  district: 'Pune',
  projectType: 'Tailoring Shop',
  requiredLoanAmount: 120000,
};

describe('parseRecommendationSource', () => {
  it('round-trips both intake kinds through their stored JSON form', () => {
    const sources: RecommendationSource[] = [
      { kind: 'chat', channelId: 'channel-123' },
      { kind: 'wizard', profile: wizardProfile },
    ];

    for (const source of sources) {
      assert.deepEqual(parseRecommendationSource(JSON.stringify(source)), source);
    }
  });

  it('treats missing, corrupt, or mis-shaped values as no source', () => {
    for (const raw of [null, '', 'not json', '42', '{"kind":"chat"}', '{"kind":"wizard","profile":"x"}', '{"kind":"email"}']) {
      assert.equal(parseRecommendationSource(raw), null, `expected null for ${raw}`);
    }
  });
});

describe('toSummaryRequest', () => {
  it('sends exactly one of channelId or profile, as the backend requires', () => {
    assert.deepEqual(toSummaryRequest({ kind: 'chat', channelId: 'channel-123' }), { channelId: 'channel-123' });
    assert.deepEqual(toSummaryRequest({ kind: 'wizard', profile: wizardProfile }), { profile: wizardProfile });
  });
});
