'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useApp } from '@/context/AppContext';
import { SUVIDHA_SCHEMES, SUVIDHA_PARTNERS } from '@/lib/data';
import Icon from '@/components/Icon';

function ApplyFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSchemeId = searchParams.get('scheme') || 'pmsvanidhi';
  const initialAmount = searchParams.get('amount') || '';

  const { addApplication, user } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [schemeId, setSchemeId] = useState(initialSchemeId);
  const [name, setName] = useState(user.name || 'Sunita Devi');
  const [aadhaar, setAadhaar] = useState('8839-2011-4812');
  const [phone, setPhone] = useState(user.phone || '9876543210');
  const [amount, setAmount] = useState(initialAmount || '50000');
  const [bankBranch, setBankBranch] = useState(SUVIDHA_PARTNERS[0].name);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [submittedArn, setSubmittedArn] = useState<string | null>(null);

  const selectedScheme =
    SUVIDHA_SCHEMES.find((s) => s.id === schemeId) || SUVIDHA_SCHEMES[0];

  const handleSimulateOCR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setOcrCompleted(true);
    }, 1200);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const arn = addApplication({
      schemeId: selectedScheme.id,
      fullName: name,
      phone,
      aadhaarMasked: aadhaar,
      amount,
      bankBranch
    });

    setSubmittedArn(arn);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  if (submittedArn) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/60 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto shadow-md">
            <Icon name="check_circle" className="w-9 h-9 text-primary" />
          </div>

          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container uppercase">
              Acknowledgement Generated
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-primary mt-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">
              Your application for <strong>{selectedScheme.name}</strong> has been transmitted to {bankBranch}.
            </p>
          </div>

          <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/40 max-w-md mx-auto space-y-2">
            <p className="text-xs text-on-surface-variant uppercase font-bold">
              Application Reference Number (ARN)
            </p>
            <p className="text-2xl font-bold text-primary font-mono tracking-wider">
              {submittedArn}
            </p>
            <p className="text-[11px] text-secondary font-medium">
              Save this number to track review progress and DBT disbursement.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => router.push(`/tracking?arn=${submittedArn}`)}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container transition-all"
            >
              Track Live Application Timeline
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 border border-outline-variant text-primary rounded-xl font-bold text-xs hover:bg-surface-container transition-all"
            >
              Go to Citizen Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/40">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Icon name="home" className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/schemes" className="hover:text-primary">
          Schemes
        </Link>
        <span>/</span>
        <span className="font-bold text-primary">Direct Application</span>
      </nav>

      <div className="max-w-3xl mx-auto bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/50 shadow-civic">
        {/* Step Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-outline-variant/40 mb-6 gap-2">
          <div>
            <span className="text-xs font-bold text-secondary uppercase">
              Single-Window Fast Track Form
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-primary mt-0.5">
              Apply for {selectedScheme.name}
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Assistance up to ₹{selectedScheme.maxAmount.toLocaleString('en-IN')} with {selectedScheme.interest}
            </p>
          </div>
          <div className="text-xs font-bold text-primary bg-surface-container px-3 py-1 rounded-full">
            Step {step} of 3
          </div>
        </div>

        {/* Form Body */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-primary">
              Step 1: Citizen Identification &amp; Aadhaar KYC
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">
                  Full Name (As printed on Aadhaar)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    Aadhaar Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    Mobile Number (Aadhaar Seeded)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    Select Welfare Scheme
                  </label>
                  <select
                    value={schemeId}
                    onChange={(e) => setSchemeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {SUVIDHA_SCHEMES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">
                    Required Credit Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={selectedScheme.maxAmount}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant/40 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all"
              >
                Next: Document Verification →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-primary">
              Step 2: Smart OCR Document Verification
            </h3>
            <p className="text-xs text-on-surface-variant">
              Upload clear photograph or PDF of your Aadhaar Card or Vending Certificate. Our automated civic OCR will verify details without paperwork fees.
            </p>

            <div
              onClick={handleSimulateOCR}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                ocrCompleted
                  ? 'border-secondary bg-secondary-container/20'
                  : 'border-outline-variant bg-surface hover:border-primary'
              }`}
            >
              {isScanning ? (
                <div className="space-y-2 py-4">
                  <Icon name="sync" className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="font-bold text-primary text-xs">
                    Scanning document &amp; verifying credentials...
                  </p>
                </div>
              ) : (
                <>
                  <Icon name="document_scanner" className="w-8 h-8 text-secondary mb-2 mx-auto" />
                  <p className="font-bold text-primary text-xs">
                    {ocrCompleted
                      ? 'Document Uploaded & Verified (Click to re-scan)'
                      : 'Click to upload Aadhaar / Vending ID / Certificate'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Supports JPG, PNG, PDF up to 5MB · End-to-end Encrypted
                  </p>
                </>
              )}
            </div>

            {ocrCompleted && (
              <div className="p-4 rounded-xl bg-secondary-container/30 border border-secondary-container text-xs space-y-1 animate-in fade-in">
                <p className="font-bold text-primary flex items-center gap-1.5">
                  <Icon name="check_circle" className="w-4 h-4 text-secondary" />
                  <span>Document OCR Authenticated Successfully</span>
                </p>
                <p className="text-[11px] text-on-surface-variant pl-5">
                  Extracted UID: {aadhaar} · Name: {name} · Domicile: Varanasi, UP · DOB: 14/05/1982
                </p>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-outline-variant/40 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2 border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!ocrCompleted) setOcrCompleted(true);
                  setStep(3);
                }}
                className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all"
              >
                Next: Select Disbursal Bank →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmitApplication} className="space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-primary">
              Step 3: Preferred Disbursal Bank &amp; Final Submission
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">
                  Select Lead Processing Bank Branch in Your District
                </label>
                <select
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {SUVIDHA_PARTNERS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.distance} away)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 space-y-2 text-xs">
                <p className="font-bold text-primary">
                  Declaration &amp; Zero Intermediary Consent:
                </p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  I hereby solemnly affirm that the information provided is accurate. I confirm that no intermediary charge, speed money, or private commission has been demanded or tendered by any person for this concessional application.
                </p>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input type="checkbox" defaultChecked required className="accent-primary" />
                  <span className="text-on-surface font-semibold text-xs">
                    I agree to Aadhaar e-Sign and Direct Benefit Transfer (DBT) credit terms.
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant/40 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-sm transition-all"
              >
                Submit Application (Generate ARN)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-primary text-sm">Loading application form...</div>}>
      <ApplyFlowContent />
    </Suspense>
  );
}
