'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

function TrackingContent() {
  const searchParams = useSearchParams();
  const urlArn = searchParams.get('arn');
  const { applications, trackingQuery, setTrackingQuery } = useApp();

  const [customArn, setCustomArn] = useState<string | null>(null);
  const inputArn = customArn ?? urlArn ?? trackingQuery ?? 'ARN-2025-UP-8841';

  const activeRecord =
    applications.find(
      (a) => a.arn.toLowerCase() === inputArn.trim().toLowerCase()
    ) || applications[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputArn.trim()) {
      setTrackingQuery(inputArn.trim());
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">Application Tracking</span>
      </nav>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Track Search Card */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/50 shadow-civic">
          <span className="text-xs font-bold text-secondary uppercase">
            Live Civic Tracking Gateway
          </span>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-primary mt-1 mb-2">
            Track Concessional Loan Status
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mb-6">
            Enter your Application Reference Number (ARN) received via SMS to view live verification, branch reviews, and sanction milestones.
          </p>

          <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
            <div className="relative flex-grow">
              <Icon
                name="search"
                className="w-4 h-4 text-on-surface-variant absolute left-3 top-3"
              />
              <input
                type="text"
                value={inputArn}
                onChange={(e) => setCustomArn(e.target.value)}
                placeholder="Enter ARN (e.g. ARN-2025-UP-8841)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shrink-0"
            >
              Search Status
            </button>
          </form>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant pt-1">
            <span>Recent Applications:</span>
            {applications.slice(0, 3).map((app) => (
              <button
                key={app.arn}
                onClick={() => {
                  setCustomArn(app.arn);
                  setTrackingQuery(app.arn);
                }}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-secondary-container/30 text-primary font-mono font-semibold transition-colors text-[11px]"
              >
                {app.arn} ({app.applicant})
              </button>
            ))}
          </div>
        </div>

        {/* Application Status Card */}
        {activeRecord && (
          <>
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 shadow-civic">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-[11px] text-on-surface-variant uppercase font-bold">
                    Reference Number
                  </p>
                  <p className="text-base font-bold text-primary font-mono">
                    {activeRecord.arn}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Applicant: <strong>{activeRecord.applicant}</strong>
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-on-surface-variant uppercase font-bold">
                    Welfare Scheme
                  </p>
                  <p className="text-sm font-semibold text-on-surface">
                    {activeRecord.scheme}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Amount: <strong>{activeRecord.amount}</strong>
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-on-surface-variant uppercase font-bold">
                    Assisting Branch
                  </p>
                  <p className="text-xs text-on-surface max-w-[200px] truncate">
                    {activeRecord.bank}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                      activeRecord.status === 'Sanctioned' || activeRecord.status === 'Disbursed'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}
                  >
                    {activeRecord.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage-Wise Progression Timeline */}
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/50 shadow-civic space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
                <div>
                  <h3 className="text-base font-serif font-bold text-primary">
                    Stage-Wise Progression Timeline
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Updated live by Lead District Banking Network
                  </p>
                </div>

                <Link
                  href="/partner-desk"
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span>Simulate Bank Officer Updates</span>
                  <Icon name="open_in_new" className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-8 relative pl-7 border-l-2 border-primary/20 ml-2">
                {activeRecord.timeline.map((item, idx) => {
                  const isCurrent = activeRecord.stage === idx + 1;
                  const isDone = activeRecord.stage > idx + 1 || (idx === 3 && activeRecord.stage === 4);

                  return (
                    <div key={idx} className="relative">
                      {/* Circle Icon Indicator */}
                      <span
                        className={`absolute -left-[37px] top-0 w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-primary text-white'
                            : isCurrent
                            ? 'bg-secondary text-white ring-4 ring-secondary-container/40'
                            : 'bg-outline-variant/60 text-transparent'
                        }`}
                      >
                        {isDone ? (
                          <Icon name="check" className="w-3 h-3 text-white" />
                        ) : null}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-primary text-sm">
                            {idx + 1}. {item.title}
                          </h4>
                          <span className="text-[11px] font-medium text-secondary">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Remarks Box */}
              <div className="p-4 rounded-xl bg-secondary-container/20 border border-secondary-container space-y-1">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Icon name="info" className="w-4 h-4 text-secondary" />
                  <span>Desk Officer Live Remarks:</span>
                </p>
                <p className="text-xs text-on-surface pl-5">
                  {activeRecord.remarks}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-primary text-sm">Loading tracker...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
