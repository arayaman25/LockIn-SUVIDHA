'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import HeroCarousel from '@/components/HeroCarousel';
import LanguageGate from '@/components/LanguageGate';
import { useApp } from '@/context/AppContext';

const emptySubscribe = () => () => {};

export default function HomePage() {
  const { selectedLanguage, setSelectedLanguage, hasChosenLanguage } = useApp();
  // The choice is read from sessionStorage, so it is unknown while the page is
  // server-rendered. Gate on this to avoid a hydration mismatch.
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <div className="space-y-0">
      {mounted && !hasChosenLanguage && (
        <LanguageGate value={selectedLanguage} onSelect={setSelectedLanguage} />
      )}

      <HeroCarousel />

      {/* ========================================================================= */}
      {/* 2. "WHAT WOULD YOU LIKE TO DO TODAY?" (4 UNIFORM SERVICE CARDS)          */}
      {/* ========================================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 md:px-8 py-16" id="services">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-bold text-secondary tracking-wide uppercase">
            Quick Civic Pathways
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-1">
            What would you like to do today?
          </h2>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Simple tools to guide you toward financial empowerment without complex paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Find My Scheme */}
          <Link
            href="/wizard"
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 hover:border-primary hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shrink-0">
                <Icon name="checklist" className="w-6 h-6 text-on-secondary-container" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                Find My Scheme
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Answer 3 gentle questions to discover schemes matching your trade, income, and category.
              </p>
            </div>
            <span className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Start questionnaire →
            </span>
          </Link>

          {/* Card 2: Calculate EMI */}
          <Link
            href="/calculator"
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 hover:border-primary hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shrink-0">
                <Icon name="calculate" className="w-6 h-6 text-on-secondary-fixed" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                Calculate EMI
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Simulate monthly installments with interest subventions and moratorium allowances.
              </p>
            </div>
            <span className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open calculator →
            </span>
          </Link>

          {/* Card 3: Find a Partner */}
          <Link
            href="/locator"
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 hover:border-primary hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shrink-0">
                <Icon name="pin_drop" className="w-6 h-6 text-on-primary-fixed" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                Find a Partner
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Locate public sector bank branches, rural gramin banks, and CSCs in your district.
              </p>
            </div>
            <span className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Find centers →
            </span>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS SECTION (4 CLEAR STEPS)                                  */}
      {/* ========================================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 md:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-bold text-secondary uppercase">
            Simplified Journey
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-1">
            How it works
          </h2>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Every step designed with human dignity, plain language, and zero stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
            <span className="text-3xl font-serif font-bold text-secondary/50 block">
              01
            </span>
            <h3 className="text-base font-bold text-primary">
              Tell us what you need
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Select your trade, educational ambition, or enterprise goal in simple language.
            </p>
          </div>

          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
            <span className="text-3xl font-serif font-bold text-secondary/50 block">
              02
            </span>
            <h3 className="text-base font-bold text-primary">
              Check your eligibility
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Instant rule-matching verifies whether you qualify for interest subventions or waivers.
            </p>
          </div>

          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
            <span className="text-3xl font-serif font-bold text-secondary/50 block">
              03
            </span>
            <h3 className="text-base font-bold text-primary">
              Choose a suitable scheme
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Compare loan limits, interest subsidies, and repayments before taking a decision.
            </p>
          </div>

          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
            <span className="text-3xl font-serif font-bold text-secondary/50 block">
              04
            </span>
            <h3 className="text-base font-bold text-primary">
              Apply and track
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Submit online or through a local partner bank and follow live status updates anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HELP SECTION (NEAR BOTTOM)                                            */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-low border-t border-outline-variant/30 py-16" id="help">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 shadow-sm">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <h3 className="text-2xl font-serif font-bold text-primary">
                Not sure which scheme is right for you?
              </h3>
              <p className="text-sm text-on-surface-variant">
                Tell us about your needs, and we’ll help you find suitable government loan and assistance schemes.
              </p>
            </div>
            <Link
              className="shrink-0 px-5 py-2.5 bg-primary text-surface hover:bg-primary-container rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
              href="/assistant"
            >
              <Icon name="record_voice_over" className="w-4 h-4 text-white" />
              <span>Ask for Help</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
