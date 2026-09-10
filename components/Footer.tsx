'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';

export default function Footer() {
  return (
    <footer className="bg-surface-container-high text-on-surface border-t border-outline-variant mt-auto" id="contact">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-12">
        {/* Top row: Organized columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-outline-variant/40">
          {/* Col 1: Brand & Credentials */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/suvidha-logo.png"
                alt="SUVIDHA – Concessional Loan & Scheme Assistance Portal"
                width={56}
                height={56}
                className="w-14 h-14 object-contain shrink-0"
              />
              <div>
                <div className="text-base font-bold text-primary font-serif">SUVIDHA Portal</div>
                <p className="text-xs text-on-surface-variant">
                  Concessional Assistance Platform
                </p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              An inclusive single-window digital gateway facilitating direct access to Central and State concessional credit, interest subventions, and welfare schemes.
            </p>
            <div className="text-xs text-secondary font-semibold pt-1">
              Government of India · Ministry of Social Justice &amp; Empowerment · Ministry of Finance
            </div>
          </div>

          {/* Col 2: Schemes */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary">Schemes</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/schemes" className="hover:text-primary hover:underline">
                  All Schemes Directory
                </Link>
              </li>
              <li>
                <Link href="/schemes/pmsvanidhi" className="hover:text-primary hover:underline">
                  PM SVANidhi
                </Link>
              </li>
              <li>
                <Link href="/schemes/csis" className="hover:text-primary hover:underline">
                  Education Subsidy (CSIS)
                </Link>
              </li>
              <li>
                <Link href="/schemes/standup" className="hover:text-primary hover:underline">
                  Stand-Up India
                </Link>
              </li>
              <li>
                <Link href="/schemes/mudra-kishore" className="hover:text-primary hover:underline">
                  Mudra Loans
                </Link>
              </li>
              <li>
                <Link href="/schemes/pm-vishwakarma" className="hover:text-primary hover:underline">
                  PM Vishwakarma
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary">Services</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/wizard" className="hover:text-primary hover:underline">
                  Find My Scheme Wizard
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-primary hover:underline">
                  EMI &amp; Repayment Calculator
                </Link>
              </li>
              <li>
                <Link href="/locator" className="hover:text-primary hover:underline">
                  Find a Partner Bank
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-primary hover:underline">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link href="/partner-desk" className="hover:text-primary hover:underline">
                  Partner Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary">Help &amp; Contact</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/help" className="hover:text-primary hover:underline">
                  Citizen FAQs
                </Link>
              </li>
              <li>
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline flex items-center gap-1"
                >
                  <span>Grievance (CPGRAMS)</span>
                  <Icon name="open_in_new" className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="tel:18001117788"
                  className="text-primary font-bold hover:underline block text-xs"
                >
                  Toll Free: 1800-111-7788
                </a>
              </li>
              <li>
                <a
                  href="mailto:support-suvidha@gov.in"
                  className="hover:text-primary hover:underline block text-xs"
                >
                  support-suvidha@gov.in
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline flex items-center gap-1"
                >
                  <span>National Portal of India</span>
                  <Icon name="open_in_new" className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row: Standard legal & accessibility links */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <p>
            © 2024–2025 Government of India. SUVIDHA Citizen Scheme Portal. Built for inclusive digital governance.
          </p>
          <nav aria-label="Legal Links" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <button
              onClick={() => alert('SUVIDHA Portal adheres to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.')}
              className="hover:text-primary hover:underline text-left cursor-pointer"
            >
              Accessibility Statement
            </button>
            <span>•</span>
            <button
              onClick={() => alert('Citizen data is encrypted at rest using AES-256.')}
              className="hover:text-primary hover:underline text-left cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => alert('Zero commission policy: Any commission demand is strictly prohibited.')}
              className="hover:text-primary hover:underline text-left cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => alert('Right to Information (RTI) Cell: Contact Central Public Information Officer (CPIO), New Delhi.')}
              className="hover:text-primary hover:underline text-left cursor-pointer"
            >
              Right to Information (RTI)
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
