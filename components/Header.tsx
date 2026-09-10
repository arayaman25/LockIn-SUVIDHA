'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { INDIAN_LANGUAGES } from '@/lib/data';
import Icon from '@/components/Icon';

const emptySubscribe = () => () => {};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);
  const {
    selectedLanguage,
    setSelectedLanguage,
    fontSize,
    setFontSize,
    setIsLoginModalOpen,
    user,
    authUser,
    logout
  } = useApp();

  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isNavActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. OFFICIAL GOI UTILITY STRIP & ACCESSIBILITY CONTROLS                    */}
      {/* ========================================================================= */}
      <aside className="bg-surface-container-high border-b border-outline-variant/40 text-on-surface-variant font-label-sm text-label-sm py-1.5 px-4 md:px-8">
        <div className="max-w-[1240px] mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Official Emblem & Ministry Header */}
          <div className="flex items-center gap-2 font-medium">
            <span
              className="inline-block w-4 h-4 rounded-full bg-tertiary-container/30 border border-tertiary-container text-[10px] text-center leading-4 font-bold text-tertiary shrink-0"
              aria-hidden="true"
            >
              🇮🇳
            </span>
            <span>भारत सरकार | Government of India</span>
            <span className="text-outline">·</span>
            <span>Ministry of Finance &amp; Social Justice</span>
          </div>

          {/* Language Controls */}
          <div className="flex items-center gap-3">

            {/* Font Size Adjusters */}
            <div className="flex items-center gap-1" role="group" aria-label="Text Size Controls">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                  fontSize === 'sm'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface hover:bg-surface-container border-outline-variant/50'
                }`}
                title="Decrease font size"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                  fontSize === 'md'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface hover:bg-surface-container border-outline-variant/50'
                }`}
                title="Normal font size"
                aria-label="Normal font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                  fontSize === 'lg'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface hover:bg-surface-container border-outline-variant/50'
                }`}
                title="Increase font size"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
            <span className="text-outline">|</span>

            {/* Regional Language Select */}
            <div className="flex items-center gap-1">
              <Icon name="translate" className="w-3.5 h-3.5 text-on-surface-variant" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                aria-label="Select Official Language"
                className="bg-surface text-[12px] py-0.5 px-1.5 border border-outline-variant/50 rounded font-label-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER & BRAND NAVIGATION BAR                                     */}
      {/* ========================================================================= */}
      <header className="bg-surface border-b border-outline-variant/60 shadow-sm sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 w-full flex justify-between items-center py-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 text-left group shrink-0">
            <Image
              src="/images/suvidha-logo.png"
              alt="SUVIDHA – Concessional Loan & Scheme Assistance Portal"
              width={64}
              height={64}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 group-hover:opacity-90 transition-opacity"
              priority
            />
            <div>
              <div className="text-xl font-bold font-serif text-primary tracking-tight leading-tight flex items-center gap-1.5">
                <span>SUVIDHA</span>
                <span className="text-[11px] font-sans bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                  सुविधा
                </span>
              </div>
              <p className="text-xs text-on-surface-variant hidden sm:block">
                Concessional Loan &amp; Scheme Assistance Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`transition-colors pb-1 text-sm font-semibold ${
                isNavActive('/')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Home
            </Link>

            <Link
              href="/schemes"
              className={`transition-colors pb-1 text-sm font-semibold ${
                isNavActive('/schemes')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Schemes
            </Link>

            <Link
              href="/wizard"
              className={`transition-colors pb-1 text-sm font-semibold ${
                isNavActive('/wizard')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Find My Scheme
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesDropdownRef}>
              <button
                onClick={() => setIsServicesOpen((prev) => !prev)}
                className={`pb-1 flex items-center gap-1 transition-colors text-sm font-semibold ${
                  pathname.startsWith('/tracking') ||
                  pathname.startsWith('/calculator') ||
                  pathname.startsWith('/locator') ||
                  pathname.startsWith('/dashboard') ||
                  pathname.startsWith('/partner-desk')
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <Icon
                  name="expand_more"
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute left-0 top-full w-64 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-lg p-2 space-y-1">
                    <Link
                      href="/tracking"
                      onClick={() => setIsServicesOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors text-left"
                    >
                      <Icon name="track_changes" className="w-4 h-4 text-secondary" />
                      <span>Track Application</span>
                    </Link>

                    <Link
                      href="/calculator"
                      onClick={() => setIsServicesOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors text-left"
                    >
                      <Icon name="calculate" className="w-4 h-4 text-secondary" />
                      <span>EMI Calculator</span>
                    </Link>

                    <Link
                      href="/locator"
                      onClick={() => setIsServicesOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors text-left"
                    >
                      <Icon name="pin_drop" className="w-4 h-4 text-secondary" />
                      <span>Find a Partner Center</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsServicesOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors text-left border-t border-outline-variant/30 mt-1 pt-1.5"
                    >
                      <Icon name="person" className="w-4 h-4 text-primary" />
                      <span>Citizen Dashboard</span>
                    </Link>

                    <Link
                      href={
                        authUser
                          ? authUser.role === 'admin'
                            ? '/admin/dashboard'
                            : authUser.role === 'partner'
                            ? '/partner/dashboard'
                            : '/official/login'
                          : '/official/login'
                      }
                      onClick={() => setIsServicesOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors text-left"
                    >
                      <Icon name="badge" className="w-4 h-4 text-primary" />
                      <span>
                        {authUser
                          ? authUser.role === 'admin'
                            ? 'Administration Console'
                            : authUser.role === 'partner'
                            ? 'Channel Partner Portal'
                            : 'Official Portal'
                          : 'Official Portal Login'}
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/help"
              className={`transition-colors pb-1 text-sm font-semibold ${
                isNavActive('/help')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Help
            </Link>
          </nav>

          {/* Trailing Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Search Schemes"
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
              title="Search Schemes"
            >
              <Icon name="search" className="w-5 h-5" />
            </button>

            {/* Authentication Actions */}
            {mounted && authUser ? (
              <div className="flex items-center gap-2">
                {authUser.role === 'admin' ? (
                  <Link
                    href="/admin/dashboard"
                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs hover:bg-primary-container transition-colors flex items-center gap-2 shadow-xs"
                    title={authUser.organization}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#c1ecd4]" />
                    <div className="text-left leading-tight hidden sm:block">
                      <span className="block font-bold text-[11px]">Administrator</span>
                      <span className="block text-[9px] text-white/80 truncate max-w-[130px]">
                        {authUser.organization?.split('(')[0] || 'SUVIDHA Admin'}
                      </span>
                    </div>
                    <span className="sm:hidden font-bold">Admin Console</span>
                  </Link>
                ) : authUser.role === 'partner' ? (
                  <Link
                    href="/partner/dashboard"
                    className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-xs"
                    title={authUser.organization}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#bee8dc]" />
                    <div className="text-left leading-tight hidden sm:block">
                      <span className="block font-bold text-[11px]">Channel Partner</span>
                      <span className="block text-[9px] text-white/80 truncate max-w-[130px]">
                        {authUser.organization?.split('-')[0] || 'Bank Desk'}
                      </span>
                    </div>
                    <span className="sm:hidden font-bold">Partner Desk</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-xs hover:bg-secondary-container/80 transition-colors flex items-center gap-1.5 font-bold"
                  >
                    <Icon name="person" className="w-4 h-4" />
                    <span className="hidden sm:inline">{authUser.name}</span>
                    <span className="sm:hidden">Dashboard</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg transition-colors"
                  aria-label="Sign Out"
                >
                  <Icon name="logout" className="w-4 h-4" />
                </button>
              </div>
            ) : mounted && user.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-xs hover:bg-secondary-container/80 transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Icon name="person" className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                  <span className="sm:hidden">Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg"
                  aria-label="Log out"
                >
                  <Icon name="logout" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* 1. Citizen Login */}
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-3.5 py-2 bg-primary text-surface rounded-lg font-bold text-xs hover:bg-primary-container shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Icon name="person" className="w-3.5 h-3.5" />
                  <span>Citizen Login</span>
                </button>

                {/* 2. Single Official Login */}
                <Link
                  href="/official/login"
                  className="px-3.5 py-2 border border-outline-variant bg-surface-container-lowest text-primary hover:bg-surface-container rounded-lg font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Icon name="login" className="w-3.5 h-3.5 text-secondary" />
                  <span>Official Login</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-lg"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <Icon name={isMobileMenuOpen ? 'close' : 'menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Modal Bar */}
        {isSearchOpen && (
          <div className="border-t border-outline-variant/60 bg-surface-container-low px-4 py-3">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-[1240px] mx-auto flex items-center gap-2"
            >
              <Icon name="search" className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Search schemes by name, keyword (e.g. Mudra, street vendor, education, artisan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-grow p-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-on-surface-variant hover:text-primary"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-outline-variant bg-surface-container-low px-6 py-4 space-y-3 shadow-xl">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 font-bold text-primary text-sm"
            >
              Home
            </Link>
            <Link
              href="/schemes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm text-on-surface hover:text-primary"
            >
              All Schemes Directory
            </Link>
            <Link
              href="/wizard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm text-on-surface hover:text-primary"
            >
              Find My Scheme Wizard
            </Link>

            <div className="pl-3 py-2 border-l-2 border-outline-variant/60 space-y-2">
              <p className="text-xs text-on-surface-variant font-bold">
                Services &amp; Portals
              </p>
              <Link
                href="/tracking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 text-xs text-on-surface hover:text-primary"
              >
                • Track Application
              </Link>
              <Link
                href="/calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 text-xs text-on-surface hover:text-primary"
              >
                • EMI Calculator
              </Link>
              <Link
                href="/locator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 text-xs text-on-surface hover:text-primary"
              >
                • Partner Bank Locator
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 text-xs text-on-surface hover:text-primary"
              >
                • Citizen Dashboard
              </Link>
            </div>

            <Link
              href="/help"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm text-on-surface hover:text-primary"
            >
              Help &amp; FAQs
            </Link>

            {/* Mobile Auth Drawer Actions */}
            <div className="pt-3 border-t border-outline-variant/40 space-y-2">
              {mounted && authUser ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-surface-container rounded-xl text-xs">
                    <span className="text-[10px] uppercase font-bold text-secondary block">
                      Signed in as {authUser.role}
                    </span>
                    <strong className="text-primary text-sm block">{authUser.name}</strong>
                    <span className="text-on-surface-variant text-[11px] block truncate">
                      {authUser.organization}
                    </span>
                  </div>

                  <Link
                    href={authUser.role === 'admin' ? '/admin/dashboard' : authUser.role === 'partner' ? '/partner/dashboard' : '/dashboard'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-2 bg-primary text-white rounded-xl text-xs font-bold text-center"
                  >
                    Go to Official Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-error font-bold text-xs"
                  >
                    Sign Out ({authUser.name})
                  </button>
                </div>
              ) : mounted && user.isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-error font-bold text-xs"
                >
                  Log out ({user.name})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="py-2.5 bg-primary text-white rounded-xl font-bold text-xs text-center"
                  >
                    Citizen Login
                  </button>
                  <Link
                    href="/official/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 border border-outline-variant bg-surface rounded-xl font-bold text-xs text-center text-primary"
                  >
                    Official Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
