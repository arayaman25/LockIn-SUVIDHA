'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

interface AdminSectionViewProps {
  title: string;
  category: string;
  description: string;
  icon: string;
  stats?: { label: string; value: string; hint?: string }[];
  tableHeaders?: string[];
  tableRows?: (string | React.ReactNode)[][];
  actionLabel?: string;
  onAction?: () => void;
}

export default function AdminSectionView({
  title,
  category,
  description,
  icon,
  stats,
  tableHeaders,
  tableRows,
  actionLabel,
  onAction,
}: AdminSectionViewProps) {
  const { showNotification } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="text-xs font-semibold text-secondary hover:underline">
              Admin
            </Link>
            <span className="text-outline">/</span>
            <span className="text-xs font-bold text-primary">{category}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1 flex items-center gap-2">
            <Icon name={icon} className="w-6 h-6 text-primary" />
            <span>{title}</span>
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5 max-w-2xl">{description}</p>
        </div>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction || (() => showNotification(`${title} configuration updated.`, 'success'))}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-xs shrink-0"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* KPI Stats */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic space-y-1"
            >
              <div className="text-xs font-bold text-on-surface-variant">{stat.label}</div>
              <div className="text-2xl font-serif font-bold text-primary">{stat.value}</div>
              {stat.hint && <div className="text-[11px] text-secondary font-medium">{stat.hint}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Table / Content Panel */}
      {tableHeaders && tableRows && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-civic overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant font-bold">
                  {tableHeaders.map((header, idx) => (
                    <th key={idx} className="py-3 px-4">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                {tableRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-surface-container-low transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="py-3.5 px-4">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
