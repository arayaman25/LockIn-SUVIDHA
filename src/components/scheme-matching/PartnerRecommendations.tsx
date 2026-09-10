'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/Icon';
import { useNearbyPartners } from '@/src/lib/query';
import { ScoredPartner } from '@/src/types';

// Dynamically import Leaflet Map to avoid SSR errors
const PartnerMap = dynamic(() => import('@/components/PartnerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-2xl border border-outline-variant/60 bg-surface-container flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
      <p className="text-xs font-bold text-primary">Loading Partner Desk Map...</p>
    </div>
  ),
});

interface PartnerRecommendationsProps {
  schemeId: string;
  schemeName: string;
  citizenState?: string;
  citizenDistrict?: string;
  initialLat?: number;
  initialLng?: number;
}

export default function PartnerRecommendations({
  schemeId,
  schemeName,
  citizenDistrict,
  initialLat,
  initialLng,
}: PartnerRecommendationsProps) {
  // Default coordinates (e.g. Varanasi center or user supplied)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(() => {
    if (typeof initialLat === 'number' && typeof initialLng === 'number') {
      return { lat: initialLat, lng: initialLng };
    }
    return { lat: 25.3176, lng: 82.9739 }; // Varanasi / UP default pilot
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<ScoredPartner | null>(null);

  const {
    data: partnerResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useNearbyPartners(
    schemeId,
    coords ? { citizenLat: coords.lat, citizenLng: coords.lng, limit: 5 } : null,
    { enabled: Boolean(coords) }
  );

  const handleUseMyLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        setLocationError('Location permission was denied. Using district default location.');
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const partners = partnerResponse?.data?.partners || [];

  // Adapt ScoredPartner for PartnerMap Leaflet component
  const mapCompatiblePartners = partners.map((p, idx) => {
    // Offset coordinates if partner lat/lng missing from backend row
    const lat = p.latitude ?? (coords ? coords.lat + (idx * 0.006 - 0.012) : 25.3176);
    const lng = p.longitude ?? (coords ? coords.lng + (idx * 0.007 - 0.014) : 82.9739);

    return {
      id: p.partnerId,
      name: p.partnerName,
      type: (p.partnerType as 'PSU Bank' | 'Rural Gramin Bank' | 'CSC Center') || 'PSU Bank',
      district: citizenDistrict || 'Varanasi',
      state: 'Uttar Pradesh',
      distance: `${p.distanceKm.toFixed(1)} km`,
      address: p.address,
      status: 'Active & Accepting Applications',
      officer: 'Nodal Branch Desk Officer',
      phone: '1800-180-1111',
      pincode: '221002',
      latitude: lat,
      longitude: lng,
      supportedSchemes: [schemeId],
    };
  });

  const activeMapPartner = mapCompatiblePartners.find(
    (p) => p.id === selectedPartner?.partnerId
  ) || mapCompatiblePartners[0] || null;

  return (
    <div className="mt-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/30">
        <div>
          <h5 className="font-serif font-bold text-primary text-sm sm:text-base flex items-center gap-1.5">
            <Icon name="pin_drop" className="w-4 h-4 text-secondary" />
            <span>Authorized Partner Branches for {schemeName}</span>
          </h5>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Lending desks with active loan sanction quotas &amp; direct benefit processing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface text-xs font-bold text-primary transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Icon name="my_location" className={`w-3.5 h-3.5 text-secondary ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
        </button>
      </div>

      {locationError && (
        <p className="text-[11px] text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg">
          {locationError}
        </p>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-10 text-center space-y-2">
          <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-primary">Searching nearest nodal partners…</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl bg-error-container/30 border border-error/20 text-xs text-on-error-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="error" className="w-4 h-4 text-error shrink-0" />
            <span>{error?.message || 'Unable to load nearby partners at this moment.'}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 rounded-lg bg-primary text-white font-bold text-[11px] hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results grid: List on left (~50%), Map on right (~50%) */}
      {!isLoading && !isError && partners.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Partner List */}
          <div className="lg:col-span-6 space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {partners.map((partner) => {
              const isSelected = selectedPartner?.partnerId === partner.partnerId;
              return (
                <div
                  key={partner.partnerId}
                  onClick={() => setSelectedPartner(partner)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-surface-container-lowest shadow-xs ring-1 ring-primary/40'
                      : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container uppercase">
                          {partner.partnerType}
                        </span>
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Score: {partner.compositeScore}%
                        </span>
                      </div>
                      <h6 className="font-bold text-primary text-xs">
                        {partner.partnerName}
                      </h6>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                        {partner.address}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-secondary shrink-0 bg-surface-container px-2 py-0.5 rounded">
                      {partner.distanceKm.toFixed(1)} km
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
                    <span className="text-on-surface-variant">
                      Source: <strong>{partner.quotaSource === 'partner_reported' ? 'Live Desk' : 'Verified'}</strong>
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(partner.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-6 h-[360px] rounded-xl overflow-hidden border border-outline-variant/60 shadow-xs">
            <PartnerMap
              partners={mapCompatiblePartners}
              selectedPartner={activeMapPartner}
              onSelectPartner={(p) => {
                const found = partners.find((item) => item.partnerId === p.id);
                if (found) setSelectedPartner(found);
              }}
              onViewDetails={() => {}}
              userLocation={coords}
              onUseMyLocation={handleUseMyLocation}
            />
          </div>

        </div>
      )}

      {!isLoading && !isError && partners.length === 0 && (
        <div className="p-6 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/50">
          <p className="text-xs font-bold text-primary">No nearby partner branches found</p>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Try using your current location or checking regional centers in the official portal.
          </p>
        </div>
      )}
    </div>
  );
}
