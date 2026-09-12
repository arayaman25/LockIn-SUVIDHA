'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { ChatMessageItem } from './intake.types';
import { SchemeRecommendationItem } from '@/src/types/scheme-matching';

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

          {/* Matched schemes returned by the backend intake and matcher */}
          {message.matchedSchemes && message.matchedSchemes.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                <Icon name="verified" size={16} className="text-[#00472f]" />
                <span>{message.matchedSchemes.length} scheme{message.matchedSchemes.length === 1 ? '' : 's'} match your profile</span>
              </div>

              <div className="space-y-3">
                {message.matchedSchemes.map((scheme: SchemeRecommendationItem, index) => (
                  <div
                    key={scheme.schemeId || scheme.schemeCode}
                    className={`${index === 0 ? 'border-[#00472f]/25 p-4 sm:p-5 shadow-sm' : 'border-stone-200 p-3'} rounded-xl border bg-white transition-all hover:border-[#00472f]/50`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {index === 0 && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#00472f] text-white">Best match</span>}
                          <h4 className={`${index === 0 ? 'text-base' : 'text-sm'} font-bold text-stone-900`}>
                            {scheme.schemeName}
                          </h4>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-stone-600">
                          {scheme.summary || scheme.description || scheme.reasoning}
                        </p>
                      </div>

                      {Number.isFinite(scheme.matchScore) && (
                        <div className="text-right shrink-0">
                          <span className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-800">
                            {Math.round(scheme.matchScore)}% profile match
                          </span>
                        </div>
                      )}
                    </div>

                    {index === 0 && (
                      <>
                        <div className="border-t border-stone-100 pt-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Why this may suit you</p>
                          <p className="mt-1 text-xs leading-relaxed text-stone-700">{scheme.whyItFits || scheme.reasoning}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-lg text-xs sm:grid-cols-3">
                          {scheme.maxLoanAmount && <div><span className="block text-[10px] text-stone-500">Maximum loan</span><span className="font-semibold text-stone-900">₹{Number(scheme.maxLoanAmount).toLocaleString('en-IN')}</span></div>}
                          {Number.isFinite(scheme.repaymentTenureMonths) && <div><span className="block text-[10px] text-stone-500">Repayment tenure</span><span className="font-semibold text-stone-900">Up to {scheme.repaymentTenureMonths} months</span></div>}
                          {scheme.interestRateMin && scheme.interestRateMax && <div><span className="block text-[10px] text-stone-500">Interest rate</span><span className="font-semibold text-stone-900">{scheme.interestRateMin === scheme.interestRateMax ? scheme.interestRateMin : `${scheme.interestRateMin}-${scheme.interestRateMax}`}% p.a.</span></div>}
                        </div>
                      </>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
                      <Link
                        href={`/schemes/${scheme.schemeCode || scheme.schemeId}`}
                        className="text-[#00472f] hover:underline"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/locator?scheme=${encodeURIComponent(scheme.schemeCode)}`}
                        className="text-[#00472f] hover:underline"
                      >
                        Nearby Partner
                      </Link>
                      {scheme.sourceUrl && (
                        <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#00472f] hover:underline">
                          More Info <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                    {index === 0 && <p className="mt-2 text-[11px] text-stone-500">Final eligibility is subject to official verification.</p>}
                  </div>
                ))}
              </div>
              {message.matchedSchemes.length > 1 && <p className="text-center text-xs font-semibold text-[#00472f]">View all matching schemes →</p>}
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
