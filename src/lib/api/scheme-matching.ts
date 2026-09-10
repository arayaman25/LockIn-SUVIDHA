import { apiClient } from './client';
import {
  RecommendationRequest,
  RecommendationResponse,
  IntakeRequest,
  IntakeResponse,
  NearbyPartnersRequest,
  PartnerLocatorResponse,
} from '@/src/types/scheme-matching';

export async function fetchSchemeRecommendations(
  profile: RecommendationRequest
): Promise<RecommendationResponse> {
  return apiClient<RecommendationResponse>('/api/scheme-matching/recommendations', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
}

export async function sendIntakeMessage(
  payload: IntakeRequest
): Promise<IntakeResponse> {
  return apiClient<IntakeResponse>('/api/intake/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchNearbyPartnersForScheme(
  schemeId: string,
  location: NearbyPartnersRequest
): Promise<PartnerLocatorResponse> {
  return apiClient<PartnerLocatorResponse>(
    `/api/partner-locator/schemes/${encodeURIComponent(schemeId)}/nearby`,
    {
      method: 'POST',
      body: JSON.stringify(location),
    }
  );
}
