'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function AccessDeniedPage() {
  const router = useRouter();
  const { authUser, logout } = useApp();

  const userDashboard =
    authUser?.role === 'admin'
      ? '/admin/dashboard'
      : authUser?.role === 'partner'
      ? '/partner/dashboard'
      : authUser?.role === 'citizen'
      ? '/dashboard'
      : '/official/login';

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-16 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-civic text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto shadow-sm">
          <Icon name="security" className="w-8 h-8 text-error" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-error bg-error-container/40 px-2.5 py-0.5 rounded-full">
            403 Forbidden
          </span>
          <h1 className="text-xl font-bold font-serif text-primary mt-2">
            Access Denied
          </h1>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {authUser ? (
            <>
              You are signed in as <strong>{authUser.name}</strong> (
              <span className="font-semibold text-primary capitalize">{authUser.role}</span>).
              You do not have permission to access the requested resource.
            </>
          ) : (
            'You must be signed in with an authorized official account to view this section.'
          )}
        </p>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href={userDashboard}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-sm text-center"
          >
            {authUser ? 'Go to My Dashboard' : 'Go to Official Login'}
          </Link>
          {authUser && (
            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/official/login');
              }}
              className="w-full py-2 border border-outline-variant rounded-xl text-xs font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors"
            >
              Sign in with Different Account
            </button>
          )}
          <Link
            href="/"
            className="w-full py-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors text-center"
          >
            ← Return to SUVIDHA Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
