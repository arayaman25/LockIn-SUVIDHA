'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';
import { INDIAN_LANGUAGES } from '@/lib/data';

export default function AdminLanguagesPage() {
  return (
    <AdminSectionView
      category="Localization"
      title="Regional Language &amp; Translation Matrix"
      description="Manage official constitutional languages, terminology consistency, and civic portal string translations."
      icon="translate"
      actionLabel="Sync Translation Cache"
      stats={[
        { label: 'Active Languages', value: `${INDIAN_LANGUAGES.length} Languages`, hint: 'Hindi, Tamil, Telugu, Marathi, etc.' },
        { label: 'Translation Completeness', value: '100%', hint: 'Verified by central language board' },
      ]}
      tableHeaders={['Language Code', 'Display Label', 'Script', 'Coverage']}
      tableRows={INDIAN_LANGUAGES.map((l) => [
        l.code,
        l.label,
        'Devanagari / Indic Unicode',
        <span key={l.code} className="text-[#086d46] font-bold">100% Certified ✓</span>,
      ])}
    />
  );
}
