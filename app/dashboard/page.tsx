'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function CitizenDashboardPage() {
  const router = useRouter();
  const { user, applications, setTrackingQuery } = useApp();

  const handleTrack = (arn: string) => {
    setTrackingQuery(arn);
    router.push(`/tracking?arn=${arn}`);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">Citizen Dashboard</span>
      </nav>

      {/* Citizen Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-secondary uppercase">
            Beneficiary Profile
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-1">
            Welcome, {user.name}
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Aadhaar Seeded: {user.aadhaarMasked || 'XXXX-XXXX-4812'} · Mobile: +91 {user.phone || '98765 43210'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/wizard"
            className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Icon name="travel_explore" className="w-4 h-4 text-white" />
            <span>+ Discover New Scheme</span>
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-civic space-y-1">
          <p className="text-xs text-secondary font-bold uppercase">
            Registered Applications
          </p>
          <p className="text-2xl font-bold text-primary font-serif">
            {applications.length}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Across Central &amp; State Welfare Portals
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-civic space-y-1">
          <p className="text-xs text-secondary font-bold uppercase">
            Interest Subvention Received
          </p>
          <p className="text-2xl font-bold text-secondary font-serif">
            ₹3,500
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Credited directly to Jan Dhan Bank Account via DBT
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-civic space-y-1">
          <p className="text-xs text-secondary font-bold uppercase">
            Assisting Lead Branch
          </p>
          <p className="text-base font-bold text-primary truncate max-w-[240px]">
            SBI Civil Lines, Varanasi
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Nodal Officer: Rajesh Kumar
          </p>
        </div>
      </div>

      {/* My Schemes & Applications Table */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 shadow-civic space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
          <h3 className="text-base font-serif font-bold text-primary">
            My Schemes &amp; Applications
          </h3>
          <span className="text-xs font-medium text-on-surface-variant">
            Showing {applications.length} recorded items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase text-on-surface-variant border-b border-outline-variant/30 bg-surface-container-low">
              <tr>
                <th className="py-3 px-3 rounded-l-lg">ARN</th>
                <th className="py-3 px-3">Scheme Name</th>
                <th className="py-3 px-3">Sanction Amount</th>
                <th className="py-3 px-3">Lead Branch</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 rounded-r-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {applications.map((app) => (
                <tr key={app.arn} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-primary">
                    {app.arn}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-on-surface">
                    {app.scheme}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-primary">
                    {app.amount}
                  </td>
                  <td className="py-3.5 px-3 text-on-surface-variant max-w-[180px] truncate">
                    {app.bank}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                        app.status === 'Sanctioned' || app.status === 'Disbursed'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleTrack(app.arn)}
                      className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1"
                    >
                      <span>Track Timeline</span>
                      <Icon name="arrow_forward" className="w-3 h-3" />
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
