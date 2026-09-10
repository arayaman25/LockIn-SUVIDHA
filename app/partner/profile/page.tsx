'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function PartnerProfilePage() {
  const { authUser } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Partner
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Profile</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Channel Partner Accreditation Profile
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Verified nodal officer credentials, branch identification, and terminal authority.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-4 pb-4 border-b border-outline-variant/30">
          <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xl font-serif">
            {authUser?.name?.slice(0, 2).toUpperCase() || 'CP'}
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-primary">{authUser?.name}</h3>
            <p className="text-xs text-secondary font-medium">Designated Lead District Nodal Officer</p>
            <p className="text-[11px] text-on-surface-variant">{authUser?.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-outline-variant/30">
            <span>Official Partner Organization:</span>
            <strong className="text-primary">{authUser?.organization}</strong>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/30">
            <span>Branch Identification Code:</span>
            <span className="font-mono text-on-surface font-bold">SBI-VNS-0124</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/30">
            <span>Direct Nodal Helpline:</span>
            <span className="font-medium text-on-surface">{authUser?.phone}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Accreditation Term:</span>
            <span className="font-bold text-[#086d46]">Active Valid until March 2028 (Govt. of India)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
