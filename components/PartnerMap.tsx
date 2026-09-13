'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Partner } from '@/lib/data';
import { googleMapsDirectionsUrl } from '@/src/lib/directions';

interface PartnerMapProps {
  partners: Partner[];
  selectedPartner: Partner | null;
  onSelectPartner: (partner: Partner) => void;
  userLocation?: { lat: number; lng: number } | null;
  onUseMyLocation?: () => void;
  /**
   * Bump to re-center on the selected partner even when the selection did
   * not change (e.g. the user panned away and clicked the same card again).
   */
  focusRequestId?: number;
}

// Muted, professional marker colors for partner types
const TYPE_COLORS: Record<string, string> = {
  'PSU Bank': '#1b4332',
  'Rural Gramin Bank': '#3f665c',
  'CSC Center': '#c25e00',
};

// Standard clean Google-Maps-style teardrop location pin
const createPartnerPinIcon = (type: string, isSelected: boolean) => {
  const color = TYPE_COLORS[type] || '#1b4332';
  const width = isSelected ? 30 : 22;
  const height = isSelected ? 40 : 30;

  const html = `
    <div style="width: ${width}px; height: ${height}px; transition: transform 0.15s ease;">
      <svg width="${width}" height="${height}" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 ${isSelected ? '3px 5px' : '2px 3px'} rgba(0,0,0,${isSelected ? '0.45' : '0.28'}));">
        <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12C0.5 20.5 12 33.5 12 33.5C12 33.5 23.5 20.5 23.5 12C23.5 5.65 18.35 0.5 12 0.5Z" fill="${color}" stroke="#ffffff" stroke-width="${isSelected ? '1.8' : '1.2'}"/>
        <circle cx="12" cy="11.5" r="${isSelected ? '4' : '3'}" fill="#ffffff"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'clean-partner-pin',
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 4],
  });
};

// Standard Google-Maps-style blue location dot for user location
const createUserLocationDot = () => {
  const html = `
    <div style="position: relative; width: 22px; height: 22px; display: flex; items-center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 50%; background-color: rgba(26, 115, 232, 0.22);"></div>
      <div style="position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; border-radius: 50%; background-color: #1a73e8; border: 2.5px solid #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.35);"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'google-style-user-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

export default function PartnerMap({
  partners,
  selectedPartner,
  onSelectPartner,
  userLocation,
  onUseMyLocation,
  focusRequestId = 0,
}: PartnerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  const onSelectPartnerRef = useRef(onSelectPartner);
  const onUseMyLocationRef = useRef(onUseMyLocation);
  const userLocationRef = useRef(userLocation);
  const partnersRef = useRef(partners);

  useEffect(() => {
    onSelectPartnerRef.current = onSelectPartner;
    onUseMyLocationRef.current = onUseMyLocation;
    userLocationRef.current = userLocation;
    partnersRef.current = partners;
  }, [onSelectPartner, onUseMyLocation, userLocation, partners]);

  // Callers typically rebuild `partners`, `selectedPartner` and `userLocation`
  // as fresh objects on every render. Effects below key on these primitive
  // values instead, so a re-render never re-runs map moves — previously the
  // user-location effect re-fired after every card click and snapped the map
  // back to the user, undoing the focus on the clicked partner.
  const partnersKey = partners
    .map((p) => `${p.id}:${p.latitude}:${p.longitude}`)
    .join('|');
  const selectedId = selectedPartner?.id ?? null;
  const selectedLat = selectedPartner?.latitude;
  const selectedLng = selectedPartner?.longitude;
  const userLat = userLocation?.lat;
  const userLng = userLocation?.lng;

  // Initial geographic center
  const initialCenterRef = useRef({
    lat: partners[0]?.latitude ?? 25.334,
    lng: partners[0]?.longitude ?? 82.998,
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const { lat, lng } = initialCenterRef.current;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: false,
    });

    // Clean, light, familiar OpenStreetMap tile layer with standard geographic labels
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Minimal standard controls in normal position (top-right)
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add minimal standard "Current Location" button control
    const LocateControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const btn = L.DomUtil.create('a', 'leaflet-control-locate', container);
        btn.href = '#';
        btn.title = 'Show your current location';
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', 'Current Location');
        btn.style.width = '30px';
        btn.style.height = '30px';
        btn.style.lineHeight = '30px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.backgroundColor = '#ffffff';
        btn.style.cursor = 'pointer';

        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3c4043" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="7"/>
            <line x1="12" y1="1" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="1" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="23" y2="12"/>
          </svg>
        `;

        L.DomEvent.disableClickPropagation(btn);
        L.DomEvent.on(btn, 'click', (e) => {
          L.DomEvent.preventDefault(e);
          if (userLocationRef.current) {
            map.setView([userLocationRef.current.lat, userLocationRef.current.lng], 15, { animate: true });
          } else if (onUseMyLocationRef.current) {
            onUseMyLocationRef.current();
          }
        });

        return container;
      },
    });

    new LocateControl().addTo(map);

    // Layer group for partner markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Rebuild markers only when the partner set or the selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markerMapRef.current.clear();

    partnersRef.current.forEach((partner) => {
      const isSelected = selectedId === partner.id;
      const icon = createPartnerPinIcon(partner.type, isSelected);

      const marker = L.marker([partner.latitude, partner.longitude], {
        icon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      // Popup: type • distance, name, and a Get Directions link. Built with
      // DOM APIs rather than innerHTML so partner text is never parsed as HTML.
      const popupDiv = document.createElement('div');
      popupDiv.style.fontFamily = 'var(--font-sans, system-ui, sans-serif)';
      popupDiv.style.padding = '4px 2px 2px 2px';
      popupDiv.style.minWidth = '160px';
      popupDiv.style.maxWidth = '220px';

      const meta = document.createElement('div');
      meta.style.cssText = 'font-size: 11px; font-weight: 600; color: #5f6368; margin-bottom: 2px;';
      meta.textContent = [partner.type, partner.distance].filter(Boolean).join(' • ');

      const name = document.createElement('div');
      name.style.cssText = 'font-size: 13px; font-weight: 700; color: #1b4332; line-height: 1.3; margin-bottom: 8px;';
      name.textContent = partner.name;

      const directions = document.createElement('a');
      directions.href = googleMapsDirectionsUrl(partner.latitude, partner.longitude);
      directions.target = '_blank';
      directions.rel = 'noopener noreferrer';
      directions.textContent = 'Get Directions ↗';
      directions.style.cssText =
        'display: block; width: 100%; box-sizing: border-box; padding: 6px 12px; background-color: #1b4332; color: #ffffff; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; text-decoration: none;';

      popupDiv.append(meta, name, directions);

      marker.bindPopup(popupDiv, {
        closeButton: true,
        className: 'standard-clean-popup',
        maxWidth: 240,
        // The map is already centred on the selected marker; auto-panning to
        // fit the popup would nudge it off-centre mid-animation.
        autoPan: false,
      });

      // Clicking marker synchronizes selection and highlights partner list
      marker.on('click', () => {
        onSelectPartnerRef.current(partner);
      });

      marker.addTo(markersLayer);
      markerMapRef.current.set(partner.id, marker);
    });

    if (selectedId) {
      markerMapRef.current.get(selectedId)?.openPopup();
    }
  }, [partnersKey, selectedId]);

  // Center map on the selected partner (and on explicit re-focus requests)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedId || selectedLat === undefined || selectedLng === undefined) return;

    map.setView([selectedLat, selectedLng], Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.6,
    });

    const marker = markerMapRef.current.get(selectedId);
    if (marker && !marker.isPopupOpen()) {
      marker.openPopup();
    }
  }, [selectedId, selectedLat, selectedLng, focusRequestId]);

  // Blue location dot; recentres only when the coordinates actually change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLat !== undefined && userLng !== undefined) {
      if (!userMarkerRef.current) {
        const marker = L.marker([userLat, userLng], {
          icon: createUserLocationDot(),
          zIndexOffset: 1200,
        });
        marker.addTo(map);
        userMarkerRef.current = marker;
      } else {
        userMarkerRef.current.setLatLng([userLat, userLng]);
      }

      map.setView([userLat, userLng], 14, { animate: true });
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userLat, userLng]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-outline-variant/60 shadow-civic bg-surface-container">
      {/* Real Interactive Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] lg:min-h-[620px] z-0" />
    </div>
  );
}
