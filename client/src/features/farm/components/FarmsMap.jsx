import { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';

const FarmsMap = ({ farms, userLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await loadGoogleMaps();
        if (!cancelled) initMap();
      } catch (e) {
        console.error('Maps load failed', e);
      }
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [farms, userLocation]);

  async function initMap() {
    if (!mapRef.current) return;
    if (!window.google) return;
    if (mapInstance.current) return;
    const center = userLocation && userLocation.lat && userLocation.lon
      ? { lat: userLocation.lat, lng: userLocation.lon }
      : { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 10,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#e9f5e1' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#388e3c' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#a5d6a7' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b3e5fc' }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
    });
    // User marker
    if (userLocation && userLocation.lat && userLocation.lon) {
      try {
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');
        const el = document.createElement('div');
        el.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#3B82F6' width='24' height='24'><circle cx='12' cy='12' r='8' fill='#3B82F6'/><circle cx='12' cy='12' r='3' fill='white'/></svg>`;
        new AdvancedMarkerElement({ map: mapInstance.current, position: { lat: userLocation.lat, lng: userLocation.lon }, content: el, title: 'Your Location' });
      } catch (e) {
        new window.google.maps.Marker({ position: { lat: userLocation.lat, lng: userLocation.lon }, map: mapInstance.current, title: 'Your Location' });
      }
    }
    // Farm markers
  for (const farm of farms) {
      // Add null check and type validation for coordinates
      if (farm.location && Array.isArray(farm.location.coordinates) && farm.location.coordinates.length === 2) {
        try {
          const [lng, lat] = farm.location.coordinates;
          // Validate coordinates are numbers and within valid ranges
          if (typeof lat === 'number' && typeof lng === 'number' &&
              lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            try {
              const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');
              const el = document.createElement('div');
              el.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#EFCB73' width='32' height='32'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/></svg>`;
              const adv = new AdvancedMarkerElement({ map: mapInstance.current, position: { lat, lng }, content: el, title: farm.name });
              adv.addListener('gmp-click', () => {
                const info = new window.google.maps.InfoWindow({
                  content: `<div style='font-family:sans-serif'><strong>${farm.name}</strong><br/>${farm.address || ''}</div>`
                });
                info.open(mapInstance.current, adv);
              });
            } catch (e) {
              const marker = new window.google.maps.Marker({ position: { lat, lng }, map: mapInstance.current, title: farm.name });
              const info = new window.google.maps.InfoWindow({ content: `<div style='font-family:sans-serif'><strong>${farm.name}</strong><br/>${farm.address || ''}</div>` });
              marker.addListener('click', () => info.open(mapInstance.current, marker));
            }
          } else {
            console.warn('Invalid coordinates for farm:', farm.name, { lat, lng });
          }
        } catch (error) {
          console.warn('Error processing farm location:', farm.name, error);
        }
      } else {
        console.warn('Missing or invalid location data for farm:', farm.name);
      }
    }
  }

  return (
    <div className="relative w-full h-96 rounded-3xl border border-green-200 shadow-xl mb-8 overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      {/* Floating Legend */}
      <div className="absolute top-4 left-4 bg-white/90 rounded-xl shadow-lg px-4 py-2 flex items-center gap-4 z-20 border border-green-100">
        <span className="flex items-center gap-1 text-green-700 font-semibold"><img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Farm" className="w-6 h-6" /> Farm</span>
        <span className="flex items-center gap-1 text-amber-700 font-semibold"><svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-amber-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='#D97706' /></svg> You</span>
      </div>
    </div>
  );
};

export default FarmsMap;
