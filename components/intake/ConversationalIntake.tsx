"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useApp } from "@/context/AppContext";
import { getLanguage } from "@/lib/languages";
import { useIntakeChat } from "@/src/lib/query/intake";
import { fetchSchemeSummary } from "@/src/lib/api/scheme-matching";
import { ChatMessageItem } from "./intake.types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import ApplicationDetailsPanel from "./ApplicationDetailsPanel";
import { CitizenProfileFormValues } from "@/src/lib/schemas/scheme-matching";
import { SchemeRecommendationItem } from "@/src/types/scheme-matching";

const WELCOME_MESSAGE_ID = "welcome-msg";

// Languages without an entry fall back to English, which the page-level
// translation layer then renders in the citizen's language.
const WELCOME_MESSAGES: Record<string, string> = {
  en: "Namaste! I'm here to help you find a suitable government loan or assistance scheme. What would you like help with today?",
  hi: "नमस्ते! मैं आपके लिए उपयुक्त सरकारी ऋण या सहायता योजना खोजने में मदद करूँगा। आज आप किस बारे में सहायता चाहते हैं?",
  bn: "নমস্কার! আমি আপনার জন্য উপযুক্ত সরকারি ঋণ বা সহায়তা প্রকল্প খুঁজে পেতে সাহায্য করব। আজ আপনি কী বিষয়ে সাহায্য চান?",
  mr: "नमस्कार! मी तुमच्यासाठी योग्य सरकारी कर्ज किंवा सहाय्य योजना शोधण्यात मदत करेन. आज तुम्हाला कशासाठी मदत हवी आहे?",
  ta: "வணக்கம்! உங்களுக்கு ஏற்ற அரசு கடன் அல்லது உதவித் திட்டத்தைக் கண்டறிய நான் உதவுகிறேன். இன்று உங்களுக்கு எதில் உதவி தேவை?",
  te: "నమస్కారం! మీకు సరిపోయే ప్రభుత్వ రుణం లేదా సహాయ పథకాన్ని కనుగొనడంలో నేను సహాయం చేస్తాను. ఈ రోజు మీకు ఏ విషయంలో సహాయం కావాలి?",
  gu: "નમસ્તે! તમારા માટે યોગ્ય સરકારી લોન અથવા સહાય યોજના શોધવામાં હું મદદ કરીશ. આજે તમને શેમાં મદદ જોઈએ છે?",
  kn: "ನಮಸ್ಕಾರ! ನಿಮಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಸಾಲ ಅಥವಾ ಸಹಾಯ ಯೋಜನೆಯನ್ನು ಹುಡುಕಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಇಂದು ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?",
};

const getWelcomeMessage = (language: string) =>
  WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en;

const emptySubscribe = () => () => {};

