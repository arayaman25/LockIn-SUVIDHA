/**
 * Centralized TanStack Query keys factory.
 * Ensures predictable cache invalidation and scoping across all server-state hooks.
 */
export const queryKeys = {
  schemeMatching: {
    all: ['scheme-matching'] as const,
    recommendations: () => [...queryKeys.schemeMatching.all, 'recommendations'] as const,
  },
  intake: {
    all: ['intake'] as const,
    messages: (channelId?: string) =>
      [...queryKeys.intake.all, 'messages', channelId ?? 'global'] as const,
  },
  partners: {
    all: ['partners'] as const,
    nearby: (
      schemeId: string,
      latitude?: number,
      longitude?: number,
      limit?: number
    ) =>
      [
        ...queryKeys.partners.all,
        'nearby',
        schemeId,
        latitude ?? 0,
        longitude ?? 0,
        limit ?? 5,
      ] as const,
  },
};

// Backwards-compatible alias for existing imports
export const schemeQueryKeys = {
  all: queryKeys.schemeMatching.all,
  recommendations: queryKeys.schemeMatching.recommendations,
  intake: queryKeys.intake.messages,
  partners: (schemeId: string, lat: number, lng: number) =>
    queryKeys.partners.nearby(schemeId, lat, lng),
};
