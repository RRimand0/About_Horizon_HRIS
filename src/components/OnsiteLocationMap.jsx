import { useEffect, useRef, useState } from 'react';
import { ExternalLink, MapPin, MousePointer2 } from 'lucide-react';
import { ONSITE_RADIUS_KM, SERVICE_CENTER, straightLineDistanceKm } from '../utils/onsiteDistance.js';

// Public browser key: restrict it to the exact website domains and Maps JavaScript API.
// This must NEVER be the same unrestricted credential used by PHP for server geocoding.
const BROWSER_KEY = (import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY || '').trim();
let mapsLoading = null;

function loadGoogleMaps() {
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps);
  if (mapsLoading) return mapsLoading;

  mapsLoading = new Promise((resolve, reject) => {
    const callbackName = '__horizonDemoMapLoaded';
    const script = document.createElement('script');
    let settled = false;
    const timeout = window.setTimeout(() => finish(new Error('Map loading timed out.')), 15000);
    function finish(error) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      delete window[callbackName];
      if (error) {
        script.remove();
        reject(error);
      } else if (window.google?.maps?.importLibrary) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps could not initialize.'));
      }
    }
    window[callbackName] = () => finish(null);
    script.onerror = () => finish(new Error('Map service unavailable.'));
    const params = new URLSearchParams({ key: BROWSER_KEY, v: 'weekly', loading: 'async', callback: callbackName, region: 'PH', language: 'en' });
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    document.head.appendChild(script);
  }).catch((error) => {
    mapsLoading = null; // Allow a subsequent retry on mount.
    throw error;
  });
  return mapsLoading;
}

