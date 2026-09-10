'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function PartnerDashboardPage() {
  const { applications, authUser } = useApp();

  const pendingReview = applications.filter(
    (a) => a.status === 'Under Verification' || a.status === 'Bank Review'
  );

  const sanctioned = applications.filter(
    (a) => a.status === 'Sanctioned' || a.status === 'Disbursed'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Branch Operations Desk
          </span>
          <h1 className="text-2xl font-serif font-bold text-primary mt-0.5">
            Channel Partner Nodal Console
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Active Desk: <strong>{authUser?.organization || 'State Bank of India - Civil Lines (Branch 0124)'}</strong> · Lead Officer: <strong>{authUser?.name}</strong>
          </p>
        </div>

        <Link
          href="/partner/applications"
          className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-xs"
        >
          Review Application Queue ({pendingReview.length})
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Branch Allocated Cases</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Icon name="description" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">{applications.length} Total</div>
          <div className="text-[11px] text-secondary font-semibold">
            {pendingReview.length} Pending Appraisal
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Direct Sanctions</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
              <Icon name="verified" className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">{sanctioned.length} Sanctioned</div>
          <div className="text-[11px] text-[#086d46] font-semibold">
            0% Intermediary Fee Compliant
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Biometric E-Signs Today</span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <Icon name="fingerprint" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">12 Completed</div>
          <div className="text-[11px] text-secondary font-semibold">
            UIDAI Aadhaar terminal verified
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Today&apos;s Assisted Visits</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <Icon name="event_available" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">4 Appointments</div>
          <div className="text-[11px] text-secondary font-semibold">
            Morning slots 10:30 AM – 1:00 PM
          </div>
        </div>
      </div>

      {/* Two Column Layout: Daily Applications Queue & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Application Queue */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold font-serif text-primary">
                Active Scrutiny Queue
              </h2>
              <p className="text-xs text-on-surface-variant">
                Direct actions for credit officers: Approve, Request Query, or Advance to Review.
              </p>
            </div>
            <Link
              href="/partner/applications"
              className="text-xs font-bold text-secondary hover:underline"
            >
              Full Queue →
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.arn}
                className="p-4 rounded-xl border border-outline-variant/40 bg-surface space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-primary">{app.arn}</span>
                    <h4 className="font-bold text-sm text-on-surface mt-0.5">{app.scheme}</h4>
                    <p className="text-on-surface-variant text-[11px]">
                      Applicant: <strong>{app.applicant}</strong> ({app.phone}) · Aadhaar: {app.aadhaarMasked}
                    </p>
                  </div>
                  <span className="font-serif font-bold text-primary text-base">
                    {app.amount}
                  </span>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[11px]">
                  <span className="text-secondary font-medium">Stage {app.stage} of 4: {app.status}</span>
                  <Link
                    href="/partner/applications"
                    className="text-primary font-bold hover:underline"
                  >
                    Open Case File →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Desk Operating Guidelines */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4">
          <h2 className="text-base font-bold font-serif text-primary">
            Nodal Desk Protocols
          </h2>

          <div className="space-y-3 text-xs text-on-surface-variant">
            <div className="p-3.5 rounded-xl bg-secondary-container/20 border border-secondary-container/40 space-y-1">
              <h5 className="font-bold text-primary">Zero Intermediary Assurance</h5>
              <p className="text-[11px]">
                Under Ministry guidelines, all civic desk assistance, document scanning, and counseling are 100% free of charge.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 space-y-1">
              <h5 className="font-bold text-primary">Assistance Hours</h5>
              <p className="text-[11px]">
                Monday through Saturday, 10:00 AM – 5:00 PM. Dedicated public welfare quota hour: 10:30 AM – 11:30 AM.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 space-y-1">
              <h5 className="font-bold text-primary">Escalations &amp; Central Ledger</h5>
              <p className="text-[11px]">
                For inter-bank inquiries or subvention reconciliation queries, reach the Central Nodal Mission via the Admin Console.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
