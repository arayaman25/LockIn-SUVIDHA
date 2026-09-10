'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

export default function CitizenLoginModal() {
  const router = useRouter();
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState('9876543210');
  const [name, setName] = useState('Sunita Devi');
  const [otp, setOtp] = useState('123456');

  if (!isLoginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    login(mobile, name || 'Citizen Beneficiary');
    setStep(1);
    router.push('/dashboard');
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div
        className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant/60 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/suvidha-logo.png"
              alt="SUVIDHA – Concessional Loan & Scheme Assistance Portal"
              width={36}
              height={36}
              className="w-9 h-9 object-contain shrink-0"
            />
            <h3 id="login-modal-title" className="text-base font-bold text-primary font-serif">
              Citizen Login / नागरिक लॉगिन
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Close Login Modal"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-xs text-on-surface-variant">
              Enter your mobile number and name to receive an instant authentication OTP.
            </p>

            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">
                Citizen Name / नागरिक का नाम
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
              <label className="text-xs font-bold text-on-surface-variant block mb-1">
                10-Digit Mobile Number (Aadhaar-Linked)
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-bold text-on-surface-variant">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full p-2 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container transition-colors shadow-sm active:scale-95"
            >
              Send OTP / ओटीपी प्राप्त करें
            </button>

            <p className="text-[11px] text-center text-on-surface-variant">
              By proceeding, you agree to secure authentication under the DPDP Act.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-secondary-container/20 p-3 rounded-xl border border-secondary-container text-xs">
              <p className="text-primary font-medium">
                OTP sent to <span className="font-bold">+91 {mobile}</span>. Valid for 10 minutes.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-center font-bold text-lg tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container transition-colors shadow-sm active:scale-95"
            >
              Verify &amp; Proceed to Dashboard
            </button>

            <div className="flex justify-between items-center text-[11px] text-on-surface-variant pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="hover:text-primary underline"
              >
                Change Phone Number
              </button>
              <button
                type="button"
                onClick={() => alert('OTP resent to ' + mobile)}
                className="hover:text-primary font-bold"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
