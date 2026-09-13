import Link from 'next/link';
import Icon from '@/components/Icon';
import RecommendedBadge from '@/components/RecommendedBadge';
import {
  emiCalculatorHref,
  partnerLocatorHref,
  simpleExplanationHref,
  type RecommendedScheme,
} from './recommended-schemes';

interface RecommendedSchemeCardProps {
  scheme: RecommendedScheme;
  /** The best match: schemes arrive in the backend's ranking order, so this is the first card. */
  isTopMatch?: boolean;
  totalSchemes?: number;
}

export default function RecommendedSchemeCard({
  scheme,
  isTopMatch = false,
  totalSchemes,
}: RecommendedSchemeCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${
        isTopMatch ? 'border-[#00472f] ring-1 ring-[#00472f]/25' : 'border-stone-200'
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          {isTopMatch && (
            <div className="mb-2">
              <RecommendedBadge
                ariaLabel={
                  totalSchemes ? `Recommended, best match of ${totalSchemes} schemes` : 'Recommended, best match'
                }
              />
            </div>
          )}
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#276448]">About this scheme</p>
          <h2 className="mt-2 text-xl font-serif font-bold text-[#00472f]">{scheme.schemeName}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">{scheme.description}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:w-[330px] lg:flex-col">
          <Link
            href={emiCalculatorHref(scheme)}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#00472f] px-4 text-xs font-semibold text-[#00472f] transition-colors hover:bg-emerald-50"
          >
            <Icon name="calculate" size={14} />
            <span>Calculate EMI</span>
          </Link>
          <Link
            href={simpleExplanationHref(scheme)}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 text-xs font-semibold text-stone-700 transition-colors hover:border-[#00472f] hover:text-[#00472f]"
          >
            <span>Explain This Simply</span>
            <Icon name="arrow_forward" size={14} />
          </Link>
          <Link
            href={partnerLocatorHref(scheme)}
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
