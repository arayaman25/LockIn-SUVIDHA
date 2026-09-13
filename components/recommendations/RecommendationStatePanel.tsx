'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import type { RecommendationSource } from '@/src/lib/recommendation-source';
import type { RecommendedSchemesState } from './useRecommendedSchemes';

type PendingState = Exclude<RecommendedSchemesState, { status: 'ready' }>;

// Where a citizen goes to fix what the backend could not match on.
const RETURN_TO_INTAKE: Record<RecommendationSource['kind'], { href: string; label: string }> = {
  chat: { href: '/assistant', label: 'Continue with the Assistant' },
  wizard: { href: '/wizard', label: 'Review Your Details' },
};

const primaryActionClass =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#003824]';

function LoadingSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <p className="text-sm text-stone-600">Preparing your personalised recommendations…</p>
      {[1, 2].map((placeholder) => (
        <div
          key={placeholder}
          className="animate-pulse space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="h-3 w-24 rounded bg-stone-200" />
          <div className="h-5 w-2/3 rounded bg-stone-200" />
          <div className="h-4 w-5/6 rounded bg-stone-100" />
        </div>
      ))}
    </div>
  );
}

function MessagePanel({ message, children }: { message: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <Icon name="info" size={20} className="mt-0.5 shrink-0 text-[#276448]" />
        <p className="text-sm leading-relaxed text-stone-700">{message}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3 border-t border-stone-100 pt-5">{children}</div>
    </section>
  );
}

const ActionLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className={primaryActionClass}>
    <span>{label}</span>
    <Icon name="arrow_forward" size={14} />
  </Link>
);

/** Everything a recommendations page shows before it has schemes to render. */
export default function RecommendationStatePanel({ state }: { state: PendingState }) {
  switch (state.status) {
    case 'loading':
      return <LoadingSkeleton />;
    case 'no-session':
      return (
        <MessagePanel message="Tell us what you need first, and we will recommend the schemes that suit you.">
          <ActionLink href="/find-scheme" label="Find My Scheme" />
        </MessagePanel>
      );
    case 'unavailable':
      return (
        <MessagePanel message={state.message}>
          <ActionLink {...RETURN_TO_INTAKE[state.source.kind]} />
        </MessagePanel>
      );
    case 'error':
      return (
        <MessagePanel message={state.message}>
          <button type="button" onClick={state.retry} className={primaryActionClass}>
            <Icon name="sync" size={14} />
            <span>Try Again</span>
          </button>
        </MessagePanel>
      );
  }
}
