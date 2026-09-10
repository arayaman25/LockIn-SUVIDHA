'use client';

import React from 'react';
import Link from 'next/link';
import { SUVIDHA_SCHEMES, SUVIDHA_PARTNERS } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function AdminDashboardPage() {
  const { applications, showNotification } = useApp();

  const totalSanctioned = applications.filter(
    (a) => a.status === 'Sanctioned' || a.status === 'Disbursed'
  ).length;

  const totalPending = applications.filter(
    (a) => a.status === 'Under Verification' || a.status === 'Bank Review'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Executive Mission Console
          </span>
          <h1 className="text-2xl font-serif font-bold text-primary mt-0.5">
            National Administration Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time monitoring of concessional welfare credit, interest subvention outlays, and authorized channel partner compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/schemes"
            className="px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-xs"
          >
            Manage Schemes
          </Link>
          <Link
            href="/admin/partners"
            className="px-3.5 py-2 border border-outline-variant bg-surface-container-lowest rounded-xl text-xs font-bold text-primary hover:bg-surface transition-colors shadow-xs"
          >
            Channel Partners ({SUVIDHA_PARTNERS.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Central Outlay Sanctioned</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
              <Icon name="calculate" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">₹24,850 Cr</div>
          <div className="text-[11px] text-[#086d46] font-semibold flex items-center gap-1">
            <span>↑ 14.8%</span>
            <span className="text-on-surface-variant font-normal">from previous fiscal quarter</span>
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Active National Schemes</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Icon name="account_balance" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">{SUVIDHA_SCHEMES.length} Active</div>
          <div className="text-[11px] text-secondary font-semibold">
            Across 5 Union Ministries
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Authorized Partner Desks</span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <Icon name="pin_drop" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">{SUVIDHA_PARTNERS.length} Nodal Desks</div>
          <div className="text-[11px] text-[#086d46] font-semibold">
            100% Biometric &amp; Aadhaar e-Sign Compliant
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Applications in Scrutiny</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <Icon name="checklist" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-primary">{applications.length} Logged</div>
          <div className="text-[11px] text-secondary font-semibold">
            {totalPending} in Review · {totalSanctioned} Sanctioned
          </div>
        </div>
      </div>

      {/* Schemes Governance Overview */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold font-serif text-primary">
              National Scheme Portfolio &amp; Subventions
            </h2>
            <p className="text-xs text-on-surface-variant">
              Operational criteria, maximum sanction caps, and active interest subvention allocations.
            </p>
          </div>
          <Link
            href="/admin/schemes"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Schemes</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/40 text-on-surface-variant font-bold">
                <th className="pb-3 pr-4">Scheme Name</th>
                <th className="pb-3 px-4">Focus Category</th>
                <th className="pb-3 px-4">Nodal Ministry</th>
                <th className="pb-3 px-4">Max Loan Cap</th>
                <th className="pb-3 px-4">Subvention Rate</th>
                <th className="pb-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {SUVIDHA_SCHEMES.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">
                    <Link href={`/schemes/${scheme.id}`} className="hover:underline">
                      {scheme.name}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                      {scheme.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant truncate max-w-[220px]">
                    {scheme.ministry}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    ₹{scheme.maxAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-secondary font-bold">
                    {scheme.interest}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#086d46]">
                      <span className="w-2 h-2 rounded-full bg-[#086d46]" />
                      Active Direct
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Recent Applications Pipeline & System Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Applications Queue */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold font-serif text-primary">
              National Applications Pipeline
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-primary hover:underline"
            >
              Manage Pipeline →
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.arn}
                className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface flex justify-between items-center gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">{app.arn}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Sanctioned'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : app.status === 'Action Needed'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="font-medium text-on-surface mt-0.5">{app.scheme}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Applicant: {app.applicant} · {app.bank}
                  </p>
                </div>
                <span className="font-bold text-primary font-serif shrink-0">
                  {app.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Nodal Audit Feed */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold font-serif text-primary">
              Nodal Audit Logs
            </h2>
            <button
              type="button"
              onClick={() => showNotification('Audit logs refreshed from central ledger.', 'info')}
              className="text-xs font-bold text-secondary hover:text-primary"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 space-y-1">
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span className="font-bold text-primary">Subvention Ledger Check</span>
                <span>Today, 10:45 AM</span>
              </div>
              <p className="text-on-surface">
                Automated Direct Benefit Transfer reconciled for 1,420 PM SVANidhi accounts.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 space-y-1">
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span className="font-bold text-primary">Partner Node Audit</span>
                <span>Today, 09:12 AM</span>
              </div>
              <p className="text-on-surface">
                State Bank of India - Civil Lines completed daily biometric scanner calibration.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 space-y-1">
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span className="font-bold text-primary">Security Perimeter</span>
                <span>Yesterday, 11:30 PM</span>
              </div>
              <p className="text-on-surface">
                Zero security anomalies reported across national API gateways.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
