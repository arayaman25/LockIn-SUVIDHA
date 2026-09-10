'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

function OfficialLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const { authUser, loginAsOfficial } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // If already authenticated, redirect to appropriate portal
  useEffect(() => {
    if (authUser) {
      if (redirectTarget && ((authUser.role === 'admin' && redirectTarget.startsWith('/admin')) || (authUser.role === 'partner' && redirectTarget.startsWith('/partner')))) {
        router.push(redirectTarget);
      } else if (authUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (authUser.role === 'partner') {
        router.push('/partner/dashboard');
      }
    }
  }, [authUser, redirectTarget, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAsOfficial(email, password);
      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      const user = result.user;
      if (user?.role === 'admin') {
        router.push(redirectTarget && redirectTarget.startsWith('/admin') ? redirectTarget : '/admin/dashboard');
      } else if (user?.role === 'partner') {
        router.push(redirectTarget && redirectTarget.startsWith('/partner') ? redirectTarget : '/partner/dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 400);
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-civic p-6 sm:p-8 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Image
              src="/images/suvidha-logo.png"
              alt="SUVIDHA – Concessional Loan & Scheme Assistance Portal"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">
            Official Login
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            For authorized channel partners and SUVIDHA administrators
          </p>
        </div>

        {/* Prototype Demo Credential Quick-Select */}
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-secondary">
            <span>PROTOTYPE DEMO ACCOUNTS</span>
            <span className="text-[10px] text-on-surface-variant font-normal">Click to fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@suvidha.demo', 'admin123')}
              className="px-2.5 py-1.5 bg-surface-container-lowest hover:bg-primary-fixed-dim/30 border border-outline-variant/50 rounded-lg text-left transition-all text-xs active:scale-95"
            >
              <span className="block font-bold text-primary text-[11px]">Administrator</span>
              <span className="block text-[10px] text-on-surface-variant truncate">admin@suvidha.demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('partner@suvidha.demo', 'partner123')}
              className="px-2.5 py-1.5 bg-surface-container-lowest hover:bg-secondary-container/40 border border-outline-variant/50 rounded-lg text-left transition-all text-xs active:scale-95"
            >
              <span className="block font-bold text-secondary text-[11px]">Channel Partner</span>
              <span className="block text-[10px] text-on-surface-variant truncate">partner@suvidha.demo</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-error-container/40 border border-error/40 rounded-xl text-xs text-error flex items-start gap-2 animate-in fade-in duration-150">
            <Icon name="error" className="w-4 h-4 shrink-0 mt-0.5 text-error" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-on-surface-variant block mb-1.5">
              User ID / Registered Email
            </label>
            <div className="relative">
              <Icon name="mail" className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@agency.gov.in or demo user"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-on-surface-variant block">
                Official Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-[11px] text-secondary hover:text-primary hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Icon name="lock" className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface-variant">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span>Remember this official terminal</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating with Nodal Gateway...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
            <span>←</span>
            <span>Back to SUVIDHA</span>
          </Link>
          <Link href="/login" className="hover:text-primary font-medium transition-colors">
            Citizen Login
          </Link>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-inverse-surface/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 backdrop-blur-xs">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl border border-outline-variant/60 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold font-serif text-primary text-sm">Official Credential Recovery</h3>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Official credentials are tied to verified agency tokens. Please use the demo accounts (`admin@suvidha.demo` or `partner@suvidha.demo`) or contact your Lead District Nodal Officer.
            </p>
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(false)}
              className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OfficialLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading Official Login...</div>}>
      <OfficialLoginForm />
    </Suspense>
  );
}
