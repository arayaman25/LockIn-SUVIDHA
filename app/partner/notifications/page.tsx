'use client';

import React from 'react';
import Link from 'next/link';

export default function PartnerNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Partner
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Notifications</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Ministry Circulars &amp; Operational Alerts
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time advisories dispatched from the Central SUVIDHA Nodal Mission.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-1 text-xs">
          <div className="flex justify-between items-center text-on-surface-variant text-[11px]">
            <span className="font-bold text-primary">CIRCULAR #2025-08</span>
            <span>Today, 09:30 AM</span>
          </div>
          <h4 className="font-serif font-bold text-sm text-primary">
            PM Vishwakarma Tool-Kit E-Voucher Distribution Window
          </h4>
          <p className="text-on-surface-variant leading-relaxed">
            All accredited branch desks are instructed to assist registered artisans with e-voucher redemption through partner rural suppliers.
          </p>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-1 text-xs">
          <div className="flex justify-between items-center text-on-surface-variant text-[11px]">
            <span className="font-bold text-primary">ADVISORY #2025-04</span>
            <span>02 Feb 2025</span>
          </div>
          <h4 className="font-serif font-bold text-sm text-primary">
            CSIS Higher Education Moratorium Reconciliation
          </h4>
          <p className="text-on-surface-variant leading-relaxed">
            Quarterly interest subvention claim files must be validated and counter-signed by Lead District Nodal Officers by Friday.
          </p>
        </div>
      </div>
    </div>
  );
}
