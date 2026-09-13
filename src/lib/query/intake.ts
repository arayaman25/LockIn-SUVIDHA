import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendIntakeMessage } from '@/src/lib/api/intake';
import { queryKeys } from './keys';
import { IntakeRequest, IntakeResponse } from '@/src/types/scheme-matching';

/**
 * Mutation hook for interactive conversational citizen intake chat messages.
 */
export function useIntakeChat() {
  const queryClient = useQueryClient();

  return useMutation<IntakeResponse, Error, IntakeRequest>({
    mutationKey: queryKeys.intake.messages(),
    mutationFn: (payload: IntakeRequest) => sendIntakeMessage(payload),
    // Any turn can change the profile stored on this channel, which makes a
    // summary cached for it describe recommendations that no longer apply.
    onSuccess: (_response, { channelId }) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.schemeMatching.summary({ channelId }),
      }),
  });
}
