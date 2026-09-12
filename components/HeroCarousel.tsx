'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface HeroSlide {
  id: string;
  schemeId: string;
  category: string;
  titlePrefix: string;
  title: string;
  description: string;
  wizardRoute: string;
  image: string;
  imageAlt: string;
  badge: string;
  highlightTag: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'term-loan',
    schemeId: 'mudra-kishore',
    category: '#PRADHAN MANTRI CONCESSIONAL TERM CREDIT',
    titlePrefix: 'Pradhan Mantri',
    title: 'MUDRA Term Loan Scheme',
    description:
      'Concessional capital credit up to ₹5 Lakh with zero third-party guarantee to procure machinery, expand inventory, and upgrade commercial enterprises.',
    wizardRoute: '/wizard?purpose=business',
    image: '/images/hero-real-fast-food.avif',
    imageAlt: 'Indian small business owner in his electronics and hardware workshop',
    badge: 'Term Credit up to ₹5 Lakh',
    highlightTag: 'Zero Collateral Term Loan',
  },
  {
    id: 'micro-finance',
    schemeId: 'pmsvanidhi',
    category: '#PRADHAN MANTRI CONCESSIONAL CREDIT & WELFARE',
    titlePrefix: 'PM SVANidhi',
    title: 'Micro Finance Scheme',
    description:
      'Collateral-free working capital loan starting at ₹10,000 up to ₹50,000 with 7% interest subvention and cashback rewards on digital transactions.',
    wizardRoute: '/wizard?purpose=business',
    image: '/images/hero-real-students.jpg',
    imageAlt: 'Indian street vendor merchant at his certified food stall with digital payment',
    badge: '7% Interest Subvention',
    highlightTag: 'Fast-Track Working Capital',
  },
  {
    id: 'education-loan',
    schemeId: 'csis',
    category: '#CENTRAL SECTOR HIGHER EDUCATION WELFARE',
    titlePrefix: 'Central Sector',
    title: 'Educational Loan Subsidy',
    description:
      '100% full government interest subvention during the moratorium and course period for professional and technical higher education in recognized Indian institutions.',
    wizardRoute: '/wizard?purpose=education',
    image: '/images/hero-real-handloom.jpg',
    imageAlt: 'Indian university students holding study materials and laptop on campus',
    badge: '100% Moratorium Subsidy',
    highlightTag: 'EWS Higher Education Support',
  },
  {
    id: 'women-entrepreneur',
    schemeId: 'standup',
    category: '#WOMEN ENTREPRENEURSHIP & ENTERPRISE CREDIT',
    titlePrefix: 'Stand-Up India',
    title: 'Women Enterprise Scheme',
    description:
      'Composite bank credit between ₹10 Lakh and ₹1 Crore for women entrepreneurs establishing greenfield manufacturing, service, or trading ventures.',
    wizardRoute: '/wizard?purpose=business',
    image: '/images/b6.jpg',
    imageAlt: 'Indian woman artisan and weaver operating a traditional handloom workshop',
    badge: '₹10 Lakh to ₹1 Crore Credit',
    highlightTag: 'Greenfield Enterprise Support',
  },
];

