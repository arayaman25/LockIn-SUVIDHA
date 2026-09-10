import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchSchemeRecommendations,
  sendIntakeMessage,
  fetchNearbyPartnersForScheme,
} from '@/src/lib/api/scheme-matching';
import {
  RecommendationRequest,
  RecommendationResponse,
  IntakeRequest,
  IntakeResponse,
  NearbyPartnersRequest,
  PartnerLocatorResponse,
} from '@/src/types/scheme-matching';

export const schemeQueryKeys = {
  all: ['scheme-matching'] as const,
  recommendations: () => [...schemeQueryKeys.all, 'recommendations'] as const,
  intake: () => [...schemeQueryKeys.all, 'intake'] as const,
  partners: (schemeId: string, lat: number, lng: number) =>
    [...schemeQueryKeys.all, 'partners', schemeId, lat, lng] as const,
};

/**
 * Mutation hook for matching schemes against the citizen profile
 */
export function useSchemeRecommendations() {
  return useMutation<RecommendationResponse, Error, RecommendationRequest>({
    mutationKey: schemeQueryKeys.recommendations(),
    mutationFn: (profile: RecommendationRequest) =>
      fetchSchemeRecommendations(profile),
  });
}

/**
 * Mutation hook for interactive conversational intake messages
 */
export function useIntakeChat() {
  return useMutation<IntakeResponse, Error, IntakeRequest>({
    mutationKey: schemeQueryKeys.intake(),
    mutationFn: (payload: IntakeRequest) => sendIntakeMessage(payload),
  });
}

/**
 * Query hook for discovering nearby authorized channel partners for a recommended scheme
 */
export function useNearbyPartners(
  schemeId: string | undefined,
  location: NearbyPartnersRequest | null,
  options: { enabled?: boolean } = {}
) {
  const isEnabled = Boolean(
    options.enabled !== false &&
      schemeId &&
      location &&
      typeof location.citizenLat === 'number' &&
      typeof location.citizenLng === 'number'
  );

  return useQuery<PartnerLocatorResponse, Error>({
    queryKey: schemeQueryKeys.partners(
      schemeId || '',
      location?.citizenLat ?? 0,
      location?.citizenLng ?? 0
    ),
    queryFn: () => {
      if (!schemeId || !location) {
        throw new Error('Scheme ID and location coordinates are required.');
      }
      return fetchNearbyPartnersForScheme(schemeId, location);
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}
