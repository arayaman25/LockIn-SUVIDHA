'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminAuditLogsPage() {
  return (
    <AdminSectionView
      category="Security"
      title="Immutable System Audit Ledger"
      description="Cryptographic trail of administrative decisions, subvention disbursements, and official credential sessions."
      icon="track_changes"
      actionLabel="Export Cryptographic Trail"
      stats={[
        { label: 'Total Logged Events', value: '1.84M Events', hint: 'SHA-256 block-hashed' },
        { label: 'Audit Integrity Score', value: '100% Tamper-Free', hint: 'Verified by central audit server' },
      ]}
      tableHeaders={['Timestamp', 'Actor / Official', 'Action Performed', 'IP & Terminal', 'Integrity Status']}
      tableRows={[
        ['09 Sep 2026 11:32 AM', 'admin@suvidha.demo (Administrator)', 'Modified subvention allocation on CSIS Scheme', '10.24.180.12 (GovNet)', <span key="1" className="text-[#086d46] font-bold">Verified Hash ✓</span>],
        ['09 Sep 2026 10:14 AM', 'partner@suvidha.demo (Channel Partner)', 'Sanctioned loan for ARN-2025-UP-8841', '14.139.24.8 (SBI Nodal Desk)', <span key="2" className="text-[#086d46] font-bold">Verified Hash ✓</span>],
        ['09 Sep 2026 09:05 AM', 'System Daemon (Scheduler)', 'Reconciled DBT subventions with RBI e-Kuber', '127.0.0.1 (Internal Service)', <span key="3" className="text-[#086d46] font-bold">Verified Hash ✓</span>],
      ]}
    />
  );
}
