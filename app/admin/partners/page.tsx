'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SUVIDHA_PARTNERS, Partner } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function AdminPartnersPage() {
  const { showNotification } = useApp();
  const [partnersList, setPartnersList] = useState<Partner[]>(SUVIDHA_PARTNERS);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const togglePartnerStatus = (partnerId: string) => {
    setPartnersList((prev) =>
      prev.map((p) => {
        if (p.id === partnerId) {
          const nextStatus =
            p.status === 'Active Dedicated Desk' || p.status === 'Digital Verification Node'
              ? 'Under Audit Review'
              : 'Active Dedicated Desk';
          showNotification(`Partner node "${p.name}" updated to: ${nextStatus}.`, 'info');
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const filtered = partnersList.filter((p) => {
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase()) ||
      p.officer.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
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
            <span className="text-xs font-bold text-primary">Channel Partners</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Channel Partner &amp; Bank Desk Network
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Audit compliance, verify lead district nodal officers, and toggle accreditation status.
          </p>
        </div>

        <Link
          href="/locator"
          target="_blank"
          className="px-3.5 py-2 border border-outline-variant bg-surface-container-lowest rounded-xl text-xs font-bold text-primary hover:bg-surface transition-colors shadow-xs flex items-center gap-1.5"
        >
          <span>View Public Locator</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Partners' },
            { id: 'PSU Bank', label: 'Public Sector Banks' },
            { id: 'Rural Gramin Bank', label: 'Rural Gramin Banks' },
            { id: 'CSC Center', label: 'CSC Desks' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFilterType(type.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterType === type.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-secondary-container/30'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Icon name="search" className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search partner, officer, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Partners Management Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant font-bold">
                <th className="py-3 px-4">Partner Name &amp; District</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Designated Nodal Officer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Operating Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {filtered.map((partner) => {
                const isActive =
                  partner.status === 'Active Dedicated Desk' ||
                  partner.status === 'Digital Verification Node';

                return (
                  <tr key={partner.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-4 font-bold text-primary">
                      <div className="text-sm font-serif">{partner.name}</div>
                      <div className="text-[11px] text-on-surface-variant font-normal">
                        {partner.district}, {partner.state} · PIN {partner.pincode}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          partner.type === 'PSU Bank'
                            ? 'bg-primary-fixed text-on-primary-fixed'
                            : partner.type === 'Rural Gramin Bank'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-tertiary-fixed text-on-tertiary-fixed'
                        }`}
                      >
                        {partner.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {partner.officer}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      <a href={`tel:${partner.phone}`} className="hover:text-primary hover:underline">
                        {partner.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isActive
                            ? 'bg-secondary-container/60 text-[#086d46]'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#086d46]' : 'bg-error'}`} />
                        {partner.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => togglePartnerStatus(partner.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          isActive
                            ? 'border border-outline-variant hover:border-error hover:text-error hover:bg-error-container/20'
                            : 'bg-primary text-white hover:bg-primary-container'
                        }`}
                      >
                        {isActive ? 'Mark Under Audit' : 'Reactivate Node'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
