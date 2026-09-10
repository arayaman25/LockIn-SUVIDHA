'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function PartnerApplicantsPage() {
  const { applications } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Partner
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Applicants</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Citizen Applicant Directory
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Registered beneficiaries assigned to this branch for assisted counseling and loan processing.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant font-bold">
                <th className="py-3 px-4">Applicant Full Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Aadhaar (UIDAI Masked)</th>
                <th className="py-3 px-4">Active Scheme</th>
                <th className="py-3 px-4">Biometric Status</th>
                <th className="py-3 px-4 text-right">Associated ARN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {applications.map((app) => (
                <tr key={app.arn} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-bold text-primary">{app.applicant}</td>
                  <td className="py-3.5 px-4">{app.phone}</td>
                  <td className="py-3.5 px-4 font-mono">{app.aadhaarMasked}</td>
                  <td className="py-3.5 px-4 font-medium">{app.scheme}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#086d46]">
                      <span className="w-2 h-2 rounded-full bg-[#086d46]" />
                      Verified e-Sign
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-secondary">
                    {app.arn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
