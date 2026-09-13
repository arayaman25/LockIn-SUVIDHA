import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SUVIDHA_SCHEMES } from '@/lib/data';
import Icon from '@/components/Icon';
import BackToPreferredSchemes from '@/components/BackToPreferredSchemes';

export function generateStaticParams() {
  return SUVIDHA_SCHEMES.map((scheme) => ({
    id: scheme.id,
  }));
}

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scheme = SUVIDHA_SCHEMES.find((s) => s.id === id);

  if (!scheme) {
    notFound();
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/schemes" className="hover:text-primary">
          Schemes
        </Link>
        <span>/</span>
        <span className="font-bold text-primary truncate max-w-xs">{scheme.name}</span>
      </nav>

      <Suspense fallback={null}>
        <BackToPreferredSchemes currentSchemeTitle={scheme.name} />
      </Suspense>

      {/* Main Header Container */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/50 shadow-civic mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-outline-variant/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container uppercase">
                {scheme.categoryLabel}
              </span>
              <span className="text-xs font-semibold text-secondary">
                {scheme.interest}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-2">
              {scheme.name}
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
              <Icon name="account_balance" className="w-4 h-4 text-secondary" />
              <span>Nodal Authority: {scheme.ministry}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/calculator?scheme=${scheme.id}`}
              className="px-4 py-2 border-2 border-primary text-primary rounded-xl font-bold text-xs hover:bg-secondary-container/20 flex items-center gap-1.5 transition-all"
            >
              <Icon name="calculate" className="w-4 h-4" />
              <span>Calculate EMI</span>
            </Link>
            {/* Commented out internal /apply UI redirection:
            <Link
              href={`/apply?scheme=${scheme.id}`}
              className="px-5 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Icon name="edit_document" className="w-4 h-4" />
              <span>Apply For Scheme</span>
            </Link>
            */}
            <a
              href="https://pmsuraj.dosje.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Icon name="open_in_new" className="w-4 h-4" />
              <span>Apply For Scheme</span>
            </a>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-outline-variant/40">
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/40 space-y-1">
            <p className="text-xs text-secondary font-bold uppercase">
              Maximum Assistance Limit
            </p>
            <p className="text-2xl font-bold text-primary font-serif">
              ₹{scheme.maxAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-on-surface-variant pt-1">
              100% Collateral-Free under Credit Guarantee
            </p>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/40 space-y-1">
            <p className="text-xs text-secondary font-bold uppercase">
              Subvention &amp; Subsidy Rate
            </p>
            <p className="text-2xl font-bold text-secondary font-serif">
              {scheme.subvention}% Relief
            </p>
            <p className="text-xs text-on-surface-variant pt-1">
              Credited directly to applicant bank account via DBT
            </p>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/40 space-y-1">
            <p className="text-xs text-secondary font-bold uppercase">
              Moratorium Allowance
            </p>
            <p className="text-2xl font-bold text-primary font-serif">
              {scheme.moratorium > 0 ? `${scheme.moratorium} Months` : 'Immediate'}
            </p>
            <p className="text-xs text-on-surface-variant pt-1">
              {scheme.moratorium > 0
                ? 'Principal repayment commences after relaxation window'
                : 'Standard prompt repayment schedule'}
            </p>
          </div>
        </div>

        {/* Scheme Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left Column (8 cols): Overview, Eligibility, Features */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-primary mb-2">
                Detailed Overview &amp; Objective
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {scheme.desc}
              </p>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mt-2">
                Under this government intervention, applicants enjoy transparent scrutiny directly through participating Public Sector Banks, Regional Rural Gramin Banks, and accredited CSC networks with zero intermediary charges.
              </p>
            </div>

            <div>
              <h3 className="text-base font-serif font-bold text-primary mb-3">
                Key Benefits &amp; Features
              </h3>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                {scheme.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon name="check_circle" className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-serif font-bold text-primary mb-3">
                Pre-Qualification &amp; Eligibility Criteria
              </h3>
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-b border-outline-variant/30 pb-3">
                  <div>
                    <span className="text-on-surface-variant font-medium">Minimum Age:</span>
                    <strong className="text-primary ml-1">{scheme.eligibility.minAge} Years</strong>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-medium">Annual Income Ceiling:</span>
                    <strong className="text-primary ml-1">
                      Up to ₹{scheme.eligibility.maxIncome.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-on-surface-variant">
                  {scheme.eligibility.criteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon name="task_alt" className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Required Documents & Action Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 space-y-4">
              <h4 className="font-bold text-primary text-sm flex items-center gap-2 font-serif">
                <Icon name="folder_open" className="w-4 h-4 text-secondary" />
                <span>Required Documents</span>
              </h4>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                {scheme.requiredDocs.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon name="description" className="w-4 h-4 text-outline shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-on-surface-variant border-t border-outline-variant/30">
                Self-attested photocopies or digital uploads are verified through automated OCR.
              </div>
            </div>

            <div className="bg-primary text-white p-6 rounded-2xl shadow-civic space-y-4">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                Fast Track Gateway
              </span>
              <h4 className="font-serif text-lg font-bold leading-snug text-white">
                Ready to submit your application?
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Fill the 3-step digital application in under 5 minutes with zero paperwork fees.
              </p>
              <Link
                href={`/apply?scheme=${scheme.id}`}
                className="w-full py-2.5 bg-white text-primary rounded-xl font-bold text-center block hover:bg-surface transition-colors text-xs shadow-sm"
              >
                Apply Online (ARN)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
