'use client';

import React from 'react';
import { SchemeRecommendationResponse, SchemeRecommendationItem } from '../../types/scheme-matching';
import SchemeRecommendationCard from './SchemeRecommendationCard';
import Icon from '../../../components/Icon';
import Link from 'next/link';

interface RecommendationResultsProps {
  isLoading: boolean;
  error: Error | null;
  data: SchemeRecommendationResponse | null;
  onRetry: () => void;
  onReviewProfile: () => void;
}

export default function RecommendationResults({
  isLoading,
  error,
  data,
  onRetry,
  onReviewProfile,
}: RecommendationResultsProps) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl border border-outline/10 p-8 sm:p-12 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="search" size={24} className="text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-on-surface mb-2">
          Finding schemes suitable for you…
        </h2>
        <p className="text-on-surface-variant max-w-md mx-auto text-sm leading-relaxed mb-8">
          Analyzing your caste profile, income criteria, occupation specifics, and financing needs against all official Ministry schemes.
        </p>

        {/* Skeleton cards */}
        <div className="space-y-4 max-w-2xl mx-auto text-left">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-outline/15 bg-surface-variant/20 animate-pulse space-y-4"
            >
              <div className="h-6 bg-outline/20 rounded w-2/3" />
              <div className="h-4 bg-outline/15 rounded w-5/6" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="h-10 bg-outline/10 rounded" />
                <div className="h-10 bg-outline/10 rounded" />
                <div className="h-10 bg-outline/10 rounded" />
                <div className="h-10 bg-outline/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="bg-surface rounded-2xl border border-red-200 p-8 sm:p-12 shadow-sm text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <Icon name="alert-triangle" size={28} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-on-surface mb-2">
          Unable to fetch recommendations
        </h2>
        <p className="text-on-surface-variant max-w-md mx-auto text-sm leading-relaxed mb-6">
          {error.message || 'The scheme recommendation engine could not be reached. Please check your connection or try again.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
          >
            <Icon name="refresh-cw" size={16} />
            Try Again
          </button>
          <button
            type="button"
            onClick={onReviewProfile}
            className="px-6 py-2.5 rounded-lg border border-outline/30 text-on-surface font-medium text-sm hover:bg-surface-variant/40 transition-colors"
          >
            Review My Information
          </button>
        </div>
      </div>
    );
  }

  const matches = data?.data?.matches || [];

  // 3. No Match State
  if (matches.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-outline/10 p-8 sm:p-12 shadow-sm text-center">
        <div
          className="w-16 h-16 mx-auto mb-5 flex items-center justify-center text-primary"
          role="img"
          aria-label="Scheme matching illustration"
        >
          <svg
            viewBox="0 0 64 64"
            className="w-14 h-14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="13" y="9" width="34" height="44" rx="4" fill="#E2EFE8" stroke="#0B5D46" strokeWidth="2.5" />
            <path d="M21 20H39M21 27H35M21 34H31" stroke="#5C8F7D" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="41" cy="40" r="9" fill="#F8FAF7" stroke="#0B5D46" strokeWidth="2.5" />
            <path d="M47.5 46.5L54 53" stroke="#0B5D46" strokeWidth="3" strokeLinecap="round" />
            <path d="M36.5 40L39.5 43L45 36.5" stroke="#317B68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-on-surface mb-2">
          No suitable schemes were found based on the information provided.
        </h2>
        <p className="text-on-surface-variant max-w-lg mx-auto text-sm leading-relaxed mb-8">
          This may happen if the requested loan amount exceeds specific scheme ceilings, income thresholds differ, or caste/eligibility parameters didn't match currently active Ministry schemes.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={onReviewProfile}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
          >
            <Icon name="edit-2" size={16} />
            Review My Information
          </button>

          <Link
            href="/assistant"
            className="px-6 py-2.5 rounded-lg border border-primary text-primary font-medium text-sm hover:bg-primary/5 transition-colors inline-flex items-center gap-2"
          >
            <Icon name="message-square" size={16} />
            Talk to Assistant
          </Link>
        </div>
      </div>
    );
  }

  // 4. Success State with Matches
  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-outline/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-on-surface">
            Schemes suitable for you
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            We found <strong className="text-primary font-semibold">{matches.length} scheme{matches.length > 1 ? 's' : ''}</strong> matching your personal and business criteria.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onReviewProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-outline-variant bg-surface text-xs font-semibold text-primary hover:bg-surface-container transition-colors"
          >
            <Icon name="edit-2" size={14} />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('suvidha_preferred_schemes');
                window.location.href = '/wizard?purpose=business';
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-outline-variant bg-surface text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Icon name="refresh-cw" size={14} />
            <span>Start New Check</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((item: SchemeRecommendationItem, idx: number) => (
          <SchemeRecommendationCard
            key={item.schemeId}
            scheme={item}
            rank={idx + 1}
          />
        ))}
      </div>

      <div className="p-4 rounded-xl bg-secondary-container/50 border border-secondary-container flex items-start gap-3 text-xs text-on-secondary-container">
        <Icon name="info" size={16} className="shrink-0 mt-0.5" />
        <span>
          <strong>Note:</strong> Matching scores and interest subvention rates are computed in real time based on your self-declared criteria and official NBCFDC / NSFDC / MoSJE guidelines. Final approval depends on documentary verification by Channel Partner centers and State Channelizing Agencies (SCAs).
        </span>
      </div>
    </div>
  );
}
