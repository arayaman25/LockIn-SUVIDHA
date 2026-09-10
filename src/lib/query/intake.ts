import { useMutation } from '@tanstack/react-query';
import { sendIntakeMessage } from '@/src/lib/api/intake';
import { queryKeys } from './keys';
import { IntakeRequest, IntakeResponse } from '@/src/types/scheme-matching';

/**
 * Mutation hook for interactive conversational citizen intake chat messages.
 */
export function useIntakeChat() {
  return useMutation<IntakeResponse, Error, IntakeRequest>({
    mutationKey: queryKeys.intake.messages(),
    mutationFn: (payload: IntakeRequest) => sendIntakeMessage(payload),
  });
}
