import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchSchemeRecommendations,
  fetchSchemeSummary,
} from '@/src/lib/api/scheme-matching';
import { queryKeys, schemeQueryKeys } from './keys';
import {
  RecommendationRequest,
  RecommendationResponse,
  SchemeSummaryRequest,
  SchemeSummaryResponse,
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

/**
 * Shared by both intakes (which start the fetch as soon as they match) and
 * the recommendation pages (which read it), so redirecting between them
 * joins the in-flight request instead of paying for a second LLM call.
 */
export const schemeSummaryQueryOptions = (request: SchemeSummaryRequest) =>
  queryOptions<SchemeSummaryResponse, Error>({
    queryKey: queryKeys.schemeMatching.summary(request),
    queryFn: () => fetchSchemeSummary(request),
    // Every fetch is an LLM call. A wizard profile is part of its own key, and
    // useIntakeChat invalidates a chat channel's entry whenever its profile changes.
    staleTime: Infinity,
    // The backend already retries the LLM with backoff; retrying here would
    // only multiply a minute-long wait. Pages offer a manual retry instead.
    retry: false,
  });

export function useSchemeSummary(request: SchemeSummaryRequest | null) {
  return useQuery({
    ...schemeSummaryQueryOptions(request ?? { channelId: '' }),
    enabled: request !== null,
  });
}
