'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { MockRecommendedScheme } from '@/src/lib/mock-recommended-schemes';

export default function RecommendedSchemeCard({ scheme }: { scheme: MockRecommendedScheme }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#276448]">About this scheme</p>
          <h2 className="mt-2 text-xl font-serif font-bold text-[#00472f]">{scheme.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">{scheme.summary}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:w-[330px] lg:flex-col">
          <Link
            href={scheme.detailHref}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#00472f] px-4 text-xs font-semibold text-[#00472f] transition-colors hover:bg-emerald-50"
          >
            <span>Know More</span>
            <Icon name="arrow_forward" size={14} />
          </Link>
          <Link
            href={`/simple-explanation/${encodeURIComponent(scheme.id)}`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 text-xs font-semibold text-stone-700 transition-colors hover:border-[#00472f] hover:text-[#00472f]"
          >
            <span>Explain This Simply</span>
            <Icon name="arrow_forward" size={14} />
          </Link>
          <Link
            href={`/locator?scheme=${encodeURIComponent(scheme.partnerSchemeCode)}`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#003824]"
          >
            <span>Find Nearest Channel Partner</span>
            <Icon name="arrow_forward" size={14} />
          </Link>
        </div>
      </div>

    </article>
  );
}
