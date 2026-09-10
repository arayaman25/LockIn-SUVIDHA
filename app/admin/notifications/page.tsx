'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminNotificationsPage() {
  return (
    <AdminSectionView
      category="Communications"
      title="National Broadcasts &amp; Circular Center"
      description="Send operational advisories, scheme quota updates, and policy notifications to channel partners and citizens."
      icon="notifications"
      actionLabel="+ Compose Official Circular"
      stats={[
        { label: 'Active Circulars', value: '8 Advisories', hint: 'Dispatched to all 1,428 desks' },
        { label: 'SMS Delivery Rate', value: '99.8%', hint: 'Government CDAC SMS Gateway' },
        { label: 'Avg Acknowledgment', value: '18 Minutes', hint: 'By branch nodal officers' },
      ]}
      tableHeaders={['Circular Ref', 'Target Audience', 'Subject', 'Date Issued', 'Delivery Status']}
      tableRows={[
        ['CIRC-2025-Q1-09', 'All Channel Partners', 'PM Vishwakarma ₹15,000 toolkit e-voucher distribution guidelines', '08 Feb 2025', <span key="1" className="text-[#086d46] font-bold">Delivered (100%)</span>],
        ['CIRC-2025-Q1-04', 'Public Sector Banks', 'CSIS moratorium full interest claim reconciliation deadline', '02 Feb 2025', <span key="2" className="text-[#086d46] font-bold">Delivered (100%)</span>],
        ['CIRC-2025-Q1-01', 'Rural Gramin Banks', 'Dairy & Agri Allied Credit subvention allocation revision', '15 Jan 2025', <span key="3" className="text-[#086d46] font-bold">Delivered (100%)</span>],
      ]}
    />
  );
}
