import { axiosInstance } from './axios';
import {
  RecommendationRequest,
  RecommendationResponse,
  SchemeSummaryRequest,
  SchemeSummaryResponse,
} from '@/src/types/scheme-matching';

// The summary is written by an LLM that the backend retries with backoff
// (up to ~64s before its circuit breaker gives up), so the default 15s
// client timeout would abort requests the server is still able to answer.
const SCHEME_SUMMARY_TIMEOUT_MS = 70_000;

/**
 * Calls backend scheme matching engine to compute ranked eligible schemes.
 * POST /api/scheme-matching/recommendations
 */
export async function fetchSchemeRecommendations(
  profile: RecommendationRequest
): Promise<RecommendationResponse> {
  const response = await axiosInstance.post<RecommendationResponse>(
    '/api/scheme-matching/recommendations',
    profile
  );
  return response.data;
}

/**
 * Re-derives the deterministic ranking for an intake and returns it with a
 * plain-language explanation of each recommended scheme.
 * POST /api/scheme-matching/summary
 */
export async function fetchSchemeSummary(
  request: SchemeSummaryRequest
): Promise<SchemeSummaryResponse> {
  const response = await axiosInstance.post<SchemeSummaryResponse>(
    '/api/scheme-matching/summary',
    request,
    { timeout: SCHEME_SUMMARY_TIMEOUT_MS }
  );
  return response.data;
}
