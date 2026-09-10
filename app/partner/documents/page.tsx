'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function PartnerDocumentsPage() {
  const { showNotification } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Partner
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Documents</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Beneficiary Document Scrutiny Queue
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Verify scanned Aadhaar documents, certificate of vending, land passbooks, and bank cancelled cheques.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showNotification('Biometric scanner initialized for document scan.', 'info')}
          className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-xs"
        >
          Open Biometric Scanner
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4">
        <h2 className="text-base font-bold font-serif text-primary">
          Mandatory Verification Checkpoints
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 space-y-1">
            <h5 className="font-bold text-primary">Aadhaar e-KYC Station</h5>
            <p className="text-on-surface-variant text-[11px]">
              Fingerprint biometric verification directly cross-referenced via UIDAI portal.
            </p>
            <span className="text-[#086d46] font-bold block pt-1">● Station Online</span>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 space-y-1">
            <h5 className="font-bold text-primary">DigiLocker Verification</h5>
            <p className="text-on-surface-variant text-[11px]">
              Paperless fetch of educational marksheets, caste certificates, and IT returns.
            </p>
            <span className="text-[#086d46] font-bold block pt-1">● API Synced</span>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 space-y-1">
            <h5 className="font-bold text-primary">Jan Dhan DBT Passbook</h5>
            <p className="text-on-surface-variant text-[11px]">
              Direct Benefit Transfer subvention subsidy credited straight to beneficiary passbook.
            </p>
            <span className="text-[#086d46] font-bold block pt-1">● Active Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
