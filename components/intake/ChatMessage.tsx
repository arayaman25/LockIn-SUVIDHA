'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { ChatMessageItem } from './intake.types';

interface ChatMessageProps {
  message: ChatMessageItem;
  onRetry?: () => void;
}

export default function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end my-3 animate-in fade-in duration-200">
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
          <div className="bg-[#00472f] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm text-sm sm:text-base leading-relaxed break-words">
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.timestamp && (
              <span className="text-[10px] text-emerald-200/70 block text-right mt-1 font-mono">
                {message.timestamp}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 text-xs font-semibold">
            <Icon name="person" size={18} />
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex justify-start my-3 animate-in fade-in duration-200">
      <div className="flex max-w-[98%] items-start gap-3 sm:max-w-[92%]">
        {/* Assistant Emblem Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#00472f] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Image
            src="/images/suvidha-logo.png"
            alt="SUVIDHA Assistant"
            width={28}
            height={28}
            className="h-7 w-7 rounded-full bg-white p-0.5 object-contain"
          />
        </div>

        <div className="space-y-3 flex-1">
          {/* Main text bubble */}
          <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm text-sm sm:text-base text-stone-800 leading-relaxed">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#00472f] uppercase tracking-wider">
                SUVIDHA Assistant
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {message.timestamp}
              </span>
            </div>

            <p className="whitespace-pre-wrap text-stone-900 font-medium">
              {message.content}
            </p>

            {/* If error state with retry */}
            {message.canRetry && onRetry && (
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00472f] text-white text-xs font-semibold hover:bg-[#003824] transition-colors"
                >
                  <Icon name="refresh" size={14} />
                  <span>Try Again (पुनः प्रयास करें)</span>
                </button>
              </div>
            )}
          </div>

          {/* Completion state: recommendations are shown on the dedicated page. */}
          {message.matchedSchemes && message.matchedSchemes.length > 0 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex items-start gap-2">
                <Icon name="check_circle" size={18} className="mt-0.5 shrink-0 text-[#276448]" />
                <p className="text-sm font-medium leading-relaxed text-stone-800">
                  Thanks! I&apos;ve collected the information needed to find schemes suited to you.
                </p>
              </div>
              <Link
                href="/recommended-schemes"
                className="mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#003824]"
              >
                <span>View Recommended Schemes</span>
                <Icon name="arrow_forward" size={14} />
              </Link>
            </div>
          )}

          {/* No Match Fallback Suggestions */}
          {message.isNoMatch && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 space-y-2">
              <p className="font-semibold">Helpful Alternatives (वैकल्पिक सुविधाएं):</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href="/wizard"
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-medium hover:bg-amber-100 text-stone-800"
                >
                  Start Detailed Form Wizard (विस्तृत फ़ॉर्म)
                </Link>
                <Link
                  href="/schemes"
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-medium hover:bg-amber-100 text-stone-800"
                >
                  Explore All Directory Schemes (सभी योजनाएं)
                </Link>
                <Link
                  href="/locator"
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-medium hover:bg-amber-100 text-stone-800"
                >
                  Find Nearby Bank Helpdesk (सहायता केंद्र)
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
