'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SUVIDHA_SCHEMES, Scheme } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function AdminSchemesPage() {
  const { showNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = SUVIDHA_SCHEMES.filter((scheme) => {
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
            <span className="text-xs font-bold text-primary">National Schemes Portfolio</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">
            Central Scheme &amp; Subvention Management
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Configure concessional interest subventions, ministry rules, and eligibility standards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showNotification('New Scheme Onboarding wizard initialized in central registry.', 'info')}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>+ Add Central Scheme</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'business', label: 'Business & Micro-Credit' },
            { id: 'education', label: 'Higher Education' },
            { id: 'artisans', label: 'Traditional Artisans' },
            { id: 'agriculture', label: 'Agri Allied' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-secondary-container/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Icon name="search" className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search schemes or ministries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((scheme: Scheme) => (
          <div
            key={scheme.id}
            className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container uppercase">
                  {scheme.categoryLabel}
                </span>
                <span className="text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                  {scheme.interest}
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-primary">
                {scheme.name}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                {scheme.desc}
              </p>
              <div className="text-[11px] text-on-surface-variant font-medium pt-1">
                Nodal: <strong>{scheme.ministry}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs">
              <div>
                <span className="text-on-surface-variant block text-[10px]">Maximum Sanction</span>
                <span className="font-bold text-primary font-serif">₹{scheme.maxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/schemes/${scheme.id}`}
                  className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-bold text-secondary hover:text-primary hover:bg-surface transition-colors"
                >
                  View Details
                </Link>
                <button
                  type="button"
                  onClick={() => showNotification(`Subvention parameters for ${scheme.name} loaded in edit console.`, 'info')}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container transition-colors"
                >
                  Edit Rules
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
