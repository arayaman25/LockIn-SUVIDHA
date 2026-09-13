'use client';

import Link from 'next/link';
import Icon from '@/components/Icon';
import RecommendedSchemeCard from '@/components/recommendations/RecommendedSchemeCard';
import RecommendationStatePanel from '@/components/recommendations/RecommendationStatePanel';
import { useRecommendedSchemes } from '@/components/recommendations/useRecommendedSchemes';

export default function RecommendedSchemesPage() {
  const recommendations = useRecommendedSchemes();

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-8">
      <nav className="mb-8 flex items-center gap-2 border-b border-outline-variant/40 pb-2 text-xs text-on-surface-variant" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <Icon name="home" className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">Recommended Schemes</span>
      </nav>

      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#276448]">SUVIDHA scheme assistance</p>
        <h1 className="mt-2 text-3xl font-serif font-bold text-[#00472f] sm:text-4xl">Schemes Recommended for You</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">Here are the schemes SUVIDHA found suitable for your needs.</p>
      </header>

      {recommendations.status === 'ready' ? (
        <section className="space-y-4" aria-label="Recommended schemes">
          {recommendations.overallSummary && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <Icon name="info" size={18} className="mt-0.5 shrink-0 text-[#276448]" />
              <p className="max-w-3xl text-sm leading-relaxed text-stone-700">{recommendations.overallSummary}</p>
            </div>
          )}
          {recommendations.schemes.map((scheme) => (
            <RecommendedSchemeCard key={scheme.schemeId} scheme={scheme} />
          ))}
        </section>
      ) : (
        <RecommendationStatePanel state={recommendations} />
      )}
    </div>
  );
}
