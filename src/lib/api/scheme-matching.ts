import { axiosInstance } from './axios';
import {
  RecommendationRequest,
  RecommendationResponse,
  SchemeSummaryResponse,
} from '@/src/types/scheme-matching';

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

export async function fetchSchemeSummary(
  channelId: string
): Promise<SchemeSummaryResponse> {
  const response = await axiosInstance.post<SchemeSummaryResponse>(
    '/api/scheme-matching/summary',
    { channelId }
  );
  return response.data;
}
