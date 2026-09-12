"use client";

import React, { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import { useNearbyPartners } from "@/src/lib/query";
import {
  ScoredPartner,
  NearbyPartnersRequest,
} from "@/src/types/scheme-matching";

// Dynamically import Leaflet Map to avoid SSR window errors
const PartnerMap = dynamic(() => import("@/components/PartnerMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] lg:min-h-[620px] rounded-2xl border border-outline-variant/60 bg-surface-container flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
      <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="font-bold text-sm text-primary">
        Loading Interactive Map...
      </p>
      <p className="text-xs text-on-surface-variant mt-1">
        Locating verified bank branches and citizen desks
      </p>
    </div>
  ),
});

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

const SCHEME_OPTIONS = [
  { id: "MCF", label: "Micro Finance Scheme" },
  { id: "TL", label: "Term Loan" },
  { id: "ELS", label: "Educational Loan Scheme" },
  { id: "AMFY", label: "Aajeevika Micro-Finance Yojana" },
  { id: "UNY", label: "Udyam Nidhi Yojana" },
];

interface Coords {
  lat: number;
  lng: number;
}

function toMapPartner(p: ScoredPartner) {
  return {
    ...p,
    id: p.partnerId,
    name: p.partnerName,
    type: p.partnerType,
    distance: formatDistance(p.distanceKm),
    latitude: p.latitude ?? 0,
    longitude: p.longitude ?? 0,
    coordinates: { lat: p.latitude ?? 0, lng: p.longitude ?? 0 },
    pincode: "",
    district: "",
    state: "",
    phone: "",
    officer: "",
    supportedSchemes: [],
  };
}

