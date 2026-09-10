'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function PartnerStatusPage() {
  const { authUser, showNotification } = useApp();
  const [deskStatus, setDeskStatus] = useState('Active Dedicated Desk');

  const handleToggle = () => {
    const next = deskStatus === 'Active Dedicated Desk' ? 'Temporarily Away' : 'Active Dedicated Desk';
    setDeskStatus(next);
    showNotification(`Desk operating status updated to: ${next}.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Partner
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Partner Status</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Nodal Desk Operating Status &amp; Calibration
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage your branch availability status reflected in real time on the citizen Partner Locator map.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-xs"
        >
          Toggle Operating Status
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic p-6 space-y-4">
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/40">
          <div>
            <span className="text-xs text-on-surface-variant block">Current Public Indicator</span>
            <span className="text-lg font-bold text-primary font-serif">{deskStatus}</span>
          </div>
          <span className="w-3.5 h-3.5 rounded-full bg-[#086d46] animate-pulse" />
        </div>

        <div className="space-y-2 text-xs text-on-surface-variant">
          <div className="flex justify-between py-2 border-b border-outline-variant/30">
            <span>Branch Name:</span>
            <strong className="text-primary">{authUser?.organization || 'State Bank of India - Civil Lines'}</strong>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/30">
            <span>Designated Lead Officer:</span>
            <strong className="text-primary">{authUser?.name || 'Rajesh Kumar'}</strong>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/30">
            <span>Standard Working Hours:</span>
            <span className="font-medium text-on-surface">Monday – Saturday, 10:00 AM – 5:00 PM</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Public Welfare Quota Slot:</span>
            <span className="font-medium text-secondary">10:30 AM – 11:30 AM Daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}
