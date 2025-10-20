import { useEffect, useState } from 'react';

interface GoogleMapsLoaderResult {
  isLoaded: boolean;
  error: string | null;
}

export const useGoogleMapsLoader = (): GoogleMapsLoaderResult => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError('Google Maps API key is not configured');
      return;
    }

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
    if (existingScript) {
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setError('Google Maps loaded but not properly initialized');
        }
      }, 100);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps API');
    };

    window.gm_authFailure = () => {
      setError('Google Maps API authentication failed');
    };

    document.head.appendChild(script);

    return () => {
      window.gm_authFailure = () => { };
    };
  }, []);

  return { isLoaded, error };
};