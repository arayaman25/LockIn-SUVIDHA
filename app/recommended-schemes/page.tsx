import Link from 'next/link';
import Icon from '@/components/Icon';
import RecommendedSchemeCard from '@/components/recommendations/RecommendedSchemeCard';
import { MOCK_RECOMMENDED_SCHEMES } from '@/src/lib/mock-recommended-schemes';

export default function RecommendedSchemesPage() {
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
        <p className="mt-3 text-xs text-stone-500">These are temporary frontend recommendations while personalized matching is being connected.</p>
      </header>

      <main className="space-y-4">
        {MOCK_RECOMMENDED_SCHEMES.map((scheme) => (
          <RecommendedSchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </main>
    </div>
  );
}