const AUTOPLAY_INTERVAL = 6000;

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = HERO_SLIDES.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Autoplay handler with pause on interaction
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const deltaX = touchEndXRef.current - touchStartXRef.current;
      const minSwipeDistance = 45;

      if (deltaX < -minSwipeDistance) {
        goToNext();
      } else if (deltaX > minSwipeDistance) {
        goToPrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsPaused(false);
  };

  return (
    <section
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Government Schemes Hero Carousel"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative mx-4 overflow-hidden rounded-[26px] bg-[#1b4332] text-white shadow-[0_20px_36px_-22px_rgba(16,43,32,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:mx-8 lg:mx-12"
    >
      {/* Carousel Track */}
      <div
        className="flex w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {HERO_SLIDES.map((slide, index) => {
          const isCurrent = currentIndex === index;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}: ${slide.title}`}
              aria-hidden={!isCurrent}
              className="relative w-full min-w-full shrink-0"
            >
              <div className="relative mx-auto flex flex-col gap-8 px-6 py-10 sm:px-12 md:px-14 lg:grid lg:min-h-[530px] lg:max-w-[1360px] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-20 lg:py-16">
                {/* Left Column (Desktop) / Ordered Elements (Mobile) */}
                <div className="z-10 flex flex-col max-w-[650px]">
                  {/* Category Pill */}
                  <div className="order-1 mb-4 sm:mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#a86d2b]/85 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-sm ring-1 ring-white/10">
                      <span className="h-2 w-2 rounded-full bg-[#ffb04f]" aria-hidden="true" />
                      <span>{slide.category}</span>
                    </span>
                  </div>

                  {/* Decorative dot cluster */}
                  <div className="order-2 mb-4 hidden gap-2.5 pl-1 sm:flex lg:mb-6" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
                  </div>

                  {/* Large Scheme Title */}
                  <h1 className="order-3 max-w-[660px] text-[clamp(2.1rem,4.5vw,4.5rem)] font-bold uppercase leading-[0.98] tracking-[-0.035em] text-white">
                    <span className="block text-[0.6em] tracking-[-0.025em] text-white/95 font-semibold">
                      {slide.titlePrefix}
                    </span>
                    {slide.title}
                  </h1>

                  {/* Short 2-3 line description */}
                  <p className="order-4 mt-5 max-w-[620px] text-sm leading-relaxed text-white/95 sm:text-base sm:leading-7 lg:mt-6">
                    {slide.description}
                  </p>

                  {/* Visual card container on mobile (stacks between description and buttons) */}
                  <div className="order-5 my-6 block lg:hidden">
                    <div className="relative mx-auto w-full max-w-[420px]">
                      <div
                        className="absolute inset-0 h-full w-full rotate-[4deg] rounded-[22px] border-2 border-white/20 pointer-events-none"
                        aria-hidden="true"
                      />
                      <div className="relative overflow-hidden rounded-[20px] border-[5px] border-[#d8d8d2] bg-white p-1 shadow-xl">
                        <div className="flex h-7 items-center justify-between border-b border-[#e5e7eb] bg-white px-3 text-[9px] text-[#6b7280]">
                          <span className="truncate">Enter scheme name to search...</span>
                          <span className="font-semibold text-primary">⌕ Search</span>
                        </div>
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-[#f0f4f1]">
                          <Image
                            src={slide.image}
                            alt={slide.imageAlt}
                            fill
                            sizes="(max-width: 768px) 90vw, 420px"
                            priority={index === 0}
                            className="object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                            <span className="rounded-md bg-[#1b4332]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                              {slide.highlightTag}
                            </span>
                            <span className="text-[11px] font-bold text-white/90 drop-shadow">
                              {slide.badge}
                            </span>
                          </div>
                        </div>
                        <div className="flex h-9 items-center justify-between bg-white px-3 text-[9px] font-bold text-[#374151]">
                          <span>#GOVERNMENTSCHEMES / #SCHEMESFORYOU</span>
                          <span className="text-[#086d46]">Verified Direct ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary actions */}
                  <div className="order-6 mt-6 flex flex-wrap items-center gap-4 lg:mt-8">
                    <Link
                      href={slide.wizardRoute}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#086d46] shadow-md transition-all hover:bg-white/95 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
                    >
                      <span>Get Scheme Recommendations</span>
                      <span aria-hidden="true">→</span>
                    </Link>

                    <Link
                      href="/assistant"
                      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
                    >
                      <span>Chat with Suvidha AI</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                {/* Right Column (Desktop / Tablet visual card) */}
                <div className="relative mx-auto hidden w-full max-w-[540px] items-center justify-center lg:flex lg:min-h-[420px]">
                  {/* Decorative tilted background frame */}
                  <div
                    className="absolute h-[88%] w-[92%] rotate-[6deg] rounded-[28px] border-2 border-white/25 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Main editorial scheme card */}
                  <div className="relative w-[92%] rotate-[0.5deg] rounded-[24px] border-[6px] border-[#d8d8d2] bg-white p-1.5 shadow-[0_20px_35px_rgba(0,40,25,0.35)] transition-transform duration-300 hover:rotate-0">
                    <div className="overflow-hidden rounded-[16px] border border-[#d5d6d0] bg-[#f8faf8]">
                      {/* Search simulation bar */}
                      <div className="flex h-8 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 text-[10px] text-[#6b7280]">
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#086d46]" />
                          <span>Enter scheme name or category to search...</span>
                        </span>
                        <span className="font-semibold text-primary">⌕ Search</span>
                      </div>

                      {/* Editorial Visual Frame */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eaf4ec]">
                        <Image
                          src={slide.image}
                          alt={slide.imageAlt}
                          fill
                          sizes="(max-width: 1200px) 50vw, 520px"
                          priority={index === 0}
                          className="object-cover object-center transition-transform duration-700 hover:scale-105"
                        />
                        {/* Civic Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

                        {/* Top decorative dot grid */}
                        <div
                          className="absolute left-4 top-4 grid grid-cols-3 gap-1.5 opacity-80 pointer-events-none"
                          aria-hidden="true"
                        >
                          {Array.from({ length: 9 }).map((_, dotIdx) => (
                            <span key={dotIdx} className="h-1.5 w-1.5 rounded-full bg-white/90 shadow-sm" />
                          ))}
                        </div>

                        {/* Top-right scheme category tag */}
                        <div className="absolute right-3.5 top-3.5">
                          <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                            {slide.badge}
                          </span>
                        </div>

                        {/* Bottom overlay inside image */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#ffd580]">
                              #GOVERNMENT WELFARE
                            </span>
                            <span className="text-base font-extrabold uppercase leading-tight text-white drop-shadow">
                              SUVIDHA DIRECT
                            </span>
                          </div>
                          <span className="rounded-full bg-[#086d46] px-3 py-1 text-[10px] font-bold text-white shadow-md">
                            {slide.highlightTag}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer Bar */}
                      <div className="flex h-11 items-center justify-between bg-white px-4 text-[10px] font-bold text-[#374151]">
                        <span className="tracking-wide">#GOVERNMENTSCHEMES / #SCHEMESFORYOU</span>
                        <Link
                          href={slide.wizardRoute}
                          className="inline-flex items-center gap-1 rounded-full bg-[#086d46] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#065335]"
                        >
                          <span>Find Schemes For You</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Previous Slide Button */}
      <button
        type="button"
        onClick={goToPrev}
        aria-label="Previous scheme slide"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm shadow-md transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-white sm:left-4"
      >
        <span className="text-2xl sm:text-3xl font-light leading-none -mt-0.5 select-none" aria-hidden="true">
          ‹
        </span>
      </button>

      {/* Next Slide Button */}
      <button
        type="button"
        onClick={goToNext}
        aria-label="Next scheme slide"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm shadow-md transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-white sm:right-4"
      >
        <span className="text-2xl sm:text-3xl font-light leading-none -mt-0.5 select-none" aria-hidden="true">
          ›
        </span>
      </button>

      {/* Slide Indicators (Dots) */}
      <div
        role="tablist"
        aria-label="Carousel slide selectors"
        className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 rounded-full bg-black/25 px-3.5 py-1.5 backdrop-blur-sm"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = currentIndex === index;

          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Slide ${index + 1}: ${slide.title}`}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isActive
                  ? 'h-2.5 w-7 sm:w-8 bg-white shadow-md'
                  : 'h-2.5 w-2.5 bg-white/45 hover:bg-white/80'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
