'use client';

import React from 'react';
import AdminSectionView from '@/components/AdminSectionView';

export default function AdminAiAssistantPage() {
  return (
    <AdminSectionView
      category="AI &amp; Voice"
      title="SUVIDHA Voice &amp; Conversational AI Tuning"
      description="Telemetry and safety guidelines for the Bhashini-powered voice assistant and citizen recommendation copilot."
      icon="mic"
      actionLabel="Update Safety Guardrails"
      stats={[
        { label: 'Voice Queries Handled', value: '18,400 Today', hint: 'Hindi, Bhojpuri, Marathi, Tamil, English' },
        { label: 'Intent Recognition', value: '96.8%', hint: 'Fine-tuned on Indian welfare vocabulary' },
        { label: 'Intermediary Fraud Alerts', value: '0 Detected', hint: 'Active fraud prevention shields' },
      ]}
      tableHeaders={['Language Model', 'Primary Purpose', 'Latency', 'Operating Status']}
      tableRows={[
        ['Bhashini Speech-to-Text v2.1', 'Regional voice queries from rural citizens', '240ms', <span key="1" className="text-[#086d46] font-bold">Operational 100%</span>],
        ['SUVIDHA RAG Scheme Matcher', 'Matching trade/income to welfare guidelines', '120ms', <span key="2" className="text-[#086d46] font-bold">Operational 100%</span>],
      ]}
    />
  );
}
