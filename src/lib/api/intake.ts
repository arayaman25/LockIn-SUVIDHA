import { axiosInstance } from './axios';
import { IntakeRequest, IntakeResponse } from '@/src/types/scheme-matching';

/**
 * Sends conversational citizen intake messages to the scheme engine.
 * POST /api/intake/messages
 */
export async function sendIntakeMessage(
  payload: IntakeRequest
): Promise<IntakeResponse> {
  const response = await axiosInstance.post<IntakeResponse>(
    '/api/intake/messages',
    payload
  );
  return response.data;
}
