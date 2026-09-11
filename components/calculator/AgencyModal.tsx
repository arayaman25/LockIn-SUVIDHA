'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { SchemeFinancialTerms, PartnerTypeCode } from './calculator.types';
import { useCalculatorNearbyAgencies } from '@/src/lib/query/calculator';

interface AgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: SchemeFinancialTerms;
  selectedChannel?: PartnerTypeCode;
}

export default function AgencyModal({
  isOpen,
  onClose,
  scheme,
  selectedChannel,
}: AgencyModalProps) {
  // Default coordinates (e.g. New Delhi / central headquarters or user location)
  const [coords, setCoords] = useState<{ citizenLat: number; citizenLng: number; limit: number }>({
    citizenLat: 28.6139,
    citizenLng: 77.209,
    limit: 6,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const {
    data: partnerResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useCalculatorNearbyAgencies(scheme.code, coords, {
    enabled: isOpen,
  });

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Detecting your current location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLocationStatus('Location updated to your current area.');
        setCoords({
          citizenLat: pos.coords.latitude,
          citizenLng: pos.coords.longitude,
          limit: 6,
        });
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(
          err.code === 1
            ? 'Location access denied. Displaying national agency network.'
            : 'Unable to retrieve location. Displaying national agency network.'
        );
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  if (!isOpen) return null;

  const partners = partnerResponse?.data?.partners || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agency-modal-title"
        className="relative bg-surface rounded-2xl border border-outline-variant/60 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/40 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary-container/50 px-2.5 py-0.5 rounded-full">
              NSFDC Lending Channel Network
            </span>
            <h3 id="agency-modal-title" className="text-xl font-serif font-bold text-primary">
              Channelising Agencies for {scheme.name}
            </h3>
            <p className="text-xs text-on-surface-variant">
              Authorized State Channelising Agencies (SCAs), Cooperative Banks, and NBFC-MFIs delivering this scheme.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Location selector bar */}
        <div className="px-6 py-3 bg-surface-container-low border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Icon name="map-pin" size={15} className="text-primary" />
            <span>
              Searching near coordinates: <strong>{coords.citizenLat.toFixed(2)}° N, {coords.citizenLng.toFixed(2)}° E</strong>
            </span>
          </div>

          <button
            type="button"
            disabled={isLocating}
            onClick={handleUseMyLocation}
            className="px-3 py-1.5 rounded-lg border border-primary/30 text-primary font-bold hover:bg-primary/5 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Icon name="crosshair" size={14} />
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>
        </div>

        {locationStatus && (
          <div className="px-6 py-2 bg-secondary-container/20 text-[11px] text-on-secondary-container border-b border-secondary-container/30 flex items-center gap-2">
            <Icon name="info" size={13} className="shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-primary">
                Locating authorized channel agencies near you...
              </p>
            </div>
          )}

          {!isLoading && isError && (
            <div className="p-5 rounded-xl border border-error/20 bg-error/5 text-error space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Icon name="alert-triangle" size={16} />
                <span>Partner Agency Network Notice</span>
              </div>
              <p className="leading-relaxed text-on-surface-variant">
                Direct geolocation directory is currently being synchronized for this scheme code ({scheme.code}). You can proceed directly to your nearest State Scheduled Castes Development Corporation (SCA) office or Nationalized Bank branch.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Icon name="refresh-cw" size={12} />
                <span>Retry connection</span>
              </button>
            </div>
          )}

          {!isLoading && !isError && partners.length === 0 && (
            <div className="p-6 rounded-2xl border border-outline-variant/60 bg-surface-container-low text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Icon name="building" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">
                  State Channelising Agencies Available in All States
                </h4>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1 leading-relaxed">
                  Every State/UT operates a designated State Scheduled Castes Finance &amp; Development Corporation (SCA). If a localized branch is not mapped online, please contact the NSFDC National Helpline or the official portal.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-outline-variant/40 inline-flex flex-col sm:flex-row items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <Icon name="phone" size={14} />
                  <span>NSFDC Toll-Free: 1800-11-2005</span>
                </div>
                <span className="hidden sm:inline text-outline-variant">•</span>
                <a
                  href={scheme.sourceUrl || 'https://nsfdc.nic.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Official SCA Directory</span>
                  <Icon name="external-link" size={12} />
                </a>
              </div>
            </div>
          )}

          {!isLoading && !isError && partners.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-on-surface-variant block">
                Found {partners.length} Authorized Partner Centers:
              </span>
              {partners.map((partner) => (
                <div
                  key={partner.partnerId}
                  className="p-4 rounded-xl border border-outline-variant/60 bg-surface hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-secondary uppercase">
                        {partner.partnerType}
                      </span>
                      {typeof partner.distanceKm === 'number' && (
                        <span className="text-[11px] font-medium text-on-surface-variant">
                          ~{partner.distanceKm.toFixed(1)} km away
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-sm text-on-surface">{partner.partnerName}</h5>
                    <p className="text-xs text-on-surface-variant">{partner.address}</p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${partner.partnerName} ${partner.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>View Route</span>
                    <Icon name="navigation" size={13} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/40 bg-surface-container-low flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