export default function OnsiteLocationMap({ onPick, selected }) {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const onPickRef = useRef(onPick);
  const [state, setState] = useState({ status: BROWSER_KEY ? 'loading' : 'unconfigured', message: '' });
  const [selection, setSelection] = useState(selected || null);
  useEffect(() => { onPickRef.current = onPick; }, [onPick]);
  useEffect(() => {
    setSelection(selected || null);
    if (selected?.point) {
      pinRef.current?.setCenter(selected.point);
      pinRef.current?.setVisible(true);
    } else {
      pinRef.current?.setVisible(false);
    }
  }, [selected]);

  useEffect(() => {
    if (!BROWSER_KEY || !containerRef.current) return undefined;
    let current = true;
    let currentSequence = 0;
    let clickListener = null;
    let map = null;
    let serviceCircle = null;
    let pinCircle = null;

    async function initialize() {
      try {
        const maps = await loadGoogleMaps();
        const [{ Map }, { Geocoder }] = await Promise.all([
          maps.importLibrary('maps'),
          maps.importLibrary('geocoding'),
        ]);
        if (!current || !containerRef.current) return;
        map = new Map(containerRef.current, {
          center: SERVICE_CENTER,
          zoom: 7,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          clickableIcons: false,
          gestureHandling: 'cooperative',
          restriction: {
            latLngBounds: { north: 14, south: 4, west: 118, east: 129 },
            strictBounds: false,
          },
        });
        serviceCircle = new maps.Circle({
          map,
          center: SERVICE_CENTER,
          radius: ONSITE_RADIUS_KM * 1000,
          strokeColor: '#F46B17',
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: '#F46B17',
          fillOpacity: 0.09,
          clickable: false,
        });
        pinCircle = new maps.Circle({
          map,
          center: selected?.point || SERVICE_CENTER,
          radius: 250,
          strokeColor: '#17201b',
          strokeOpacity: 0.95,
          strokeWeight: 2,
          fillColor: '#F46B17',
          fillOpacity: 0.9,
          clickable: false,
          visible: Boolean(selected?.point),
        });
        pinRef.current = pinCircle;
        const geocoder = new Geocoder();
        clickListener = map.addListener('click', async ({ latLng }) => {
          if (!latLng || !current) return;
          const sequence = ++currentSequence;
          const point = { lat: latLng.lat(), lng: latLng.lng() };
          const distanceKm = straightLineDistanceKm(SERVICE_CENTER, point);
          const withinRange = Number.isFinite(distanceKm) && distanceKm <= ONSITE_RADIUS_KM;
          pinCircle.setCenter(point);
          pinCircle.setVisible(true);
          setSelection({ point, distanceKm, withinRange, address: '' });
          setState({ status: 'locating', message: 'Finding the address for your pin…' });
          try {
            const response = await geocoder.geocode({ location: point, region: 'ph' });
            if (!current || sequence !== currentSequence) return;
            const address = response.results?.[0]?.formatted_address || '';
            const chosen = { point, distanceKm, withinRange, address };
            setSelection(chosen);
            onPickRef.current(chosen);
            setState({
              status: 'ready',
              message: address ? 'Address filled from the map. Confirm the exact building below.' : 'Enter the complete meeting address below.',
            });
          } catch (_error) {
            if (!current || sequence !== currentSequence) return;
            const chosen = { point, distanceKm, withinRange, address: '' };
            setSelection(chosen);
            onPickRef.current(chosen);
            setState({ status: 'ready', message: 'Address lookup failed. Enter the full address below.' });
          }
        });
        setState({ status: 'ready', message: 'Tap the map to select a meeting location.' });
      } catch (_error) {
        if (current) setState({ status: 'error', message: 'The map could not load. You can still type the meeting address below.' });
      }
    }
    initialize();
    return () => {
      current = false;
      currentSequence += 1;
      clickListener?.remove();
      pinCircle?.setMap(null);
      pinRef.current = null;
      serviceCircle?.setMap(null);
      map = null;
    };
    // The map is initialized once when the onsite section mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="onsite-location-map mt-4 overflow-hidden rounded-xl border border-[#e4dfd8] bg-[#faf8f4]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4dfd8] px-4 py-3">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-[#252925]"><MapPin size={17} className="text-brand" aria-hidden="true" /> Select a meeting location</p>
        <span className="rounded-full bg-[#ffe8d5] px-3 py-1 text-[11px] font-semibold text-[#9b4716]">200 km from Cagayan de Oro</span>
      </div>
      {BROWSER_KEY ? (
        <div className="relative">
          <div ref={containerRef} aria-label="Interactive map centered on Cagayan de Oro. Tap to choose a meeting location." className="h-[270px] w-full sm:h-[345px]" />
          {state.status === 'loading' && <p className="absolute inset-0 flex items-center justify-center bg-white/90 text-[13px] text-muted">Loading map…</p>}
        </div>
      ) : (
        <div className="flex min-h-[170px] flex-col items-center justify-center gap-2 px-5 py-6 text-center">
          <MousePointer2 size={24} className="text-[#af6438]" aria-hidden="true" />
          <p className="text-[13px] font-semibold text-ink">Map picker is ready for configuration</p>
          <p className="max-w-[340px] text-[12px] leading-5 text-muted">Add a website-restricted Google Maps key to enable pin selection. You can still enter the meeting address manually.</p>
          <a href="https://www.google.com/maps/@8.477,124.642,9z" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#a8420a] underline underline-offset-4">View Cagayan de Oro on Google Maps <ExternalLink size={13} aria-hidden="true" /></a>
        </div>
      )}
      <div className="px-4 py-3">
        {selection?.point && Number.isFinite(selection.distanceKm) && (
          <p className={`mb-1 text-[12px] font-semibold ${selection.withinRange ? 'text-[#316a3c]' : 'text-red-700'}`} role="status">
            {Math.round(selection.distanceKm)} km straight-line from Cagayan de Oro — {selection.withinRange ? 'inside the service area' : 'outside the 200 km limit'}
          </p>
        )}
        <p className="text-[11px] leading-5 text-[#656761]" aria-live="polite">
          {state.message || 'The orange circle shows approximate coverage. Final distance is checked by the server against your full address.'}
        </p>
        <p className="mt-1 text-[11px] leading-5 text-[#81837c]">Map distance is an estimate, not a booking confirmation. Road or ferry travel may be longer.</p>
      </div>
    </div>
  );
}
