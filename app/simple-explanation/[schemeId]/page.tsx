'use client';

import { use } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import RecommendationStatePanel from '@/components/recommendations/RecommendationStatePanel';
import { useRecommendedSchemes } from '@/components/recommendations/useRecommendedSchemes';
import {
  partnerLocatorHref,
  type RecommendedScheme,
} from '@/components/recommendations/recommended-schemes';

const RECOMMENDED_SCHEMES_HREF = '/recommended-schemes';

function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-serif font-bold text-[#00472f]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Icon name="check_circle" size={16} className="mt-1 shrink-0 text-[#276448]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SchemeNotFound() {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <Icon name="info" size={20} className="mt-0.5 shrink-0 text-[#276448]" />
        <p className="text-sm leading-relaxed text-stone-700">Scheme information could not be found.</p>
      </div>
      <div className="mt-8 border-t border-stone-100 pt-5">
        <Link href={RECOMMENDED_SCHEMES_HREF} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white hover:bg-[#003824]">
          <span>Back to Recommended Schemes</span>
        </Link>
      </div>
    </section>
  );
}

function SchemeExplanation({ scheme }: { scheme: RecommendedScheme }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#276448]">Simple explanation</p>
      <h2 className="mt-3 text-2xl font-serif font-bold text-[#00472f]">{scheme.schemeName}</h2>
      <div className="my-7 border-t border-stone-200" />
      <div className="max-w-3xl space-y-6 text-sm leading-7 text-stone-700">
        <div className="space-y-4">
          <p>{scheme.headline}</p>
          {scheme.whyItFits && <p>{scheme.whyItFits}</p>}
        </div>
        <BulletList title="Key terms" items={scheme.keyTerms} />
        <BulletList title="What to do next" items={scheme.nextSteps} />
      </div>
      <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href={RECOMMENDED_SCHEMES_HREF} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#00472f] px-4 text-xs font-semibold text-[#00472f] hover:bg-emerald-50">
          <span>Back to Recommended Schemes</span>
        </Link>
        <Link href={partnerLocatorHref(scheme)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white hover:bg-[#003824]">
          <span>Find Nearest Channel Partner</span>
          <Icon name="arrow_forward" size={14} />
        </Link>
      </div>
    </section>
  );
}

export default function SimpleExplanationPage({
  params,
}: {
  params: Promise<{ schemeId: string }>;
}) {
  const { schemeId } = use(params);
  const recommendations = useRecommendedSchemes();

  const renderContent = () => {
    if (recommendations.status !== 'ready') {
      return <RecommendationStatePanel state={recommendations} />;
    }
    const scheme = recommendations.schemes.find((item) => item.schemeId === schemeId);
    return scheme ? <SchemeExplanation scheme={scheme} /> : <SchemeNotFound />;
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 md:px-8">
      <nav className="mb-8 flex items-center gap-2 border-b border-outline-variant/40 pb-2 text-xs text-on-surface-variant" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <Icon name="home" className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href={RECOMMENDED_SCHEMES_HREF} className="hover:text-primary">Recommended Schemes</Link>
        <span>/</span>
        <span className="font-bold text-primary">Simple Explanation</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#00472f] sm:text-4xl">Understand This Scheme</h1>
        <p className="mt-2 text-sm text-stone-600">Here&apos;s a simple explanation of the scheme, without complicated government terms.</p>
      </header>

      {renderContent()}
    </div>
  );
}