// Stable UUID generator fallback for browser environments
function createStableChannelId(): string {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }
  return `chn-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

function formatCurrentTime(locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date());
}

const INITIAL_MESSAGE_TIMESTAMP = "";

/**
 * Safely normalizes the backend intake payload regardless of wrapper layers.
 */
type IntakePayloadTarget = Record<string, unknown>;

const isRecord = (value: unknown): value is IntakePayloadTarget =>
  typeof value === "object" && value !== null;

function extractIntakePayload(response: unknown): {
  status: string;
  language: string;
  question: string | null;
  partialProfile: Record<string, unknown>;
  matches: SchemeRecommendationItem[];
  channelId: string | null;
  message: string;
  missingFields: string[];
} {
  let target: IntakePayloadTarget = isRecord(response) ? response : {};
  const nestedData = target.data;
  if (
    isRecord(nestedData) &&
    ("status" in nestedData ||
      "question" in nestedData ||
      "matches" in nestedData ||
      "message" in nestedData ||
      "partialProfile" in nestedData)
  ) {
    target = nestedData;
  } else if (isRecord(nestedData) && isRecord(nestedData.data)) {
    target = nestedData.data;
  }

  const status =
    typeof target.status === "string" ? target.status : "needs_clarification";
  const language =
    typeof target.language === "string"
      ? target.language
      : typeof target.detectedLanguage === "string"
        ? target.detectedLanguage
        : "en";
  const question =
    typeof target.question === "string"
      ? target.question
      : typeof target.clarifyingQuestion === "string"
        ? target.clarifyingQuestion
        : null;
  const partialProfile = isRecord(target.partialProfile)
    ? target.partialProfile
    : isRecord(target.extractedProfile)
      ? target.extractedProfile
      : {};
  const matches = Array.isArray(target.matches)
    ? (target.matches as SchemeRecommendationItem[])
    : [];
  const message = typeof target.message === "string" ? target.message : "";
  const missingFields = Array.isArray(target.missingFields)
    ? (target.missingFields as string[])
    : Array.isArray(target.missingRequiredFields)
      ? (target.missingRequiredFields as string[])
      : [];
  const channelId =
    typeof target.channelId === "string" ? target.channelId : null;

  return {
    status,
    language,
    question,
    partialProfile,
    matches,
    message,
    missingFields,
    channelId,
  };
}

/**
 * Pure helper to merge non-null extracted profile fields without overwriting user data with null.
 */
export function mergeExtractedProfile(
  current: Partial<CitizenProfileFormValues>,
  extracted: Record<string, unknown> | undefined,
): Partial<CitizenProfileFormValues> {
  if (!extracted || typeof extracted !== "object") return current;

  const updated: Partial<CitizenProfileFormValues> = { ...current };
  const mutableUpdated = updated as Record<string, unknown>;

  for (const [key, value] of Object.entries(extracted)) {
    if (value !== null && value !== undefined && value !== "") {
      if (
        key === "annualFamilyIncome" ||
        key === "age" ||
        key === "estimatedProjectCost" ||
        key === "requiredLoanAmount" ||
        key === "latitude" ||
        key === "longitude"
      ) {
        const num = Number(value);
        if (!isNaN(num)) {
          mutableUpdated[key] = num;
        }
      } else if (key === "isScheduledCaste") {
        mutableUpdated[key] = Boolean(value);
      } else if (key === "intent") {
        if (
          value === "education_loan" ||
          value === "skill_training" ||
          value === "business_loan"
        ) {
          updated.intent = value;
        }
      } else if (key === "projectType") {
        updated.projectType = String(value);
        if (!updated.occupationType) {
          updated.occupationType = String(value);
        }
      } else {
        mutableUpdated[key] = value;
      }
    }
  }

  return updated;
}

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
}: ConversationalIntakeProps) {
  // Stable channel ID: created once on component mount, reused for every turn
  const [channelId] = useState<string>(() => createStableChannelId());

  // Accumulated profile state — start truly empty.
  // Only incorporate what was explicitly passed via initialProfile.
  // Never seed with demo/placeholder data; it leaks into the profile review card.
  const [accumulatedProfile, setAccumulatedProfile] = useState<
    Partial<CitizenProfileFormValues>
  >(() => ({ ...initialProfile }));

  // The language the citizen chose on arrival is authoritative: it is what the
  // speech recognizer is configured with and what the backend is told to answer
  // in. It is never overwritten by the language the backend reports detecting.
  const { selectedLanguage } = useApp();
  const language = getLanguage(selectedLanguage);
  const timeLocale = `${language.code}-IN`;

  // The chosen language comes from sessionStorage, so it is unknown during
  // server rendering. Anything derived from it waits for mount to keep the
  // server and first client render identical.
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const renderLanguage = mounted ? language.code : "en";

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: WELCOME_MESSAGE_ID,
      role: "assistant",
      content: getWelcomeMessage("en"),
      timestamp: INITIAL_MESSAGE_TIMESTAMP,
    },
  ]);

  const [lastUserMessage, setLastUserMessage] = useState<string>("");
  const [activeMobilePanel, setActiveMobilePanel] = useState<
    "chat" | "details"
  >("chat");
  // Ref to the scrollable messages container — used for internal-only scroll.
  // We never call scrollIntoView (which leaks to the page viewport).
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldFollowLatestRef = useRef(true);
  const intakeMutation = useIntakeChat();

  /**
   * Scroll the internal conversation container to the bottom ONLY when the
   * user is already near the bottom (within 80 px). If they have scrolled
   * upward to read earlier messages, their position is preserved exactly.
   */
  const scrollToBottomIfNearEnd = useCallback(() => {
    const el = containerRef.current;
    if (!el || !shouldFollowLatestRef.current) return;
    if (el.scrollHeight > el.clientHeight) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const handleMessageScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 80;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldFollowLatestRef.current = distanceFromBottom <= threshold;
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
        role: "user",
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
        onSuccess: async (rawResponse) => {
          const {
            status,
            question,
            partialProfile,
            matches,
            message,
            channelId: responseChannelId,
          } = extractIntakePayload(rawResponse);

          const timestamp = formatCurrentTime(timeLocale);

          // Merge newly extracted fields into local state and notify parent ONCE
          if (partialProfile && Object.keys(partialProfile).length > 0) {
            setAccumulatedProfile((prev) => {
              const merged = mergeExtractedProfile(prev, partialProfile);
              return merged;
            });
            onProfileUpdate?.(
              partialProfile as Partial<CitizenProfileFormValues>,
            );
          }

          // Case A: Matched schemes found
          if (status === "matched" && matches.length > 0) {
            // Summaries are written in the session's language by the backend;
            // matches still render without them if that call fails.
            const summaryResponse = responseChannelId
              ? await fetchSchemeSummary(responseChannelId).catch(() => null)
              : null;
            const summaries = new Map(
              summaryResponse?.data.schemeSummaries.map((summary) => [
                summary.schemeCode,
                summary,
              ]) || [],
            );
            const enrichedMatches = matches.map((scheme) => {
              const summary = summaries.get(scheme.schemeCode);
              return summary
                ? {
                    ...scheme,
                    summary: summary.headline,
                    whyItFits: summary.whyItFits,
                  }
                : scheme;
            });
            setMessages((prev) => [
              ...prev,
              {
                id: `asst-${Date.now()}`,
                role: "assistant",
                content:
                  "Thanks. I have enough information to find schemes that may suit your profile.",
                timestamp,
                matchedSchemes: enrichedMatches,
              },
            ]);
            setActiveMobilePanel("chat");
            return;
          }

          // Case B: Needs clarification / in progress
          if (status === "needs_clarification" || status === "in_progress") {
            if (question) {
              setMessages((prev) => [
                ...prev,
                {
                  id: `asst-${Date.now()}`,
                  role: "assistant",
                  content: question,
                  timestamp,
                },
              ]);
              return;
            }
          }

          // Case C: No match
          if (status === "no_match" && message) {
            setMessages((prev) => [
              ...prev,
              {
                id: `asst-${Date.now()}`,
                role: "assistant",
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
                role: "assistant",
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
              role: "assistant",
              content:
                "Thank you. Could you also share your age, family income, and required loan amount?",
              timestamp,
            },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              id: `asst-err-${Date.now()}`,
              role: "assistant",
              content:
                "Something went wrong while processing your request. Please try again.",
              timestamp: formatCurrentTime(timeLocale),
              canRetry: true,
            },
          ]);
        },
      },
    );
  };

  const handleRetryLast = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage);
    }
  };

  return (
    <div className="relative mx-auto flex h-[min(720px,calc(100vh-220px))] w-full max-w-[1200px] flex-col overflow-hidden bg-transparent md:w-[92%] sm:rounded-3xl">
      <div className="flex shrink-0 border-b border-stone-200 bg-stone-50 md:hidden">
        {(["chat", "details"] as const).map((panel) => (
          <button
            key={panel}
            type="button"
            onClick={() => setActiveMobilePanel(panel)}
            className={`flex-1 px-4 py-3 text-xs font-semibold ${activeMobilePanel === panel ? "border-b-2 border-[#00472f] text-[#00472f]" : "text-stone-500"}`}
          >
            {panel === "chat" ? "Chat" : "My Details"}
          </button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 md:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)] md:gap-6">
        <section
          className={`${activeMobilePanel === "chat" ? "flex" : "hidden"} h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:flex`}
        >
          {/* Top Header Panel */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-200 bg-stone-50 px-5 py-3.5">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00472f] text-white shadow-sm">
                <Icon name="record_voice_over" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                  <h2 className="shrink-0 whitespace-nowrap text-base font-serif font-bold leading-tight text-stone-900 sm:text-lg">
                    Tell us what you need
                  </h2>
                  <span className="hidden shrink-0 whitespace-nowrap rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 sm:inline-block">
                    AI Guided Intake
                  </span>
                </div>
                <p className="mt-1 max-w-[48rem] text-xs leading-4 text-stone-500">
                  Describe your requirement in your own language. You can type
                  or speak.
                </p>
              </div>
            </div>

            {/* Step-by-Step Form Fallback */}
            {onSwitchToForm && (
              <div className="flex shrink-0 items-center gap-2 pt-0.5 text-right">
                <button
                  type="button"
                  onClick={onSwitchToForm}
                  aria-label="Switch to step-by-step form"
                  className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 shadow-xs transition-colors hover:border-[#00472f] hover:text-[#00472f]"
                >
                  <span className="hidden sm:inline">Step-by-step</span>
                  <Icon name="arrow_forward" size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Scrollable Conversation Message History */}
          <div
            ref={containerRef}
            onScroll={handleMessageScroll}
            className="flex-1 space-y-2 overflow-y-auto bg-[#fcfbf9]/60 px-4 py-4 sm:px-5"
          >
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={
                  msg.id === WELCOME_MESSAGE_ID
                    ? { ...msg, content: getWelcomeMessage(renderLanguage) }
                    : msg
                }
                onRetry={handleRetryLast}
              />
            ))}

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
              <span>
                Official SUVIDHA Citizen AI Assistant • Ministry of Social
                Justice
              </span>
              <Link href="/schemes" className="hover:text-stone-600 underline">
                Browse Directory
              </Link>
            </div>
          </div>
        </section>
        <section
          className={`${activeMobilePanel === "details" ? "flex" : "hidden"} h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:flex`}
        >
          <ApplicationDetailsPanel
            profile={accumulatedProfile}
            onReview={() => onSwitchToForm?.()}
            language={renderLanguage}
          />
        </section>
      </div>
    </div>
  );
}
