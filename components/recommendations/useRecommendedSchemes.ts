'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { ApiError } from '@/src/lib/api/axios';
import {
  parseRecommendationSource,
  readStoredRecommendationSource,
  toSummaryRequest,
  type RecommendationSource,
} from '@/src/lib/recommendation-source';
import { useSchemeSummary } from '@/src/lib/query/scheme-matching';
import {
  toRecommendedSchemesView,
  type RecommendedSchemesView,
} from './recommended-schemes';

export type RecommendedSchemesState =
  | { status: 'loading' }
  /** No intake has produced a match in this browser session. */
  | { status: 'no-session' }
  /** The intake yields nothing to show: incomplete profile or no eligible scheme. */
  | { status: 'unavailable'; message: string; source: RecommendationSource }
  | { status: 'error'; message: string; retry: () => void }
  | ({ status: 'ready' } & RecommendedSchemesView);

// 404: no session or no eligible scheme. 422: profile still incomplete.
// Neither is fixed by retrying, only by going back to the intake.
const UNAVAILABLE_STATUS_CODES = new Set([404, 422]);

const subscribeToNothing = () => () => {};

/**
 * Session storage is unknown while server rendering, so the source is
 * `undefined` until hydration — distinct from `null`, which means no intake
 * has matched yet.
 */
function useRecommendationSource(): RecommendationSource | null | undefined {
  const raw = useSyncExternalStore(
    subscribeToNothing,
    readStoredRecommendationSource,
    () => undefined,
  );
  return useMemo(
    () => (raw === undefined ? undefined : parseRecommendationSource(raw)),
    [raw],
  );
}

export function useRecommendedSchemes(): RecommendedSchemesState {
  const source = useRecommendationSource();
  const summaryRequest = useMemo(() => (source ? toSummaryRequest(source) : null), [source]);
  const summaryQuery = useSchemeSummary(summaryRequest);

  const view = useMemo(
    () => (summaryQuery.data ? toRecommendedSchemesView(summaryQuery.data) : null),
    [summaryQuery.data],
  );

  if (source === undefined) return { status: 'loading' };
  if (source === null) return { status: 'no-session' };

  if (summaryQuery.isError) {
    const { error } = summaryQuery;
    if (error instanceof ApiError && UNAVAILABLE_STATUS_CODES.has(error.statusCode)) {
      return { status: 'unavailable', message: error.message, source };
    }
    return {
      status: 'error',
      message: error.message,
      retry: () => void summaryQuery.refetch(),
    };
  }

  if (!view) return { status: 'loading' };
  return { status: 'ready', ...view };
}
