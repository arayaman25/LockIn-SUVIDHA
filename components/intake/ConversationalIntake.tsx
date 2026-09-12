'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { useApp } from '@/context/AppContext';
import { getLanguage } from '@/lib/languages';
import { useIntakeChat } from '@/src/lib/query/intake';
import { ChatMessageItem } from './intake.types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import IntakeProfileReview from './IntakeProfileReview';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';
import { SchemeRecommendationItem } from '@/src/types/scheme-matching';

// Stable UUID generator fallback for browser environments
function createStableChannelId(): string {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `chn-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

function formatCurrentTime(locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date());
}

/**
 * Safely normalizes the backend intake payload regardless of wrapper layers.
 */
function extractIntakePayload(response: any): {
  status: string;
  language: string;
  question: string | null;
  partialProfile: Record<string, unknown>;
  matches: SchemeRecommendationItem[];
  message: string;
  missingFields: string[];
} {
  let target = response;
  if (
    target?.data &&
    typeof target.data === 'object' &&
    ('status' in target.data ||
      'question' in target.data ||
      'matches' in target.data ||
      'message' in target.data ||
      'partialProfile' in target.data)
  ) {
    target = target.data;
  } else if (target?.data?.data) {
    target = target.data.data;
  }

  const status = target?.status || 'needs_clarification';
  const language = target?.language || target?.detectedLanguage || 'en';
  const question = target?.question || target?.clarifyingQuestion || null;
  const partialProfile = target?.partialProfile || target?.extractedProfile || {};
  const matches = Array.isArray(target?.matches) ? target.matches : [];
  const message = target?.message || '';
  const missingFields = target?.missingFields || target?.missingRequiredFields || [];

  return {
    status,
    language,
    question,
    partialProfile,
    matches,
    message,
    missingFields,
  };
}

/**
 * Pure helper to merge non-null extracted profile fields without overwriting user data with null.
 */
export function mergeExtractedProfile(
  current: Partial<CitizenProfileFormValues>,
  extracted: Record<string, unknown> | undefined
): Partial<CitizenProfileFormValues> {
  if (!extracted || typeof extracted !== 'object') return current;

  const updated: Partial<CitizenProfileFormValues> = { ...current };

  for (const [key, value] of Object.entries(extracted)) {
    if (value !== null && value !== undefined && value !== '') {
      if (
        key === 'annualFamilyIncome' ||
        key === 'age' ||
        key === 'estimatedProjectCost' ||
        key === 'requiredLoanAmount' ||
        key === 'latitude' ||
        key === 'longitude'
      ) {
        const num = Number(value);
        if (!isNaN(num)) {
          (updated as any)[key] = num;
        }
      } else if (key === 'isScheduledCaste') {
        (updated as any)[key] = Boolean(value);
      } else if (key === 'intent') {
        if (value === 'education_loan' || value === 'skill_training' || value === 'business_loan') {
          updated.intent = value;
        }
      } else if (key === 'projectType') {
        updated.projectType = String(value);
        if (!updated.occupationType) {
          updated.occupationType = String(value);
        }
      } else {
        (updated as any)[key] = value;
      }
    }
  }

  return updated;
}

/**
 * Explicit intake phase — the single source of truth for what to render.
 *
 * 'conversation' → backend still has missingRequiredFields; keep asking.
 * 'review'       → backend returned missingRequiredFields = []; show summary.
 *
 * The phase only advances to 'review' when the backend explicitly signals
 * completion. Field-count heuristics are NOT used.
 */
export type IntakePhase = 'conversation' | 'review';

interface ConversationalIntakeProps {
  initialProfile?: Partial<CitizenProfileFormValues>;
  onProfileUpdate?: (profile: Partial<CitizenProfileFormValues>) => void;
  onSwitchToForm?: () => void;
  onFindSchemes?: (profile: Partial<CitizenProfileFormValues>) => void;
  isMatchingSchemes?: boolean;
}

export default function ConversationalIntake({
  initialProfile = {},
  onProfileUpdate,
  onSwitchToForm,
  onFindSchemes,
  isMatchingSchemes = false,
}: ConversationalIntakeProps) {
  // Stable channel ID: created once on component mount, reused for every turn
  const [channelId] = useState<string>(() => createStableChannelId());

  // Accumulated profile state — start truly empty.
  // Only incorporate what was explicitly passed via initialProfile.
  // Never seed with demo/placeholder data; it leaks into the profile review card.
  const [accumulatedProfile, setAccumulatedProfile] = useState<Partial<CitizenProfileFormValues>>(
    () => ({ ...initialProfile })
  );

  /**
   * Intake phase — controls what is rendered.
   * Starts in 'conversation'. Advances to 'review' ONLY when the backend
   * returns missingRequiredFields = [].
   * Never advances based on field-count heuristics.
   */
  const [intakePhase, setIntakePhase] = useState<IntakePhase>('conversation');

  // The language the citizen chose on arrival is authoritative: it is what the
  // speech recognizer is configured with and what the backend is told to answer
  // in. It is never overwritten by the language the backend reports detecting.
  const { selectedLanguage } = useApp();
  const language = getLanguage(selectedLanguage);
  const timeLocale = `${language.code}-IN`;

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        "Namaste! I'm here to help you find a suitable government loan or assistance scheme. What would you like help with today?",
      timestamp: formatCurrentTime('en-IN'),
    },
  ]);

  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  // Ref to the scrollable messages container — used for internal-only scroll.
  // We never call scrollIntoView (which leaks to the page viewport).
  const containerRef = useRef<HTMLDivElement>(null);
  const intakeMutation = useIntakeChat();

  /**
   * Scroll the internal conversation container to the bottom ONLY when the
   * user is already near the bottom (within 80 px). If they have scrolled
   * upward to read earlier messages, their position is preserved exactly.
   */
  const scrollToBottomIfNearEnd = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 80; // px from bottom to consider "near end"
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= threshold) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  // Trigger smart scroll whenever messages change or pending state toggles.
  useEffect(() => {
    scrollToBottomIfNearEnd();
  }, [messages, intakeMutation.isPending, scrollToBottomIfNearEnd]);

  // Core send message handler
  const handleSendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || intakeMutation.isPending) return;

    setLastUserMessage(trimmed);

    // 1. Add user message locally
    const userMsgId = `user-${Date.now()}`;
    const newMessages: ChatMessageItem[] = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        content: trimmed,
        timestamp: formatCurrentTime(timeLocale),
      },
    ];
    setMessages(newMessages);

    // 2. Call backend intake API using existing TanStack Query hook
    intakeMutation.mutate(
      {
        message: trimmed,
        channelId: channelId,
        language: language.code,
      },
      {
        onSuccess: (rawResponse) => {
          const {
            status,
            question,
            partialProfile,
            matches,
            message,
            missingFields,
          } = extractIntakePayload(rawResponse);

          const timestamp = formatCurrentTime(timeLocale);

          // Merge newly extracted fields into local state and notify parent ONCE
          if (partialProfile && Object.keys(partialProfile).length > 0) {
            setAccumulatedProfile((prev) => {
              const merged = mergeExtractedProfile(prev, partialProfile);
              return merged;
            });
            onProfileUpdate?.(partialProfile as Partial<CitizenProfileFormValues>);
          }

          // ─── Advance phase based on backend's missingRequiredFields ──────────
          // This is the ONLY gate. Do not use profile field counts.
          if (missingFields.length === 0) {
            setIntakePhase('review');
          }
          // (If missingFields.length > 0 we stay in 'conversation'; no else needed.)
          // ─────────────────────────────────────────────────────────────────────

          // Case A: Matched schemes found
          if (status === 'matched' && matches.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                id: `asst-${Date.now()}`,
                role: 'assistant',
                content: 'Thanks. I have enough information to look for suitable schemes:',
                timestamp,
                matchedSchemes: matches,
              },
            ]);
            return;
          }

          // Case B: Needs clarification / in progress
          if (status === 'needs_clarification' || status === 'in_progress') {
            if (question) {
              setMessages((prev) => [
                ...prev,
                {
                  id: `asst-${Date.now()}`,
                  role: 'assistant',
                  content: question,
                  timestamp,
                },
              ]);
              return;
            }
          }

          // Case C: No match
          if (status === 'no_match' && message) {
            setMessages((prev) => [
              ...prev,
              {
                id: `asst-${Date.now()}`,
                role: 'assistant',
                content: message,
                timestamp,
                isNoMatch: true,
              },
            ]);
            return;
          }

          // If question existed regardless of status
          if (question) {
            setMessages((prev) => [
              ...prev,
              {
                id: `asst-${Date.now()}`,
                role: 'assistant',
                content: question,
                timestamp,
              },
            ]);
            return;
          }

          // Fallback only if no question was provided by backend
          setMessages((prev) => [
            ...prev,
            {
              id: `asst-${Date.now()}`,
              role: 'assistant',
              content:
                'Thank you. Could you also share your age, family income, and required loan amount?',
              timestamp,
            },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              id: `asst-err-${Date.now()}`,
              role: 'assistant',
              content: 'Something went wrong while processing your request. Please try again.',
              timestamp: formatCurrentTime(timeLocale),
              canRetry: true,
            },
          ]);
        },
      }
    );
  };

  const handleRetryLast = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)] min-h-[600px] max-h-[880px] bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Header Panel */}
      <div className="bg-stone-50 border-b border-stone-200 px-5 py-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00472f] text-white flex items-center justify-center shadow-sm">
            <Icon name="record_voice_over" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-none">
                Tell us what you need
              </h2>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                AI Guided Intake
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Describe your requirement in your own language. You can type or speak.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {/* Step-by-Step Form Fallback */}
          {onSwitchToForm && (
            <button
              type="button"
              onClick={onSwitchToForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-[#00472f] text-stone-700 hover:text-[#00472f] text-xs font-semibold bg-white shadow-xs transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Prefer a step-by-step form?</span>
              <span className="sm:hidden">Use a form</span>
              <Icon name="arrow_forward" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Conversation Message History */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 bg-[#fcfbf9]/60"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onRetry={handleRetryLast} />
        ))}

        {/* Profile Review — rendered ONLY when backend confirmed missingRequiredFields = [] */}
        {intakePhase === 'review' && (
          <IntakeProfileReview
            profile={accumulatedProfile}
            onFindSchemes={() => onFindSchemes?.(accumulatedProfile)}
            onEditInForm={() => onSwitchToForm?.()}
            isLoading={isMatchingSchemes}
          />
        )}

        {/* Loading / Thinking Indicator */}
        {intakeMutation.isPending && <TypingIndicator />}
      </div>

      {/* Bottom Sticky Input Container */}
      <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          isPending={intakeMutation.isPending}
          detectedLanguage={language.code}
        />

        {/* Bottom Helper Bar */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400 px-2">
          <span>Official SUVIDHA Citizen AI Assistant • Ministry of Social Justice</span>
          <Link href="/schemes" className="hover:text-stone-600 underline">
            Browse Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
