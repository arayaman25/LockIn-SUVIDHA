import { useQuery } from '@tanstack/react-query';
import { fetchNearbyPartnersForScheme } from '@/src/lib/api/partner-locator';
import { queryKeys } from './keys';
import {
  NearbyPartnersRequest,
  PartnerLocatorResponse,
} from '@/src/types/scheme-matching';

export interface UseNearbyPartnersOptions {
  enabled?: boolean;
}

/**
 * Query hook for discovering nearby authorized channel partners for a recommended scheme.
 * Implements geo-scoped caching (10 min staleTime, 30 min gcTime).
 */
export function useNearbyPartners(
  schemeId: string | undefined,
  location: NearbyPartnersRequest | null,
  options: UseNearbyPartnersOptions = {}
) {
  const isEnabled = Boolean(
    options.enabled !== false &&
      schemeId &&
      location &&
      typeof location.citizenLat === 'number' &&
      typeof location.citizenLng === 'number'
  );

  return useQuery<PartnerLocatorResponse, Error>({
    queryKey: queryKeys.partners.nearby(
      schemeId ?? '',
      location?.citizenLat,
      location?.citizenLng,
      location?.limit
    ),
    queryFn: () => {
      if (!schemeId || !location) {
        throw new Error('Scheme ID and location coordinates are required.');
      }
      return fetchNearbyPartnersForScheme(schemeId, location);
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
