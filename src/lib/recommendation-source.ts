import type {
  CitizenProfile,
  SchemeSummaryRequest,
} from '@/src/types/scheme-matching';
import { writeSessionValue } from './intake-session';

/**
 * The completed intake the recommendation pages present. Chat profiles live
 * on the backend session, so only the channel is kept; wizard profiles exist
 * only in the browser, so the whole profile is.
 */
export type RecommendationSource =
  | { kind: 'chat'; channelId: string }
  | { kind: 'wizard'; profile: CitizenProfile };

export const RECOMMENDATION_SOURCE_SESSION_KEY = 'suvidha_recommendation_source';

export const RECOMMENDED_SCHEMES_PATH = '/recommended-schemes';

/** Records the intake that just produced a match; the latest match wins. */
export function saveRecommendationSource(source: RecommendationSource): void {
  writeSessionValue(RECOMMENDATION_SOURCE_SESSION_KEY, source);
}

/**
 * Returns the raw stored string rather than a parsed object: a primitive is
 * a stable snapshot for useSyncExternalStore, where a freshly parsed object
 * on every call would re-render forever.
 */
export function readStoredRecommendationSource(): string | null {
  try {
    return sessionStorage.getItem(RECOMMENDATION_SOURCE_SESSION_KEY);
  } catch {
    return null;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export function parseRecommendationSource(raw: string | null): RecommendationSource | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return null;
    if (value.kind === 'chat' && typeof value.channelId === 'string') {
      return { kind: 'chat', channelId: value.channelId };
    }
    // The backend validates the profile itself and answers 422 if it is not
    // complete, so only the shape needed to build the request is checked here.
    if (value.kind === 'wizard' && isRecord(value.profile)) {
      return { kind: 'wizard', profile: value.profile as unknown as CitizenProfile };
    }
    return null;
  } catch {
    return null;
  }
}

export const toSummaryRequest = (source: RecommendationSource): SchemeSummaryRequest =>
  source.kind === 'chat'
    ? { channelId: source.channelId }
    : { profile: source.profile };
