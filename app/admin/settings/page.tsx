'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminSettingsPage() {
  return (
    <AdminSectionView
      category="Configuration"
      title="System Architecture &amp; Security Policy Settings"
      description="Configure session expiration timeouts, dual-officer signoff thresholds, and gateway routing endpoints."
      icon="tune"
      actionLabel="Save Configuration"
      stats={[
        { label: 'Session Timeout', value: '30 Minutes', hint: 'Auto-lock on inactive official terminals' },
        { label: 'Dual Sign-Off Floor', value: '₹5,00,000', hint: 'Requires Lead Officer counter-signature' },
        { label: 'PFMS Subvention Sync', value: 'Every 15 Mins', hint: 'Direct Benefit Transfer ledger' },
      ]}
      tableHeaders={['System Parameter', 'Current Setting', 'Recommended Best Practice', 'Status']}
      tableRows={[
        ['Aadhaar e-KYC Masking', 'Strict Last 4 Digits Only (UIDAI Circular)', 'Zero plain-text storage', <span key="1" className="text-[#086d46] font-bold">Enforced ✓</span>],
        ['Zero Intermediary Token Check', 'Active (Real-time Audit Trace)', 'Blocks unofficial agency referral fees', <span key="2" className="text-[#086d46] font-bold">Enforced ✓</span>],
        ['Multi-Factor Authentication', 'SMS OTP + Hardware Token for Disbursals', 'Required for amounts > ₹1 Lakh', <span key="3" className="text-[#086d46] font-bold">Enforced ✓</span>],
      ]}
    />
  );
}
