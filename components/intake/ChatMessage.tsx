'use client';

import React from 'react';
import Link from 'next/link';
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
      <div className="flex items-start gap-3 max-w-[95%] sm:max-w-[85%]">
        {/* Assistant Emblem Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#00472f] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Icon name="smart_toy" size={18} />
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

          {/* Matched Schemes List (when backend intake reaches 'matched') */}
          {message.matchedSchemes && message.matchedSchemes.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Icon name="verified" size={16} className="text-[#00472f]" />
                <span>Recommended Concessional Schemes ({message.matchedSchemes.length})</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {message.matchedSchemes.map((scheme: SchemeRecommendationItem) => (
                  <div
                    key={scheme.schemeId || scheme.schemeCode}
                    className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-sm hover:border-[#00472f]/50 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-[#00472f] border border-emerald-200">
                            {scheme.schemeCode}
                          </span>
                          <h4 className="text-base font-bold text-stone-900">
                            {scheme.schemeName}
                          </h4>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {scheme.reasoning}
                        </p>
                      </div>

                      {typeof scheme.matchScore === 'number' && (
                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            {Math.round(scheme.matchScore)}% Match
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Key Loan Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-lg text-xs">
                      <div>
                        <span className="text-stone-500 block text-[11px]">Interest Rate</span>
                        <span className="font-semibold text-emerald-800">
                          {scheme.interestRateMin === scheme.interestRateMax
                            ? `${scheme.interestRateMin}%`
                            : `${scheme.interestRateMin}% - ${scheme.interestRateMax}%`}{' '}
                          p.a.
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[11px]">Max Loan</span>
                        <span className="font-semibold text-stone-900 font-mono">
                          ₹{Number(scheme.maxLoanAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-stone-500 block text-[11px]">Repayment Tenure</span>
                        <span className="font-semibold text-stone-900">
                          Up to {scheme.repaymentTenureMonths} months
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <Link
                        href={`/calculator?scheme=${scheme.schemeCode}`}
                        className="text-xs font-semibold text-[#00472f] hover:underline flex items-center gap-1"
                      >
                        <Icon name="calculate" size={14} />
                        <span>Calculate EMI (किस्त देखें)</span>
                      </Link>

                      <Link
                        href={`/apply?scheme=${scheme.schemeCode.toLowerCase()}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00472f] text-white text-xs font-semibold hover:bg-[#003824] transition-colors"
                      >
                        <span>Apply (आवेदन करें)</span>
                        <Icon name="arrow_forward" size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
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
