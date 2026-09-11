import { SchemeRecommendationItem } from '@/src/types/scheme-matching';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessageItem {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  matchedSchemes?: SchemeRecommendationItem[];
  isNoMatch?: boolean;
  canRetry?: boolean;
}
