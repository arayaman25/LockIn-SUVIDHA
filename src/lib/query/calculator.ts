import { useQuery } from '@tanstack/react-query';
import { fetchCalculatorNearbyAgencies } from '@/src/lib/api/calculator';
import { queryKeys } from '@/src/lib/query/keys';
import {
  NearbyPartnersRequest,
  PartnerLocatorResponse,
} from '@/src/types/scheme-matching';

export interface UseCalculatorNearbyAgenciesOptions {
  enabled?: boolean;
}

/**
 * Query hook for discovering authorized channelising agencies for the selected scheme.
 * Cached by scheme code and citizen coordinates for 10 minutes.
 */
export function useCalculatorNearbyAgencies(
  schemeIdOrCode: string | undefined,
  location: NearbyPartnersRequest | null,
  options: UseCalculatorNearbyAgenciesOptions = {}
) {
  const isEnabled = Boolean(
    options.enabled !== false &&
      schemeIdOrCode &&
      location &&
      typeof location.citizenLat === 'number' &&
      typeof location.citizenLng === 'number'
  );

  return useQuery<PartnerLocatorResponse, Error>({
    queryKey: queryKeys.partners.nearby(
      schemeIdOrCode ?? '',
      location?.citizenLat,
      location?.citizenLng,
      location?.limit
    ),
    queryFn: () => {
      if (!schemeIdOrCode || !location) {
        throw new Error('Scheme code and location coordinates are required.');
      }
      return fetchCalculatorNearbyAgencies(schemeIdOrCode, location);
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
