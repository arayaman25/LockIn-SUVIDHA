'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { schemeSummaryQueryOptions } from '@/src/lib/query/scheme-matching';
import {
  RECOMMENDED_SCHEMES_PATH,
  saveRecommendationSource,
  toSummaryRequest,
  type RecommendationSource,
} from '@/src/lib/recommendation-source';

/**
 * The single hand-off from any intake to the recommendations page, so the
 * chat and the step-by-step wizard finish in exactly the same place.
 */
export function useShowRecommendations() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCallback(
    (source: RecommendationSource) => {
      saveRecommendationSource(source);
      // Started before navigating so the page joins the in-flight request
      // and shows its loading state instead of waiting on a fresh one.
      void queryClient.prefetchQuery(schemeSummaryQueryOptions(toSummaryRequest(source)));
      router.push(RECOMMENDED_SCHEMES_PATH);
    },
    [queryClient, router],
  );
}
