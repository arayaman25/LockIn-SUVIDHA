'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SUVIDHA_SCHEMES } from '@/lib/data';
import SchemeCard from '@/components/SchemeCard';
import Icon from '@/components/Icon';

function SchemesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const search = userQuery ?? initialQuery;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSchemes = SUVIDHA_SCHEMES.filter((scheme) => {
    const matchesCategory =
      selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.name.toLowerCase().includes(search.toLowerCase()) ||
      scheme.desc.toLowerCase().includes(search.toLowerCase()) ||
      scheme.ministry.toLowerCase().includes(search.toLowerCase()) ||
      scheme.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">All Schemes Directory</span>
      </nav>

      {/* Title & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Government Concessional Schemes Directory
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Central &amp; State verified welfare loans with direct interest subventions
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Icon
              name="search"
              className="w-4 h-4 text-on-surface-variant absolute left-3 top-3"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Search by scheme name, trade, category..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {search && (
            <button
              onClick={() => setUserQuery('')}
              className="p-2 text-on-surface-variant hover:text-primary"
              title="Clear search"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'all', label: 'All Schemes' },
          { id: 'business', label: 'Micro & Small Business' },
          { id: 'education', label: 'Higher Education' },
          { id: 'artisans', label: 'Traditional Artisans' },
          { id: 'agriculture', label: 'Agriculture & Allied' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSelectedCategory(btn.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === btn.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-secondary-container/30'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/50 max-w-md mx-auto">
          <Icon name="location_off" className="w-8 h-8 text-outline mb-2 mx-auto" />
          <h3 className="font-bold text-primary text-sm font-serif">No schemes found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setUserQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SchemesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-primary text-sm">Loading schemes...</div>}>
      <SchemesContent />
    </Suspense>
  );
}
