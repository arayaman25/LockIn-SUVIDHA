'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function PartnerDeskPage() {
  const { applications, updateApplicationStatus, showNotification } = useApp();

  const handleApprove = (arn: string) => {
    updateApplicationStatus(
      arn,
      'Sanctioned',
      4,
      'Direct benefit interest subvention active. Loan sanctioned and credit guarantee invoked.'
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

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">Partner Bank Nodal Desk</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-secondary uppercase">
            Authorized Nodal Management Console
          </span>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-primary mt-1">
            Bank Nodal Desk Portal
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Authorized verification node: <strong>State Bank of India - Civil Lines (Branch 0124, Varanasi)</strong>
          </p>
        </div>

        <button
          onClick={() => showNotification('Database synchronized with National Welfare Nodal Grid.', 'success')}
          className="px-3.5 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-1.5 transition-colors"
        >
          <Icon name="sync" className="w-4 h-4" />
          <span>Sync Nodal Records</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 shadow-civic space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
          <h3 className="text-base font-serif font-bold text-primary">
            Pending Citizen Applications for Review
          </h3>
          <span className="text-xs text-on-surface-variant font-medium">
            {applications.length} Queue Items
          </span>
        </div>

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.arn}
              className="p-4 rounded-xl border border-outline-variant/50 bg-surface flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/40 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-sm">
                    {app.arn}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      app.status === 'Sanctioned' || app.status === 'Disbursed'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}
                  >
                    {app.status} (Stage {app.stage}/4)
                  </span>
                </div>

                <p className="text-xs font-medium text-on-surface">
                  {app.applicant} · {app.scheme} (<strong className="text-primary">{app.amount}</strong>)
                </p>

                <p className="text-[11px] text-on-surface-variant">
                  Aadhaar: {app.aadhaarMasked} · Date: {app.date} · Branch: {app.bank}
                </p>

                <p className="text-[11px] text-secondary font-medium pt-1">
                  Status Note: {app.remarks}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  href={`/tracking?arn=${app.arn}`}
                  className="px-3 py-1.5 border border-outline-variant text-primary rounded-lg text-xs font-bold hover:bg-surface-container"
                >
                  View Timeline
                </Link>

                {app.stage < 3 && (
                  <button
                    onClick={() => handleAdvanceToReview(app.arn)}
                    className="px-3 py-1.5 bg-surface-container border border-outline-variant text-on-surface rounded-lg text-xs font-bold hover:bg-secondary-container/40"
                  >
                    Mark Review Done (Stage 3)
                  </button>
                )}

                {app.stage !== 4 ? (
                  <button
                    onClick={() => handleApprove(app.arn)}
                    className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container shadow-xs"
                  >
                    Approve &amp; Sanction (Stage 4)
                  </button>
                ) : (
                  <span className="text-xs font-bold text-secondary flex items-center gap-1">
                    <Icon name="verified" className="w-3.5 h-3.5 text-secondary" />
                    <span>Sanctioned</span>
                  </span>
                )}

                <button
                  onClick={() => handleQuery(app.arn)}
                  className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-lg text-xs font-bold hover:bg-error-container/40 hover:text-error"
                >
                  Query / Request Docs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