export default function PartnerLocator() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [dismissedSchemePrompt, setDismissedSchemePrompt] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null,
  );
  const [mobileTab, setMobileTab] = useState<"both" | "map" | "list">("both");

  const listContainerRef = useRef<HTMLDivElement>(null);
  const requestedScheme = searchParams.get("scheme")?.trim() ?? "";
  const matchingScheme = SCHEME_OPTIONS.find(
    (scheme) => scheme.id.toLowerCase() === requestedScheme.toLowerCase(),
  );
  const selectedSchemeId = matchingScheme?.id ?? "";
  const showLocationPrompt = Boolean(
    matchingScheme && dismissedSchemePrompt !== matchingScheme.id,
  );

  const handleSchemeSelection = (schemeId: string) => {
    setDismissedSchemePrompt(null);
    router.replace(`${pathname}?scheme=${encodeURIComponent(schemeId)}`, {
      scroll: false,
    });
  };

  const locationRequest: NearbyPartnersRequest | null = userCoords
    ? {
        citizenLat: userCoords.lat,
        citizenLng: userCoords.lng,
        limit: 20,
      }
    : null;

  const {
    data: partnersResponse,
    isLoading: isLoadingPartners,
    isError: isPartnersError,
    error: partnersError,
  } = useNearbyPartners(selectedSchemeId || undefined, locationRequest, {
    enabled: Boolean(userCoords && selectedSchemeId),
  });

  const rawPartners: ScoredPartner[] = partnersResponse?.data?.partners ?? [];
  const mapPartners = rawPartners
    .filter(
      (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
    )
    .map(toMapPartner);

  const activeMapPartner =
    mapPartners.find((p) => p.id === selectedPartnerId) ??
    mapPartners[0] ??
    null;

  const handleUseMyLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoError(
        "Geolocation is not supported by your browser. Please search for a city or area instead.",
      );
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLabel("Using your current location");
        setSelectedPartnerId(null);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            "Location access was denied. You can search for a city or area instead.",
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoError(
            "Your location could not be determined. Please search for your area instead.",
          );
        } else if (err.code === err.TIMEOUT) {
          setGeoError(
            "We couldn't get your location right now. Please try again or search for your area.",
          );
        } else {
          setGeoError(
            "Location access failed. Please search for your area instead.",
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const handleSelectFromMap = useCallback(
    (partner: ReturnType<typeof toMapPartner>) => {
      setSelectedPartnerId(partner.id);
      const cardEl = document.getElementById(`partner-card-${partner.id}`);
      if (cardEl && listContainerRef.current) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    [],
  );

  const hasLocation = userCoords !== null;
  const hasScheme = selectedSchemeId !== "";
  const readyToQuery = hasLocation && hasScheme;

  return (
    <div className="space-y-6">
      {showLocationPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-prompt-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/50 text-secondary">
                <Icon name="my_location" className="h-5 w-5" />
              </div>
              <div>
                <h2 id="location-prompt-title" className="text-lg font-bold text-primary">
                  Find nearby partners
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  Your recommended scheme is selected. Click <strong>Use My Location</strong> to find authorized partners near you.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDismissedSchemePrompt(matchingScheme?.id ?? null)}
                className="rounded-xl border border-outline-variant px-3.5 py-2 text-xs font-bold text-on-surface hover:bg-surface transition-colors"
              >
                Choose Later
              </button>
              <button
                type="button"
                onClick={() => {
                  setDismissedSchemePrompt(matchingScheme?.id ?? null);
                  handleUseMyLocation();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white transition-colors hover:opacity-95"
              >
                <Icon name="my_location" className="h-3.5 w-3.5" />
                Use My Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">
            Authorized Channel Partner &amp; Bank Desk Locator
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Locate nearest Public Sector Bank branches, Gramin banks, and CSC
            digital assistance nodes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-secondary-container/30 text-xs font-bold text-primary transition-all flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            title="Detect via device GPS — your location is used only to find nearby partner agencies"
          >
            <Icon
              name="my_location"
              className={`w-3.5 h-3.5 text-secondary ${isLocating ? "animate-spin" : ""}`}
            />
            <span>
              {isLocating ? "Getting your location…" : "Use My Location"}
            </span>
          </button>

          {locationLabel && (
            <span className="flex items-center gap-1 text-[11px] text-secondary font-semibold bg-secondary-container/30 px-2.5 py-1.5 rounded-full border border-secondary-container/50">
              <Icon name="my_location" className="w-3 h-3" />
              {locationLabel}
            </span>
          )}
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-[11px] text-on-surface-variant bg-surface-container px-3 py-2 rounded-xl border border-outline-variant/40 w-fit">
        🔒 Your location is used only to find nearby authorized partner agencies
        and is not stored.
      </p>

      {/* Geolocation error */}
      {geoError && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-xl bg-error-container/20 border border-error/30 text-xs text-on-error-container"
        >
          <Icon
            name="location_off"
            className="w-4 h-4 shrink-0 mt-0.5 text-error"
          />
          <span>{geoError}</span>
        </div>
      )}

      {/* Scheme selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-xs font-bold text-on-surface-variant shrink-0">
          Select Scheme to find authorized partners:
        </label>
        <div className="flex flex-wrap gap-2">
          {SCHEME_OPTIONS.map((scheme) => (
            <button
              key={scheme.id}
              type="button"
              onClick={() => {
                handleSchemeSelection(scheme.id);
                setSelectedPartnerId(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedSchemeId === scheme.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-secondary-container/30"
              }`}
            >
              {scheme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt: no location yet */}
      {!hasLocation && (
        <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xs">
          <Icon
            name="location_searching"
            className="w-10 h-10 text-outline mb-3 mx-auto"
          />
          <p className="font-bold text-primary text-sm">No location selected</p>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed max-w-sm mx-auto">
            Click <strong>Use My Location</strong> to detect your position and
            find nearby partners.
          </p>
        </div>
      )}

      {/* Prompt: location set but no scheme yet */}
      {hasLocation && !hasScheme && (
        <div className="p-6 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xs">
          <Icon name="category" className="w-9 h-9 text-outline mb-2 mx-auto" />
          <p className="font-bold text-primary text-sm">
            Select a scheme above
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Select a scheme to find authorized nearby channel partners for that
            programme.
          </p>
        </div>
      )}

      {/* Mobile view toggle */}
      {readyToQuery && (
        <div className="flex lg:hidden rounded-xl border border-outline-variant/60 bg-surface-container p-0.5 text-xs font-bold w-fit">
          {(["both", "map", "list"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mobileTab === tab
                  ? "bg-primary text-white shadow-xs"
                  : "text-on-surface"
              }`}
            >
              {tab === "both"
                ? "Split"
                : tab === "map"
                  ? "Map View"
                  : "List View"}
            </button>
          ))}
        </div>
      )}

      {/* Main list + map layout */}
      {readyToQuery && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Partner list */}
          <div
            ref={listContainerRef}
            className={`space-y-3.5 max-h-[620px] overflow-y-auto pr-1 lg:col-span-5 ${
              mobileTab === "map" ? "hidden lg:block" : "block"
            }`}
          >
            {isLoadingPartners && (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-on-surface-variant">
                  Searching for nearby authorized partners…
                </p>
              </div>
            )}

            {isPartnersError && !isLoadingPartners && (
              <div className="p-6 rounded-2xl bg-error-container/20 border border-error/30 text-center">
                <Icon
                  name="error_outline"
                  className="w-8 h-8 text-error mx-auto mb-2"
                />
                <p className="text-xs font-bold text-on-error-container">
                  {partnersError?.message ||
                    "Could not load nearby partners. Please try again."}
                </p>
              </div>
            )}

            {!isLoadingPartners &&
              !isPartnersError &&
              mapPartners.length === 0 && (
                <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xs">
                  <Icon
                    name="location_off"
                    className="w-10 h-10 text-outline mb-2 mx-auto"
                  />
                  <p className="font-bold text-primary text-sm">
                    No authorized channel partners found nearby.
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Try searching a different area or selecting another scheme.
                  </p>
                </div>
              )}

            {!isLoadingPartners &&
              mapPartners.map((partner) => {
                const isSelected = activeMapPartner?.id === partner.id;
                const directionsUrl =
                  partner.latitude && partner.longitude
                    ? `https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`
                    : "#";

                return (
                  <div
                    key={partner.id}
                    id={`partner-card-${partner.id}`}
                    onClick={() => {
                      setSelectedPartnerId(partner.id);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-secondary-container/20 shadow-md ring-1 ring-primary/30"
                        : "border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                              partner.type === "PSU Bank"
                                ? "bg-primary-fixed text-on-primary-fixed"
                                : partner.type === "Rural Gramin Bank"
                                  ? "bg-secondary-container text-on-secondary-container"
                                  : "bg-tertiary-fixed text-on-tertiary-fixed"
                            }`}
                          >
                            {partner.type || "Partner"}
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
                        {partner.address && (
                          <p className="text-xs text-on-surface-variant mt-1 flex items-start gap-1">
                            <Icon
                              name="pin_drop"
                              className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5"
                            />
                            <span>{partner.address}</span>
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-secondary bg-surface-container px-2 py-1 rounded shrink-0 shadow-xs">
                        {partner.distance}
                      </span>
                    </div>

                    {directionsUrl !== "#" && (
                      <div className="mt-3 pt-2 border-t border-outline-variant/20">
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-1.5 px-3 rounded-lg border border-outline-variant bg-surface text-[11px] font-bold text-secondary hover:text-primary hover:bg-surface-container transition-colors flex items-center gap-1 w-fit"
                        >
                          <span>Get Directions</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Map */}
          <div
            className={`lg:col-span-7 h-[480px] lg:h-[620px] sticky top-4 ${
              mobileTab === "list" ? "hidden lg:block" : "block"
            }`}
          >
            <PartnerMap
              partners={mapPartners as any}
              selectedPartner={activeMapPartner as any}
              onSelectPartner={handleSelectFromMap as any}
              onViewDetails={() => {}}
              userLocation={userCoords}
              onUseMyLocation={handleUseMyLocation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
