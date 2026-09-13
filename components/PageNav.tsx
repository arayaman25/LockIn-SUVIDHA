'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/Icon';
import { useRecommendationSource } from '@/components/recommendations/useRecommendedSchemes';
import { RECOMMENDED_SCHEMES_PATH } from '@/src/lib/recommendation-source';

export interface BreadcrumbLink {
  label: string;
  href: string;
}

interface PageNavProps {
  /** The current page's name, shown as the last breadcrumb. */
  current: string;
  /** Pages between Home and the current page, outermost first. */
  parents?: BreadcrumbLink[];
}

const HOME: BreadcrumbLink = { label: 'Home', href: '/' };

/**
 * Back button plus breadcrumbs for citizen pages.
 *
 * "Back" goes to the page's logical parent (the last breadcrumb) instead of
 * browser history, so it behaves the same whether the citizen arrived by
 * clicking through, from a shared link, or after a refresh.
 */
export default function PageNav({ current, parents = [] }: PageNavProps) {
  const back = parents.at(-1) ?? HOME;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-outline-variant/40 pb-3 text-xs"
    >
      <Link
        href={back.href}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 font-semibold text-primary transition-colors hover:border-primary hover:bg-surface-container"
      >
        <Icon name="arrow_back" className="h-3.5 w-3.5" />
        <span>Back</span>
        <span className="sr-only"> to {back.label}</span>
      </Link>

      <span aria-hidden="true" className="hidden h-4 w-px bg-outline-variant sm:block" />

      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-on-surface-variant">
        {[HOME, ...parents].map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <Link href={crumb.href} className="flex items-center gap-1 hover:text-primary">
              {crumb.href === HOME.href && <Icon name="home" className="h-3.5 w-3.5" />}
              <span>{crumb.label}</span>
            </Link>
            <Icon name="chevron_right" className="h-3 w-3 text-outline" />
          </li>
        ))}
        <li aria-current="page" className="font-bold text-primary">
          {current}
        </li>
      </ol>
    </nav>
  );
}

const RECOMMENDED_SCHEMES_CRUMB: BreadcrumbLink = {
  label: 'Recommended Schemes',
  href: RECOMMENDED_SCHEMES_PATH,
};

function SchemeContextNav({ current }: { current: string }) {
  const searchParams = useSearchParams();
  const source = useRecommendationSource();
  // Opened from a recommended scheme (?scheme=) while recommendations exist:
  // back returns there. Opened from the header or footer: back goes Home.
  const fromRecommendations = Boolean(searchParams.get('scheme') && source);
  return (
    <PageNav current={current} parents={fromRecommendations ? [RECOMMENDED_SCHEMES_CRUMB] : []} />
  );
}

/** PageNav for tools a recommended scheme links into (partner locator, EMI calculator). */
export function SchemeToolPageNav({ current }: { current: string }) {
  return (
    <Suspense fallback={<PageNav current={current} />}>
      <SchemeContextNav current={current} />
    </Suspense>
  );
}

/** Recommended Schemes: back leads to whichever intake produced the matches. */
export function RecommendedSchemesPageNav() {
  const source = useRecommendationSource();
  const intake: BreadcrumbLink =
    source?.kind === 'wizard'
      ? { label: 'Find My Scheme Wizard', href: '/wizard' }
      : { label: 'Find My Scheme', href: '/find-scheme' };
  return <PageNav current="Recommended Schemes" parents={[intake]} />;
}

export { RECOMMENDED_SCHEMES_CRUMB };
