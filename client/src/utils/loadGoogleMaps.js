// Lightweight Google Maps JS API loader with singleton Promise and async/defer
let googleMapsPromise = null;

export function loadGoogleMaps({ apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY, version = 'weekly', language, region } = {}) {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));

  // Already loaded
  if (window.google && window.google.maps && typeof window.google.maps.importLibrary === 'function') {
    return Promise.resolve(window.google);
  }

  // Existing in-flight promise
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    try {
      const existing = document.getElementById('google-maps-js');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google));
        existing.addEventListener('error', (e) => reject(e));
        return;
      }

      const params = new URLSearchParams({ key: apiKey, v: version });
      if (language) params.set('language', language);
      if (region) params.set('region', region);
      // Do NOT add callback param; we'll use importLibrary
      const script = document.createElement('script');
      script.id = 'google-maps-js';
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps) {
          resolve(window.google);
        } else {
          reject(new Error('Google Maps API loaded but window.google.maps is undefined'));
        }
      };
      script.onerror = (e) => reject(e);

      document.head.appendChild(script);
    } catch (err) {
      reject(err);
    }
  });

  return googleMapsPromise;
}
