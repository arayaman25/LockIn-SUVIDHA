import type { ChatMessageItem } from '@/components/intake/intake.types';
import type { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';

export const MANUAL_INTAKE_SESSION_KEY = 'suvidha_manual_intake_state';
export const CHAT_INTAKE_SESSION_KEY = 'suvidha_chat_intake_state';

export interface PersistedChatIntakeState {
  channelId: string;
  messages: ChatMessageItem[];
  profile: Partial<CitizenProfileFormValues>;
  lastUserMessage: string;
}

export function readSessionValue<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeSessionValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Session persistence is best effort.
  }
}
