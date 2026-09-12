import Link from 'next/link';
import Icon from '@/components/Icon';
import { MOCK_RECOMMENDED_SCHEMES } from '@/src/lib/mock-recommended-schemes';

export function generateStaticParams() {
  return MOCK_RECOMMENDED_SCHEMES.map((scheme) => ({ schemeId: scheme.id }));
}

export default async function SimpleExplanationPage({
  params,
}: {
  params: Promise<{ schemeId: string }>;
}) {
  const { schemeId } = await params;
  const scheme = MOCK_RECOMMENDED_SCHEMES.find((item) => item.id === schemeId);

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 md:px-8">
      <nav className="mb-8 flex items-center gap-2 border-b border-outline-variant/40 pb-2 text-xs text-on-surface-variant" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <Icon name="home" className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/recommended-schemes" className="hover:text-primary">Recommended Schemes</Link>
        <span>/</span>
        <span className="font-bold text-primary">Simple Explanation</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#00472f] sm:text-4xl">Understand This Scheme</h1>
        <p className="mt-2 text-sm text-stone-600">Here&apos;s a simple explanation of the scheme, without complicated government terms.</p>
      </header>

      {!scheme ? (
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <Icon name="info" size={20} className="mt-0.5 shrink-0 text-[#276448]" />
            <p className="text-sm leading-relaxed text-stone-700">Scheme information could not be found.</p>
          </div>
          <div className="mt-8 border-t border-stone-100 pt-5">
            <Link href="/recommended-schemes" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white hover:bg-[#003824]">
              <Icon name="arrow_back" size={14} />
              <span>Back to Recommended Schemes</span>
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#276448]">Simple explanation</p>
          <h2 className="mt-3 text-2xl font-serif font-bold text-[#00472f]">{scheme.name}</h2>
          <div className="my-7 border-t border-stone-200" />
          <div className="max-w-3xl space-y-4 text-sm leading-7 text-stone-700">
            <p>{scheme.simpleExplanation}</p>
            <p>{scheme.summary}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/recommended-schemes" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#00472f] px-4 text-xs font-semibold text-[#00472f] hover:bg-emerald-50">
              <Icon name="arrow_back" size={14} />
              <span>Back to Recommended Schemes</span>
            </Link>
            <Link href={`/locator?scheme=${encodeURIComponent(scheme.partnerSchemeCode)}`} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white hover:bg-[#003824]">
              <span>Find Nearest Channel Partner</span>
              <Icon name="arrow_forward" size={14} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
