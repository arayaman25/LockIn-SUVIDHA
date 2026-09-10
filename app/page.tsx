'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { SUVIDHA_SCHEMES } from '@/lib/data';
import SchemeCard from '@/components/SchemeCard';
import Icon from '@/components/Icon';
import HeroCarousel from '@/components/HeroCarousel';

export default function HomePage() {
  const { setIsCompanionOpen } = useApp();
  const featuredSchemes = SUVIDHA_SCHEMES.slice(0, 3);

  return (
    <div className="space-y-0">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Card 4: Track Application */}
          <Link
            href="/tracking"
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 hover:border-primary hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shrink-0">
                <Icon name="track_changes" className="w-6 h-6 text-on-surface" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                Track Application
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Check live review progress, document verification status, and sanction updates.
              </p>
            </div>
            <span className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Track status →
            </span>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIMPLIFIED FEATURED SCHEMES SECTION (EXACTLY 3 CLEAN CARDS)            */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-low border-y border-outline-variant/30 py-16" id="schemes">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <p className="text-xs font-bold text-secondary uppercase">
                High-Demand Assistance
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-1">
                Explore schemes that may help you
              </h2>
            </div>
            <Link
              className="text-primary hover:underline font-bold text-sm flex items-center gap-1"
              href="/schemes"
            >
              <span>View all schemes</span>
              <Icon name="arrow_forward" className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS SECTION (4 CLEAR STEPS)                                  */}
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
      {/* 5. HELP SECTION (NEAR BOTTOM)                                            */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-low border-t border-outline-variant/30 py-16" id="help">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-serif font-bold text-primary">
                Need help getting started?
              </h3>
              <p className="text-sm text-on-surface-variant">
                Our citizen support network is available across web, voice assistance, and lead bank helpdesks.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                className="px-5 py-2.5 bg-primary text-surface hover:bg-primary-container rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                onClick={() => setIsCompanionOpen(true)}
              >
                <Icon name="record_voice_over" className="w-4 h-4 text-white" />
                <span>Ask for Help</span>
              </button>
              <Link
                className="px-5 py-2.5 bg-surface text-primary border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                href="/help"
              >
                <Icon name="help_outline" className="w-4 h-4 text-primary" />
                <span>Frequently Asked Questions</span>
              </Link>
              <Link
                className="px-5 py-2.5 bg-surface text-primary border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                href="/locator"
              >
                <Icon name="support_agent" className="w-4 h-4 text-primary" />
                <span>Locate Nearest Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
