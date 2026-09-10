'use client';

import React, { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SUVIDHA_PARTNERS, Partner } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

// Dynamically import Leaflet Map to avoid SSR window errors
const PartnerMap = dynamic(() => import('@/components/PartnerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] lg:min-h-[620px] rounded-2xl border border-outline-variant/60 bg-surface-container flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
      <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="font-bold text-sm text-primary">Loading Interactive Map...</p>
      <p className="text-xs text-on-surface-variant mt-1">
        Locating verified bank branches and citizen desks
      </p>
    </div>
  ),
});

// Haversine distance calculator for user geolocation
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return `${d.toFixed(1)} km`;
}

export default function PartnerLocator() {
  const { showNotification } = useApp();
  const [query, setQuery] = useState('Varanasi');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(SUVIDHA_PARTNERS[0].id);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mobileTab, setMobileTab] = useState<'both' | 'map' | 'list'>('both');

  // Modal states
  const [selectedPartnerForModal, setSelectedPartnerForModal] = useState<Partner | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('Tomorrow, 11:00 AM');

  const listContainerRef = useRef<HTMLDivElement>(null);

  // Filter partners based on query and type
  const filteredPartners = useMemo(() => {
    return SUVIDHA_PARTNERS.filter((p) => {
      const matchesType = selectedType === 'all' || p.type === selectedType;
      const cleanQuery = query.trim().toLowerCase();

      if (!cleanQuery) return matchesType;

      const matchesDistrict = p.district.toLowerCase().includes(cleanQuery);
      const matchesPincode = p.pincode.includes(cleanQuery);
      const matchesName = p.name.toLowerCase().includes(cleanQuery);
      const matchesAddress = p.address.toLowerCase().includes(cleanQuery);

      return matchesType && (matchesDistrict || matchesPincode || matchesName || matchesAddress);
    }).map((partner) => {
      if (userLocation) {
        return {
          ...partner,
          distance: calculateHaversineDistance(
            userLocation.lat,
            userLocation.lng,
            partner.latitude,
            partner.longitude
          ),
        };
      }
      return partner;
    });
  }, [query, selectedType, userLocation]);

  // Current active partner
  const activePartner: Partner = useMemo(() => {
    const found = filteredPartners.find((p) => p.id === selectedPartnerId);
    return found || filteredPartners[0] || SUVIDHA_PARTNERS[0];
  }, [filteredPartners, selectedPartnerId]);

  // Handle partner selection from map marker
  const handleSelectFromMap = (partner: Partner) => {
    setSelectedPartnerId(partner.id);
    const cardEl = document.getElementById(`partner-card-${partner.id}`);
    if (cardEl && listContainerRef.current) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Handle partner selection from left list card
  const handleSelectFromList = (partner: Partner) => {
    setSelectedPartnerId(partner.id);
  };

  // "Use My Location" Geolocation trigger
  const handleUseMyLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      showNotification('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        showNotification(
          'Location detected. Displaying nearby assistance desks and updated distances.',
          'success'
        );
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        showNotification(
          'Location access was not allowed. Please search for your district or PIN code.',
          'info'
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Clear filters
  const handleResetFilters = () => {
    setQuery('');
    setSelectedType('all');
    setUserLocation(null);
  };

  // Booking Form Submission
  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingModalOpen(false);
    showNotification(
      `Slot confirmed with ${activePartner.officer} on ${bookingDate}. SMS confirmation pass dispatched!`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">
            Authorized Channel Partner &amp; Bank Desk Locator
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Locate nearest Public Sector Bank branches, Gramin banks, and CSC digital assistance nodes with interactive mapping.
          </p>
        </div>

        {/* Search & Location Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Icon
              name="search"
              className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="District or PIN (e.g. 221002, Pune, Mumbai)"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-outline hover:text-primary"
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>

          {/* Use My Location Button */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-secondary-container/30 text-xs font-bold text-primary transition-all flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95"
            title="Locate via device GPS"
          >
            <Icon name="my_location" className={`w-3.5 h-3.5 text-secondary ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Mobile View Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        {/* Partner Type Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Partners' },
            { id: 'PSU Bank', label: 'Public Sector Banks' },
            { id: 'Rural Gramin Bank', label: 'Rural Gramin Banks' },
            { id: 'CSC Center', label: 'CSC Citizen Desks' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedType(btn.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedType === btn.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-secondary-container/30'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Mobile View Toggle (Visible on smaller screens) */}
        <div className="flex lg:hidden rounded-xl border border-outline-variant/60 bg-surface-container p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMobileTab('both')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mobileTab === 'both' ? 'bg-primary text-white shadow-xs' : 'text-on-surface'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mobileTab === 'map' ? 'bg-primary text-white shadow-xs' : 'text-on-surface'
            }`}
          >
            Map View
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mobileTab === 'list' ? 'bg-primary text-white shadow-xs' : 'text-on-surface'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Left List (~40%) and Right Interactive Map (~60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Nearby Partner List */}
        <div
          ref={listContainerRef}
          className={`space-y-3.5 max-h-[620px] overflow-y-auto pr-1 lg:col-span-5 ${
            mobileTab === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          {filteredPartners.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xs">
              <Icon name="location_off" className="w-10 h-10 text-outline mb-2 mx-auto" />
              <p className="font-bold text-primary text-sm">
                No eligible channel partners found for this search.
              </p>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Try searching for &quot;Varanasi&quot;, &quot;Pune&quot;, &quot;Mumbai&quot;, or a valid district PIN code.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-all shadow-xs"
              >
                Clear Filters &amp; Reset
              </button>
            </div>
          ) : (
            filteredPartners.map((partner) => {
              const isSelected = activePartner?.id === partner.id;
              const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`;

              return (
                <div
                  key={partner.id}
                  id={`partner-card-${partner.id}`}
                  onClick={() => handleSelectFromList(partner)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-secondary-container/20 shadow-md ring-1 ring-primary/30'
                      : 'border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 hover:shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                            partner.type === 'PSU Bank'
                              ? 'bg-primary-fixed text-on-primary-fixed'
                              : partner.type === 'Rural Gramin Bank'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-tertiary-fixed text-on-tertiary-fixed'
                          }`}
                        >
                          {partner.type}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-primary bg-primary-fixed-dim/40 px-2 py-0.5 rounded-full">
                            ● Map Selected
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-primary text-sm leading-snug">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-1 flex items-start gap-1">
                        <Icon name="pin_drop" className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                        <span>{partner.address}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold text-secondary bg-surface-container px-2 py-1 rounded shrink-0 shadow-xs">
                      {partner.distance}
                    </span>
                  </div>

                  {/* Officer and Supported Schemes Summary */}
                  <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex flex-wrap justify-between items-center gap-2 text-xs text-on-surface-variant">
                    <span className="truncate max-w-[200px]">
                      Nodal: <strong>{partner.officer.split('(')[0]}</strong>
                    </span>
                    <a
                      href={`tel:${partner.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <Icon name="call" className="w-3.5 h-3.5" />
                      <span>{partner.phone}</span>
                    </a>
                  </div>

                  {/* Actions: View Details & Get Directions */}
                  <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPartnerForModal(partner);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-container transition-colors text-center"
                    >
                      View Details
                    </button>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-1.5 px-3 rounded-lg border border-outline-variant bg-surface text-[11px] font-bold text-secondary hover:text-primary hover:bg-surface-container transition-colors flex items-center gap-1"
                    >
                      <span>Get Directions</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Interactive Map (~60%) */}
        <div
          className={`lg:col-span-7 h-[480px] lg:h-[620px] sticky top-4 ${
            mobileTab === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <PartnerMap
            partners={filteredPartners}
            selectedPartner={activePartner}
            onSelectPartner={handleSelectFromMap}
            onViewDetails={(partner) => setSelectedPartnerForModal(partner)}
            userLocation={userLocation}
            onUseMyLocation={handleUseMyLocation}
          />
        </div>
      </div>

      {/* Comprehensive Partner Details Modal */}
      {selectedPartnerForModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 backdrop-blur-xs">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl border border-outline-variant/60 shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-outline-variant/30">
              <div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-1.5 ${
                    selectedPartnerForModal.type === 'PSU Bank'
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : selectedPartnerForModal.type === 'Rural Gramin Bank'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-tertiary-fixed text-on-tertiary-fixed'
                  }`}
                >
                  {selectedPartnerForModal.type}
                </span>
                <h3 className="text-lg font-serif font-bold text-primary">
                  {selectedPartnerForModal.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {selectedPartnerForModal.address}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartnerForModal(null)}
                className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-surface-container"
                aria-label="Close details modal"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Details */}
            <div className="space-y-3.5 text-xs text-on-surface-variant">
              <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Lead Nodal Officer:</span>
                  <strong className="text-primary">{selectedPartnerForModal.officer}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Direct Assistance Contact:</span>
                  <a href={`tel:${selectedPartnerForModal.phone}`} className="font-bold text-primary hover:underline">
                    {selectedPartnerForModal.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">District / State / PIN:</span>
                  <span className="font-medium text-on-surface">
                    {selectedPartnerForModal.district}, {selectedPartnerForModal.state} — {selectedPartnerForModal.pincode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Operating Working Hours:</span>
                  <span className="font-medium text-on-surface">Mon–Sat, 10:00 AM – 5:00 PM</span>
                </div>
              </div>

              {/* Supported Schemes */}
              <div>
                <h5 className="font-bold text-primary mb-1.5">Authorized Scheme Sanction Desks:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPartnerForModal.supportedSchemes.map((scheme, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-secondary-container/40 text-on-secondary-container font-semibold text-[11px] border border-secondary-container/60"
                    >
                      {scheme}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physical Facilities */}
              <div className="pt-2 border-t border-outline-variant/30 space-y-1">
                <h5 className="font-bold text-primary">On-Site Citizen Facilities:</h5>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Biometric Aadhaar authentication &amp; e-Sign station</li>
                  <li>Direct Benefit Transfer (DBT) bank account seed desk</li>
                  <li>0% intermediary fee guarantee with state auditor monitoring</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-outline-variant/30 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPartnerForModal.latitude},${selectedPartnerForModal.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 border border-outline-variant rounded-xl text-xs font-bold text-secondary hover:text-primary hover:bg-surface-container transition-colors flex items-center gap-1"
                >
                  <span>Get Directions</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <Link
                  href="/partner-desk"
                  className="px-3.5 py-2 border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors"
                >
                  Nodal Console
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPartnerId(selectedPartnerForModal.id);
                  setSelectedPartnerForModal(null);
                  setIsBookingModalOpen(true);
                }}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
              >
                Book Desk Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Assisted Desk Visit Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 backdrop-blur-xs">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant/60 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <Icon name="event_available" className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-primary text-sm font-serif">Schedule Assisted Desk Visit</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSlot} className="space-y-3 text-xs">
              <div className="p-3 bg-secondary-container/20 rounded-xl border border-secondary-container text-xs space-y-1">
                <p className="font-bold text-primary">{activePartner.name}</p>
                <p className="text-on-surface-variant">Officer: {activePartner.officer}</p>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant block mb-1">
                  Citizen Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Sunita Devi"
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-on-surface-variant block mb-1">
                  Mobile Number for SMS Pass
                </label>
                <input
                  type="tel"
                  defaultValue="9876543210"
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-on-surface-variant block mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
                >
                  <option>Tomorrow, 10:30 AM</option>
                  <option>Tomorrow, 11:00 AM</option>
                  <option>Tomorrow, 02:30 PM</option>
                  <option>Day After Tomorrow, 11:30 AM</option>
                </select>
              </div>

              <div className="pt-2 border-t border-outline-variant/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-container"
                >
                  Confirm Desk Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
