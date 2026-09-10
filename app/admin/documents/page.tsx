'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminDocumentsPage() {
  return (
    <AdminSectionView
      category="Compliance"
      title="Central Document Repository &amp; OCR Engine"
      description="Aadhaar vault encryption, DigiLocker API integration, and automated document tampering detection."
      icon="folder"
      actionLabel="Audit Document Vault"
      stats={[
        { label: 'DigiLocker Verified Docs', value: '48,290 Docs', hint: '100% paperless verification' },
        { label: 'OCR Accuracy Rate', value: '99.2%', hint: 'Tesseract & Vision neural models' },
        { label: 'Pending OCR Queue', value: '18 Items', hint: 'Auto-processing in background' },
      ]}
      tableHeaders={['Document Category', 'Verification Mechanism', 'Encryption Level', 'Status']}
      tableRows={[
        ['Aadhaar Card (e-KYC)', 'UIDAI Central Gateway + Masked Vault', 'AES-256 GCM', <span key="1" className="text-[#086d46] font-bold">Active Integrated</span>],
        ['Income Revenue Certificate', 'State Revenue Board Tehsildar API', 'TLS 1.3 / SHA-384', <span key="2" className="text-[#086d46] font-bold">Active Integrated</span>],
        ['Trade Vending License', 'Urban Local Body Municipal API', 'TLS 1.3 / SHA-384', <span key="3" className="text-[#086d46] font-bold">Active Integrated</span>],
        ['Caste SC/ST Certificate', 'Ministry of Social Justice Portal', 'TLS 1.3 / SHA-384', <span key="4" className="text-[#086d46] font-bold">Active Integrated</span>],
      ]}
    />
  );
}
