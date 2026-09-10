'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useApp, UserRole } from '@/context/AppContext';
import Icon from '@/components/Icon';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const emptySubscribe = () => () => {};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser, isAuthLoaded, logout } = useApp();
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  // While checking session from localStorage
  if (!mounted || !isAuthLoaded) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-primary font-serif">Verifying Official Credentials...</p>
        <p className="text-xs text-on-surface-variant mt-1">Checking National Single-Window Nodal Authorization</p>
      </div>
    );
  }

  // Not authenticated at all
  if (!authUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-civic text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto shadow-sm">
          <Icon name="lock" className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold font-serif text-primary">Official Authentication Required</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          The requested portal (<code className="px-1.5 py-0.5 bg-surface-container rounded font-mono text-primary">{pathname}</code>) is restricted to verified SUVIDHA administrators and authorized channel partners.
        </p>
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href={`/official/login?redirect=${encodeURIComponent(pathname)}`}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-sm text-center"
          >
            Go to Official Login
          </Link>
          <Link
            href="/"
            className="w-full py-2 border border-outline-variant rounded-xl text-xs font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors text-center"
          >
            Return to Public Portal
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated but unauthorized for this role
  if (!allowedRoles.includes(authUser.role)) {
    const userRoleLabel =
      authUser.role === 'admin'
        ? 'Administrator'
        : authUser.role === 'partner'
        ? 'Channel Partner'
        : 'Citizen User';

    const userHomeDashboard =
      authUser.role === 'admin'
        ? '/admin/dashboard'
        : authUser.role === 'partner'
        ? '/partner/dashboard'
        : '/dashboard';

    return (
      <div className="max-w-lg mx-auto my-16 p-8 bg-surface-container-lowest border border-error/30 rounded-2xl shadow-civic text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto shadow-sm">
          <Icon name="security" className="w-7 h-7 text-error" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-error bg-error-container/40 px-2.5 py-0.5 rounded-full">
            403 · Access Denied
          </span>
          <h2 className="text-xl font-bold font-serif text-primary mt-2">
            Unauthorized Portal Access
          </h2>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          You are currently signed in as <strong>{authUser.name}</strong> (<span className="font-semibold text-primary">{userRoleLabel}</span>).
          Your role does not have operational clearance to view this route (<code className="px-1.5 py-0.5 bg-surface-container rounded font-mono text-primary">{pathname}</code>).
        </p>

        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 text-left text-xs text-on-surface-variant space-y-1">
          <div className="flex justify-between">
            <span>Current Role:</span>
            <span className="font-bold text-primary">{userRoleLabel}</span>
          </div>
          <div className="flex justify-between">
            <span>Authorized Scope:</span>
            <span className="font-medium text-on-surface">
              {authUser.role === 'admin' ? 'Central Administration Console' : authUser.role === 'partner' ? 'Local Nodal Branch Operations' : 'Personal Citizen Applications'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href={userHomeDashboard}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-sm text-center"
          >
            Go to My {userRoleLabel} Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/official/login');
            }}
            className="px-4 py-2.5 border border-outline-variant rounded-xl text-xs font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors"
          >
            Sign in as Different Official
          </button>
        </div>
      </div>
    );
  }

  // Access permitted
  return <>{children}</>;
}
