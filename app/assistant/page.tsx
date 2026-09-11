'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import ConversationalIntake from '@/components/intake/ConversationalIntake';

export default function AssistantPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-stone-500 mb-6 pb-2 border-b border-stone-200"
      >
        <Link
          href="/"
          className="hover:text-[#00472f] flex items-center gap-1 transition-colors"
        >
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#00472f]">Citizen AI Assistant</span>
      </nav>

      {/* Main Conversational Intake Workspace */}
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto p-12 text-center text-sm text-stone-500">
            <div className="w-8 h-8 border-3 border-[#00472f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>Loading SUVIDHA AI Assistant...</p>
          </div>
        }
      >
        <ConversationalIntake />
      </Suspense>
    </div>
  );
}
