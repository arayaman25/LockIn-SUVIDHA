'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminContentFaqsPage() {
  return (
    <AdminSectionView
      category="CMS"
      title="Public Knowledge Base &amp; Civic FAQ Management"
      description="Edit citizen guide content, application guidelines, and step-by-step scheme explainer articles."
      icon="help"
      actionLabel="+ Add New Article"
      stats={[
        { label: 'Published Articles', value: '64 Guides', hint: 'Translated across 10 official languages' },
        { label: 'Help Center Hits', value: '42.8k / week', hint: 'Reduced manual helpline calls by 34%' },
      ]}
      tableHeaders={['Article Topic', 'Target Beneficiaries', 'Last Reviewed', 'Publication State']}
      tableRows={[
        ['How to avail 7% interest subvention under PM SVANidhi', 'Street Vendors & Micro-Units', 'Yesterday', <span key="1" className="text-[#086d46] font-bold">Published Live</span>],
        ['Step-by-step guide to CSIS Education moratorium subsidy', 'Higher Education Students', '3 days ago', <span key="2" className="text-[#086d46] font-bold">Published Live</span>],
        ['Documents required for Stand-Up India women loans', 'Women Entrepreneurs', '1 week ago', <span key="3" className="text-[#086d46] font-bold">Published Live</span>],
      ]}
    />
  );
}
