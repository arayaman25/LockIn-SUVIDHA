'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

const PARTNER_NAV_ITEMS = [
  { href: '/partner/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/partner/applications', label: 'Applications', icon: 'description' },
  { href: '/partner/applicants', label: 'Applicants', icon: 'group' },
  { href: '/partner/documents', label: 'Documents', icon: 'folder' },
  { href: '/partner/schemes', label: 'Scheme Availability', icon: 'account_balance' },
  { href: '/partner/status', label: 'Partner Status', icon: 'badge' },
  { href: '/partner/notifications', label: 'Notifications', icon: 'notifications' },
  { href: '/partner/profile', label: 'Profile', icon: 'person' },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authUser, logout } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/official/login');
  };

  const isItemActive = (href: string) => {
    if (href === '/partner/dashboard') {
      return pathname === '/partner' || pathname === '/partner/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <RoleGuard allowedRoles={['partner']}>
      <div className="min-h-screen bg-surface flex flex-col">
        {/* Partner Dedicated Topbar */}
        <header className="bg-secondary text-white border-b border-secondary-container px-4 md:px-8 py-3 sticky top-0 z-30 shadow-md">
          <div className="max-w-[1440px] mx-auto flex flex-wrap justify-between items-center gap-4">
            {/* Left: Branding & Role */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                aria-label="Toggle partner sidebar"
              >
                <Icon name="menu" className="w-5 h-5" />
              </button>

              <Link href="/partner/dashboard" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shrink-0 shadow-xs">
                  <Image
                    src="/images/suvidha-logo.png"
                    alt="SUVIDHA – Concessional Loan & Scheme Assistance Portal"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 leading-none">
                    <span className="font-serif font-bold text-base tracking-tight">SUVIDHA</span>
                    <span className="text-[10px] font-sans font-bold bg-[#bee8dc] text-[#436a60] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Channel Partner
                    </span>
                  </div>
                  <span className="text-[11px] text-white/80 block mt-0.5">
                    Authorized Agency &amp; Bank Desk Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Branch Info & Partner Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-white">
                  {authUser?.name || 'Lead Nodal Officer'}
                </span>
                <span className="block text-[10px] text-white/75 truncate max-w-xs">
                  {authUser?.organization || 'State Bank of India - Civil Lines (Branch 0124)'}
                </span>
              </div>

              <div className="h-6 w-px bg-white/20 hidden sm:block" />

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1.5 border border-white/15 active:scale-95"
                title="Log out of Channel Partner Portal"
              >
                <Icon name="logout" className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Body Container: Sidebar + Content */}
        <div className="flex-grow flex max-w-[1440px] w-full mx-auto">
          {/* Partner Sidebar */}
          <aside
            className={`w-64 shrink-0 bg-surface-container-low border-r border-outline-variant/60 flex flex-col justify-between transition-all duration-200 ${
              isSidebarCollapsed ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-64px)]">
              <div className="px-3 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Bank Desk Console
              </div>

              {PARTNER_NAV_ITEMS.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-secondary text-white shadow-xs font-bold'
                        : 'text-on-surface hover:bg-surface-container hover:text-secondary'
                    }`}
                  >
                    <Icon name={item.icon} className={`w-4 h-4 ${active ? 'text-white' : 'text-secondary'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-outline-variant/40 mt-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-error hover:bg-error-container/30 transition-all text-left"
                >
                  <Icon name="logout" className="w-4 h-4 text-error" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
