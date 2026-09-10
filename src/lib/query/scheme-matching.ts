import { useMutation } from '@tanstack/react-query';
import { fetchSchemeRecommendations } from '@/src/lib/api/scheme-matching';
import { queryKeys, schemeQueryKeys } from './keys';
import {
  RecommendationRequest,
  RecommendationResponse,
} from '@/src/types/scheme-matching';

// Re-export for seamless backward compatibility
export { queryKeys, schemeQueryKeys };
export { useNearbyPartners } from './partner-locator';
export { useIntakeChat } from './intake';

/**
 * Mutation hook for computing personalized scheme recommendations.
 * Submission mutation — intentionally not cached across different profile runs.
 */
export function useSchemeRecommendations() {
  return useMutation<RecommendationResponse, Error, RecommendationRequest>({
    mutationKey: queryKeys.schemeMatching.recommendations(),
    mutationFn: (profile: RecommendationRequest) =>
      fetchSchemeRecommendations(profile),
  });
}
