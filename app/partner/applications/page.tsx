'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function PartnerApplicationsPage() {
  const { applications, updateApplicationStatus, showNotification } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (arn: string) => {
    updateApplicationStatus(
      arn,
      'Sanctioned',
      4,
      'Direct benefit interest subvention active. Loan sanctioned and credit guarantee invoked by branch credit officer.'
    );
  };

  const handleQuery = (arn: string) => {
    updateApplicationStatus(
      arn,
      'Action Needed',
      2,
      'Additional verification requested: Please verify active Aadhaar-linked Jan Dhan bank passbook.'
    );
  };

  const handleAdvanceToReview = (arn: string) => {
    updateApplicationStatus(
      arn,
      'Bank Review',
      3,
      'Field inspection completed. Credit appraisal and interest subvention allocation under review.'
    );
  };

  const filtered = applications.filter((app) => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch =
      app.arn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scheme.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Partner
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Applications</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Application Verification &amp; Sanction Scrutiny
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Evaluate civic applications, verify Aadhaar e-KYC credentials, and issue concessional credit sanctions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showNotification('Daily Branch Verification Ledger synced.', 'success')}
          className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-xs"
        >
          Sync Branch Registry
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Applications' },
            { id: 'Under Verification', label: 'Under Verification' },
            { id: 'Bank Review', label: 'Bank Review' },
            { id: 'Sanctioned', label: 'Sanctioned' },
            { id: 'Action Needed', label: 'Action Needed' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setSelectedStatus(btn.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedStatus === btn.id
                  ? 'bg-secondary text-white shadow-xs'
                  : 'bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-secondary-container/30'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Icon name="search" className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ARN, citizen name, scheme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Applications Cards / List */}
      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.arn}
            className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-outline-variant/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-sm">{app.arn}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      app.status === 'Sanctioned'
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : app.status === 'Action Needed'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-on-surface-variant">Applied on {app.date}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-primary mt-1">
                  {app.scheme}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold">
                  Requested Sanction
                </span>
                <span className="text-xl font-serif font-bold text-primary">{app.amount}</span>
              </div>
            </div>

            {/* Applicant Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-surface p-3.5 rounded-xl border border-outline-variant/30">
              <div>
                <span className="text-on-surface-variant block text-[11px]">Beneficiary Name</span>
                <strong className="text-primary">{app.applicant}</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Contact Number</span>
                <strong className="text-on-surface">{app.phone}</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Aadhaar (UIDAI Masked)</span>
                <span className="font-mono text-on-surface font-semibold">{app.aadhaarMasked}</span>
              </div>
            </div>

            {/* Officer Remarks */}
            <div className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xl">
              <strong>Scrutiny Status:</strong> {app.remarks}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
              <span className="text-xs text-secondary font-medium">
                Stage {app.stage} of 4 in Nodal Pipeline
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {app.status !== 'Sanctioned' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleQuery(app.arn)}
                      className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-bold text-secondary hover:text-primary hover:bg-surface transition-colors"
                    >
                      Request Query
                    </button>
                    {app.stage < 3 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceToReview(app.arn)}
                        className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-secondary/90 transition-colors"
                      >
                        Advance to Review
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleApprove(app.arn)}
                      className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-2xs"
                    >
                      Approve &amp; Sanction Loan
                    </button>
                  </>
                )}
                {app.status === 'Sanctioned' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#086d46] bg-primary-fixed/40 px-3 py-1.5 rounded-lg">
                    <span>✓ Sanction Letter Issued via DBT</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
