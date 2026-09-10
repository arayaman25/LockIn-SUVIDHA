'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminBeneficiariesPage() {
  return (
    <AdminSectionView
      category="Citizens"
      title="National Beneficiary Registry &amp; DBT Ledger"
      description="Central registry of empowered citizens, tracking total interest subvention credits received and DBT bank accounts."
      icon="group"
      actionLabel="Export Registry"
      stats={[
        { label: 'Registered Citizens', value: '1.24 Lakh', hint: 'Verified via Aadhaar OTP' },
        { label: 'DBT Enabled Accounts', value: '100%', hint: 'Direct PFMS ledger integration' },
        { label: 'Zero Default Records', value: '96.2%', hint: 'Timely repayment incentives' },
      ]}
      tableHeaders={['Beneficiary Name', 'Contact & Aadhaar', 'Active Concessional Scheme', 'Disbursed Capital', 'Subvention Paid']}
      tableRows={[
        ['Sunita Devi', '+91 9876543210 (XXXX-4812)', 'PM SVANidhi (Street Vendor Loan)', '₹50,000', <span key="1" className="text-[#086d46] font-bold">₹3,500 DBT Credited</span>],
        ['Ramesh Chandra Patel', '+91 9415201122 (XXXX-9901)', 'PM Vishwakarma Scheme', '₹1,00,000', <span key="2" className="text-[#086d46] font-bold">₹8,000 DBT Credited</span>],
        ['Ananya Deshmukh', '+91 9822019988 (XXXX-1234)', 'Central Sector Interest Subsidy (CSIS)', '₹7,50,000', <span key="3" className="text-[#086d46] font-bold">₹67,500 100% Subsidized</span>],
      ]}
    />
  );
}
