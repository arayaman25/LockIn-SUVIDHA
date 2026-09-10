'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FAQS } from '@/lib/data';
import Icon from '@/components/Icon';

export default function HelpPage() {
  const { setIsCompanionOpen } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">Citizen Assistance &amp; Help Center</span>
      </nav>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Title Header */}
        <div className="text-center">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container uppercase">
            Citizen Support Network
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-2">
            How can we assist you today?
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-xl mx-auto">
            Multilingual guidance, query resolution, and lead bank escalation helplines available round the clock.
          </p>
        </div>

        {/* 3 Contact Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-civic space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center">
              <Icon name="call" className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-sm font-bold text-primary">Toll-Free Helpline</h3>
            <p className="text-xs text-on-surface-variant">
              Speak directly with an authorized citizen executive 24x7 in 8 languages.
            </p>
            <a
              href="tel:18001117788"
              className="text-primary font-bold text-base block hover:underline"
            >
              1800-111-7788
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-civic space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
              <Icon name="pin_drop" className="w-5 h-5 text-on-primary-fixed" />
            </div>
            <h3 className="text-sm font-bold text-primary">Physical Bank Desks</h3>
            <p className="text-xs text-on-surface-variant">
              Visit a designated Public Sector branch or CSC center in your tehsil.
            </p>
            <Link
              href="/locator"
              className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
            >
              <span>Locate desk</span>
              <Icon name="arrow_forward" className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-civic space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <Icon name="record_voice_over" className="w-5 h-5 text-on-secondary-fixed" />
            </div>
            <h3 className="text-sm font-bold text-primary">Voice Assistant</h3>
            <p className="text-xs text-on-surface-variant">
              Ask simple spoken questions via SUVIDHA Companion in Hindi or English.
            </p>
            <button
              onClick={() => setIsCompanionOpen(true)}
              className="text-primary font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Start voice help</span>
              <Icon name="arrow_forward" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/50 shadow-civic space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="help_outline" className="w-5 h-5 text-primary" />
            <h3 className="text-base font-serif font-bold text-primary">
              Frequently Asked Civic Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-outline-variant/40 bg-surface overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 flex justify-between items-center gap-4 hover:bg-secondary-container/10 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-primary text-xs md:text-sm">
                      {faq.q}
                    </span>
                    <Icon
                      name="expand_more"
                      className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-2 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vigilance & Zero Tolerance Box */}
        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-primary text-sm flex items-center gap-1.5 font-serif">
              <Icon name="shield_person" className="w-4 h-4 text-secondary" />
              <span>Zero Intermediary &amp; Anti-Corruption Vigilance</span>
            </h4>
            <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
              All services on SUVIDHA are strictly free. Demand of commission or bribery is punishable under Section 7 of the Prevention of Corruption Act.
            </p>
          </div>

          <a
            href="https://pgportal.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shrink-0 flex items-center gap-1 shadow-xs"
          >
            <span>Lodge Grievance (CPGRAMS)</span>
            <Icon name="open_in_new" className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
