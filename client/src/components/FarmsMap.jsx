import { useEffect, useRef } from 'react';

// Add your Google Maps API key below
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

const FarmsMap = ({ farms, userLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.google && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else if (window.google) {
      initMap();
    }
    // eslint-disable-next-line
  }, [farms, userLocation]);

  function initMap() {
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
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lon },
        map: mapInstance.current,
        title: 'Your Location',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
        animation: window.google.maps.Animation.DROP,
      });
    }
    // Farm markers
    farms.forEach(farm => {
      // Add null check and type validation for coordinates
      if (farm.location && Array.isArray(farm.location.coordinates) && farm.location.coordinates.length === 2) {
        try {
          const [lng, lat] = farm.location.coordinates;
          // Validate coordinates are numbers and within valid ranges
          if (typeof lat === 'number' && typeof lng === 'number' &&
              lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstance.current,
              title: farm.name,
              icon: {
                url: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
                scaledSize: new window.google.maps.Size(36, 36),
              },
              animation: window.google.maps.Animation.DROP,
            });
            const info = new window.google.maps.InfoWindow({
              content: `<div style='font-family:sans-serif'><strong>${farm.name}</strong><br/>${farm.address || ''}</div>`
            });
            marker.addListener('click', () => info.open(mapInstance.current, marker));
          } else {
            console.warn('Invalid coordinates for farm:', farm.name, { lat, lng });
          }
        } catch (error) {
          console.warn('Error processing farm location:', farm.name, error);
        }
      } else {
        console.warn('Missing or invalid location data for farm:', farm.name);
      }
    });
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
