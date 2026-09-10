import { axiosInstance } from './axios';
import {
  ReportOutcomeInput,
  ReportOutcomeResponse,
} from '@/src/types/scheme-matching';

/**
 * Submits citizen outcome feedback for partner loan processing.
 * POST /api/partner-feedback
 */
export async function submitPartnerFeedback(
  report: ReportOutcomeInput
): Promise<ReportOutcomeResponse> {
  const response = await axiosInstance.post<ReportOutcomeResponse>(
    '/api/partner-feedback',
    report
  );
  return response.data;
}
