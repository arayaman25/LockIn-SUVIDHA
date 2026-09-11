'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Partner } from '@/lib/data';

interface PartnerMapProps {
  partners: Partner[];
  selectedPartner: Partner | null;
  onSelectPartner: (partner: Partner) => void;
  onViewDetails: (partner: Partner) => void;
  userLocation?: { lat: number; lng: number } | null;
  onUseMyLocation?: () => void;
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
  onViewDetails,
  userLocation,
  onUseMyLocation,
}: PartnerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  const onViewDetailsRef = useRef(onViewDetails);
  const onSelectPartnerRef = useRef(onSelectPartner);
  const onUseMyLocationRef = useRef(onUseMyLocation);
  const userLocationRef = useRef(userLocation);

  useEffect(() => {
    onViewDetailsRef.current = onViewDetails;
    onSelectPartnerRef.current = onSelectPartner;
    onUseMyLocationRef.current = onUseMyLocation;
    userLocationRef.current = userLocation;
  }, [onViewDetails, onSelectPartner, onUseMyLocation, userLocation]);

  // Initial geographic center — neutral center of India.
  // The map will pan to the user's actual location as soon as userLocation is set.
  // Never default to Varanasi or any other specific city.
  const initialCenterRef = useRef({
    lat: partners[0]?.latitude ?? 20.5937,
    lng: partners[0]?.longitude ?? 78.9629,
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

  // Update Markers when partners, selectedPartner, or map changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markerMapRef.current.clear();

    if (partners.length === 0) return;

    partners.forEach((partner) => {
      const isSelected = selectedPartner?.id === partner.id;
      const icon = createPartnerPinIcon(partner.type, isSelected);

      const marker = L.marker([partner.latitude, partner.longitude], {
        icon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      // Minimal standard popup containing ONLY:
      // - Partner Name
      // - Partner Type
      // - Distance
      // - [View Details] button
      const popupDiv = document.createElement('div');
      popupDiv.style.fontFamily = 'var(--font-sans, system-ui, sans-serif)';
      popupDiv.style.padding = '4px 2px 2px 2px';
      popupDiv.style.minWidth = '160px';
      popupDiv.style.maxWidth = '220px';

      popupDiv.innerHTML = `
        <div style="font-size: 11px; font-weight: 600; color: #5f6368; margin-bottom: 2px;">
          ${partner.type} • ${partner.distance}
        </div>
        <div style="font-size: 13px; font-weight: 700; color: #1b4332; line-height: 1.3; margin-bottom: 8px;">
          ${partner.name}
        </div>
        <button id="btn-popup-details-${partner.id}" style="width: 100%; padding: 6px 12px; background-color: #1b4332; color: #ffffff; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: opacity 0.15s ease;">
          View Details
        </button>
      `;

      // Attach button click listener
      const viewDetailsBtn = popupDiv.querySelector(`#btn-popup-details-${partner.id}`);
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onViewDetailsRef.current(partner);
        });
      }

      marker.bindPopup(popupDiv, {
        closeButton: true,
        className: 'standard-clean-popup',
        maxWidth: 240,
      });

      // Clicking marker synchronizes selection and highlights partner list
      marker.on('click', () => {
        onSelectPartnerRef.current(partner);
      });

      marker.addTo(markersLayer);
      markerMapRef.current.set(partner.id, marker);
    });

    // If there is an active selected partner, open its popup
    if (selectedPartner) {
      const activeMarker = markerMapRef.current.get(selectedPartner.id);
      if (activeMarker) {
        activeMarker.openPopup();
      }
    }
  }, [partners, selectedPartner]);

  // Center map on selectedPartner and open its popup
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPartner) return;

    map.setView([selectedPartner.latitude, selectedPartner.longitude], 15, {
      animate: true,
      duration: 0.6,
    });

    const marker = markerMapRef.current.get(selectedPartner.id);
    if (marker && !marker.isPopupOpen()) {
      marker.openPopup();
    }
  }, [selectedPartner]);

  // Handle Standard Blue Location Dot
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        const marker = L.marker([userLocation.lat, userLocation.lng], {
          icon: createUserLocationDot(),
          zIndexOffset: 1200,
        });
        marker.addTo(map);
        userMarkerRef.current = marker;
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }

      map.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-outline-variant/60 shadow-civic bg-surface-container">
      {/* Real Interactive Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] lg:min-h-[620px] z-0" />
    </div>
  );
}
