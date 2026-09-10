import { axiosInstance } from './axios';
import {
  NearbyPartnersRequest,
  PartnerLocatorResponse,
  PartnerStatusReport,
  PartnerStatusResponse,
  AssignSchemeInput,
  AssignSchemeResponse,
} from '@/src/types/scheme-matching';

/**
 * Discovers authorized channel partner centers near a citizen for a given scheme.
 * POST /api/partner-locator/schemes/:schemeId/nearby
 */
export async function fetchNearbyPartnersForScheme(
  schemeId: string,
  location: NearbyPartnersRequest
): Promise<PartnerLocatorResponse> {
  const response = await axiosInstance.post<PartnerLocatorResponse>(
    `/api/partner-locator/schemes/${encodeURIComponent(schemeId)}/nearby`,
    location
  );
  return response.data;
}

/**
 * Updates channel partner operational status or quota utilization.
 * PATCH /api/partner-locator/partners/:partnerId/schemes/:schemeId/status
 */
export async function updatePartnerStatus(
  partnerId: string,
  schemeId: string,
  status: PartnerStatusReport
): Promise<PartnerStatusResponse> {
  const response = await axiosInstance.patch<PartnerStatusResponse>(
    `/api/partner-locator/partners/${encodeURIComponent(partnerId)}/schemes/${encodeURIComponent(schemeId)}/status`,
    status
  );
  return response.data;
}

/**
 * Assigns a scheme quota to a channel partner.
 * POST /api/partner-locator/assignments
 */
export async function assignSchemeToPartner(
  data: AssignSchemeInput
): Promise<AssignSchemeResponse> {
  const response = await axiosInstance.post<AssignSchemeResponse>(
    '/api/partner-locator/assignments',
    data
  );
  return response.data;
}
