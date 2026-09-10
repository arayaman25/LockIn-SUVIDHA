'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminAnalyticsPage() {
  return (
    <AdminSectionView
      category="Intelligence"
      title="National Welfare Credit Analytics &amp; Demographics"
      description="Aggregated economic impact reports, gender parity indices, and regional disbursal density maps."
      icon="calculate"
      actionLabel="Download Economic Survey"
      stats={[
        { label: 'Women Enterprise Share', value: '44.2%', hint: 'Target exceeded for FY 2024-25' },
        { label: 'Rural / Semi-Urban Share', value: '61.8%', hint: 'Reaching grassroots beneficiaries' },
        { label: 'Avg Interest Saved / Unit', value: '₹14,200', hint: 'Direct benefit through subventions' },
      ]}
      tableHeaders={['Beneficiary Sector', 'Loan Tranches Disbursed', 'Total Sanctioned Value', 'Subvention Incurred']}
      tableRows={[
        ['Urban Micro-Enterprises & Vendors', '42,100 Loans', '₹184.20 Crore', '₹12.89 Crore (7% Subsidy)'],
        ['Higher & Technical Education (CSIS)', '14,800 Loans', '₹420.50 Crore', '₹42.05 Crore (100% Moratorium)'],
        ['Traditional Artisans & Weavers', '28,400 Loans', '₹210.00 Crore', '₹16.80 Crore (8% Subvention)'],
      ]}
    />
  );
}
