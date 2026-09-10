'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminEligibilityRulesPage() {
  return (
    <AdminSectionView
      category="Rules Engine"
      title="Citizen Eligibility Rules &amp; Automated Scoring"
      description="Define programmatic criteria for interest subvention cutoffs, family income ceilings, and DBT disbursement thresholds."
      icon="checklist"
      actionLabel="+ Deploy New Policy Rule"
      stats={[
        { label: 'Active Policy Rules', value: '42 Evaluators', hint: 'Covering 6 national welfare schemes' },
        { label: 'Automated Pass Rate', value: '88.4%', hint: 'Clean digital validation via Jan Dhan/Aadhaar' },
        { label: 'Manual Review Flags', value: '11.6%', hint: 'Routed to Lead District Nodal Desks' },
      ]}
      tableHeaders={['Rule Identifier', 'Target Scheme', 'Qualification Filter', 'Enforcement Status']}
      tableRows={[
        ['RULE-EWS-INCOME', 'CSIS Higher Education', 'Family income ≤ ₹4,50,000 p.a. via Tehsildar certificate', <span key="1" className="text-[#086d46] font-bold">● Active Automated</span>],
        ['RULE-VENDOR-VENDING', 'PM SVANidhi', 'Certificate of Vending or Urban Local Body recommendation', <span key="2" className="text-[#086d46] font-bold">● Active Automated</span>],
        ['RULE-WOMEN-STANDUP', 'Stand-Up India', '51% or higher controlling stake held by woman or SC/ST promoter', <span key="3" className="text-[#086d46] font-bold">● Active Automated</span>],
        ['RULE-VISHWAKARMA-TRADES', 'PM Vishwakarma', 'Biometric trade skill verification across 18 listed crafts', <span key="4" className="text-[#086d46] font-bold">● Active Automated</span>],
      ]}
    />
  );
}
