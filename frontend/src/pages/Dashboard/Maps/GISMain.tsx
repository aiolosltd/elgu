// components/GISMain.tsx
import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Search } from 'lucide-react';
import GISDetails from './GISDetails';
import { useGoogleMapsLoader } from '@/services/useGoogleMapsLoader';
import { Card } from '@/components/atoms/card';
import { Typography } from '@/components/atoms/typography';

const GISMain: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, error } = useGoogleMapsLoader();

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      loadGoogleMap();
    }
  }, [isLoaded]);

  const loadGoogleMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const googleMap = new google.maps.Map(mapRef.current, {
        zoom: 15,
        center: { lat: 14.5995, lng: 120.9842 },
        mapTypeId: 'satellite',
        mapTypeControl: false
      });

      setMap(googleMap);

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            googleMap.setCenter(userLocation);

            const userMarker = new google.maps.Marker({
              position: userLocation,
              map: googleMap,
              title: 'Your Location'
            });
            setMarker(userMarker);
          },
          (error) => {
            console.warn('Error getting location: ' + error.message);
          }
        );
      }

      // Initialize autocomplete
      initializeAutocomplete(googleMap);
    } catch (err) {
      console.error('Error initializing Google Maps:', err);
    }
  };

  const initializeAutocomplete = (googleMap: google.maps.Map) => {
    if (!searchInputRef.current) return;

    try {
      const autocompleteInstance = new google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['geocode', 'establishment'],
        fields: ['geometry', 'name', 'formatted_address']
      });

      autocompleteInstance.bindTo('bounds', googleMap);

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();

        if (!place.geometry || !place.geometry.location) {
          alert('No details available for input: ' + place.name);
          return;
        }

        googleMap.setCenter(place.geometry.location);
        googleMap.setZoom(17);

        // Remove existing marker
        if (marker) {
          marker.setMap(null);
        }

        // Add new marker
        const newMarker = new google.maps.Marker({
          map: googleMap,
          position: place.geometry.location,
          title: place.name || 'Selected Location'
        });
        setMarker(newMarker);
      });

      setAutocomplete(autocompleteInstance);
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
    }
  };

  const handleSummaryClick = () => {
    setDetailsOpen(true);
  };

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto mt-10 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3 text-red-800">
          <X size={24} />
          <div>
            <h3 className="font-semibold">Google Maps Error</h3>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2">
              Please check your API key in the .env file and ensure it's valid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Card variant="default" padding="lg" className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-5">
        <div>
          <Typography variant="h1" as="h1" weight="bold" className="text-2xl text-gray-900 mb-1">
            Leganes Business Map
          </Typography>
          <Typography variant="p" className="text-gray-600">
            View the geographical distribution of registered businesses in Leganes and monitor their compliance status in real time.
          </Typography>


        </div>
        <div className="flex items-center space-x-3">
          {/* Download Dropdown */}


        </div>
      </Card>

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MapPin size={24} className="text-blue-600" />
            GIS Application
          </h1>
          <button
            onClick={handleSummaryClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Summary
          </button>
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Search Box */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              id="pac-input"
              type="text"
              placeholder="Search for places..."
              className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Map */}
        <div
          ref={mapRef}
          className="w-full h-full"
        />

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading Maps...</p>
            </div>
          </div>
        )}
      </div>

      {/* Details Drawer */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setDetailsOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl">
            <GISDetails onClose={() => setDetailsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GISMain;