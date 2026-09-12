'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';

export default function AdminLanguagesPage() {
  return (
    <AdminSectionView
      category="Localization"
      title="Regional Language &amp; Translation Matrix"
      description="Manage official constitutional languages, terminology consistency, and civic portal string translations."
      icon="translate"
      actionLabel="Sync Translation Cache"
      stats={[
        { label: 'Active Languages', value: `${SUPPORTED_LANGUAGES.length} Languages`, hint: 'Hindi, Tamil, Telugu, Marathi, etc.' },
        { label: 'Voice Input Coverage', value: `${SUPPORTED_LANGUAGES.filter((l) => l.speechSupported).length} Languages`, hint: 'Languages the speech recognizer supports' },
      ]}
      tableHeaders={['Language Code', 'Display Label', 'Voice Input', 'Coverage']}
      tableRows={SUPPORTED_LANGUAGES.map((l) => [
        l.code,
        `${l.nativeLabel} (${l.englishName})`,
        l.speechSupported ? 'Supported' : 'Text only',
        <span key={l.code} className="text-[#086d46] font-bold">100% Certified ✓</span>,
      ])}
    />
  );
}
