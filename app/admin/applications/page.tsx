'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function AdminApplicationsPage() {
  const { applications, updateApplicationStatus, showNotification } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = applications.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch =
      app.arn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.bank.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Admin
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">Applications</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Central Application Scrutiny &amp; Disbursal Pipeline
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Monitor multi-bank review stages, Aadhaar validation flags, and direct subvention sanctions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showNotification('National Disbursal Ledger sync initiated.', 'success')}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-xs"
        >
          Export Central Ledger (CSV)
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Applications' },
            { id: 'Under Verification', label: 'Under Verification' },
            { id: 'Bank Review', label: 'Bank Review' },
            { id: 'Sanctioned', label: 'Sanctioned' },
            { id: 'Action Needed', label: 'Action Needed' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilterStatus(btn.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterStatus === btn.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-secondary-container/30'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Icon name="search" className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ARN, citizen, bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant font-bold">
                <th className="py-3 px-4">ARN &amp; Date</th>
                <th className="py-3 px-4">Beneficiary</th>
                <th className="py-3 px-4">Scheme Focus</th>
                <th className="py-3 px-4">Sanction Amount</th>
                <th className="py-3 px-4">Allocated Bank</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Escalation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {filtered.map((app) => (
                <tr key={app.arn} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    <div>{app.arn}</div>
                    <div className="text-[10px] text-on-surface-variant font-normal font-sans">
                      {app.date}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <div>{app.applicant}</div>
                    <div className="text-[10px] text-on-surface-variant font-normal">
                      Aadhaar: {app.aadhaarMasked}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface truncate max-w-[200px]">
                    {app.scheme}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-primary text-sm">
                    {app.amount}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant truncate max-w-[180px]">
                    {app.bank}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Sanctioned' || app.status === 'Disbursed'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : app.status === 'Action Needed'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        updateApplicationStatus(
                          app.arn,
                          'Sanctioned',
                          4,
                          'Direct central subvention cleared via Executive Admin Console.'
                        );
                      }}
                      className="px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary-container transition-colors shadow-2xs"
                    >
                      Fast-Track Sanction
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
