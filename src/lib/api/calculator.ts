import { axiosInstance } from './axios';
import {
  PartnerLocatorResponse,
  NearbyPartnersRequest,
} from '@/src/types/scheme-matching';

/**
 * Discovers nearby authorized channelising agencies for the selected scheme.
 * Consumes the official backend partner locator endpoint:
 * POST /api/partner-locator/schemes/:schemeId/nearby
 */
export async function fetchCalculatorNearbyAgencies(
  schemeIdOrCode: string,
  location: NearbyPartnersRequest
): Promise<PartnerLocatorResponse> {
  const response = await axiosInstance.post<PartnerLocatorResponse>(
    `/api/partner-locator/schemes/${encodeURIComponent(schemeIdOrCode)}/nearby`,
    location
  );
  return response.data;
}
