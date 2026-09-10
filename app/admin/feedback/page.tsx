'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminFeedbackPage() {
  return (
    <AdminSectionView
      category="Citizen Experience"
      title="Citizen Grievances &amp; Feedback Sentiment"
      description="Monitor public satisfaction ratings, assisted desk service reviews, and grievance resolution times."
      icon="rate_review"
      actionLabel="Export Grievance Report"
      stats={[
        { label: 'Citizen Satisfaction', value: '4.8 / 5.0', hint: 'Based on 14,200 verified reviews' },
        { label: 'Avg Grievance Resolution', value: '24 Hours', hint: 'Escalated to Lead District Officers' },
        { label: 'Zero Fee Compliance', value: '99.9%', hint: 'Zero bribery or illegal fee complaints' },
      ]}
      tableHeaders={['Beneficiary Feedback', 'District / Desk', 'Sentiment', 'Action Taken']}
      tableRows={[
        ['"Loan disbursed directly to bank account within 3 days without collateral."', 'Varanasi (SBI Civil Lines)', <span key="1" className="text-[#086d46] font-bold">Positive ★★★★★</span>, 'Acknowledged'],
        ['"Biometric scanner at CSC helped me finish verification in 5 minutes."', 'Pune (Kothrud CSC)', <span key="2" className="text-[#086d46] font-bold">Positive ★★★★★</span>, 'Acknowledged'],
      ]}
    />
  );
}
