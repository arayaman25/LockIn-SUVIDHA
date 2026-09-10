'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function CitizenLoginPage() {
  const router = useRouter();
  const { authUser, loginAsCitizen } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState('9876543210');
  const [name, setName] = useState('Sunita Devi');
  const [otp, setOtp] = useState('123456');

  // If already logged in as citizen, redirect to dashboard
  useEffect(() => {
    if (authUser?.role === 'citizen') {
      router.push('/dashboard');
    }
  }, [authUser, router]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCitizen(mobile, name || 'Citizen Beneficiary');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-civic p-6 sm:p-8 space-y-6">
        {/* Header */}
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
            Citizen Login / नागरिक लॉगिन
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            Direct access to your welfare applications, subsidies, and tracked schemes
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1.5">
                Citizen Full Name / नागरिक का नाम
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunita Devi"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="font-bold text-on-surface-variant block mb-1.5">
                10-Digit Mobile Number (Aadhaar-Linked)
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-bold text-on-surface-variant">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 mt-2"
            >
              <span>Send Verification OTP</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div className="p-3 bg-secondary-container/30 rounded-xl border border-secondary-container/60 text-xs">
              <span className="text-secondary font-semibold">OTP dispatched via SMS to:</span>
              <div className="font-bold text-primary mt-0.5">+91 {mobile} ({name})</div>
            </div>

            <div>
              <label className="font-bold text-on-surface-variant block mb-1.5">
                Enter 6-Digit One-Time Password
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-center tracking-widest text-base font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <p className="text-[11px] text-secondary mt-1">Prototype testing code: 123456</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 border border-outline-variant rounded-xl font-bold hover:bg-surface"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-container shadow-sm"
              >
                Verify &amp; Enter
              </button>
            </div>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to SUVIDHA
          </Link>
          <Link href="/official/login" className="hover:text-primary font-bold transition-colors">
            Official Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
