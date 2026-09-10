'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminPartnerStatusPage() {
  return (
    <AdminSectionView
      category="Operations"
      title="Channel Partner Network Operational Status"
      description="Live uptime, biometric terminal health, and assisted appointment volume across Public Sector Banks and CSC Centers."
      icon="badge"
      actionLabel="Broadcast Status Audit"
      stats={[
        { label: 'Active Desks Online', value: '1,428 Desks', hint: '99.4% uptime in past 24 hours' },
        { label: 'Average Wait Time', value: '7.5 Minutes', hint: 'Zero token fee guarantee compliant' },
        { label: 'Daily Completed Visits', value: '3,840 Visits', hint: 'Assisted by accredited nodal officers' },
      ]}
      tableHeaders={['Region / District', 'Nodal Institution', 'Biometric Scanner Status', 'Daily Volume', 'Compliance Status']}
      tableRows={[
        ['Varanasi, UP (221002)', 'State Bank of India - Civil Lines', <span key="1" className="text-[#086d46] font-bold">Online &amp; Calibrated</span>, '84 Assisted Visits', <span key="1b" className="text-[#086d46] font-bold">Compliant ✓</span>],
        ['Varanasi, UP (221101)', 'Baroda UP Gramin Bank - Cholapur', <span key="2" className="text-[#086d46] font-bold">Online &amp; Calibrated</span>, '52 Assisted Visits', <span key="2b" className="text-[#086d46] font-bold">Compliant ✓</span>],
        ['Pune, MH (411005)', 'Bank of Maharashtra - Lokmangal Hub', <span key="3" className="text-[#086d46] font-bold">Online &amp; Calibrated</span>, '114 Assisted Visits', <span key="3b" className="text-[#086d46] font-bold">Compliant ✓</span>],
        ['Mumbai, MH (400001)', 'State Bank of India - Mumbai Main', <span key="4" className="text-[#086d46] font-bold">Online &amp; Calibrated</span>, '142 Assisted Visits', <span key="4b" className="text-[#086d46] font-bold">Compliant ✓</span>],
      ]}
    />
  );
}
