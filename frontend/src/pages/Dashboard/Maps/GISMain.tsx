// components/GISMain.tsx
import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Search, BarChart3 } from 'lucide-react';
import { useGoogleMapsLoader } from '@/services/api/useGoogleMapsLoader';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Typography } from '@/components/atoms/typography';
import { Button } from '@/components/atoms/button';

const GISMain: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
        center: { lat: 10.7868, lng: 122.5894 }, // Leganes, Iloilo coordinates
        mapTypeId: 'satellite',
        mapTypeControl: false,
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }]
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }]
          }
        ]
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
              title: 'Your Location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#dc2626', // Red color
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }
            });
            setMarker(userMarker);
          },
          (error) => {
            console.warn('Error getting location: ' + error.message);
            // Fallback to Leganes center
            googleMap.setCenter({ lat: 10.7868, lng: 122.5894 });
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
        fields: ['geometry', 'name', 'formatted_address'],
        componentRestrictions: { country: 'ph' }
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
          title: place.name || 'Selected Location',
          animation: google.maps.Animation.DROP
        });
        setMarker(newMarker);
      });

      setAutocomplete(autocompleteInstance);
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
    }
  };

  const handleFullAnalysisClick = () => {
    const gisDetailsUrl = `${window.location.origin}/satelite-map/summary`;
    window.open(gisDetailsUrl, '_blank');
  };

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto mt-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
          <X size={24} />
          <div>
            <h3 className="font-semibold">Google Maps Error</h3>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2 dark:text-red-300">
              Please check your API key is valid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col ">
      {/* Header */}
      <Card className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 sm:space-y-4 lg:space-y-0 mb-4 sm:mb-6 md:mb-8 p-4 sm:p-6 border-b">
        <div className="flex-1">
          <CardTitle>
            <Typography variant="h3" as="h3" weight="bold" className="pl-0 sm:pl-5 mb-2 text-lg sm:text-xl md:text-2xl text-foreground">
              Leganes Business Map
            </Typography>
          </CardTitle>
          <CardDescription className='ml-0 sm:ml-5 text-xs sm:text-sm text-muted-foreground'>
            View the geographical distribution of registered businesses in Leganes and monitor their compliance status in real time.
          </CardDescription>
        </div>

        <Button
          variant='primary'
          onClick={handleFullAnalysisClick}
          className="mt-4 lg:mt-0 px-6 py-2  rounded-md transition-colors flex items-center gap-2"
        >
          <BarChart3 size={18} />
          Full Analysis
        </Button>
      </Card>

      {/* Controls Card */}
      <Card className="mx-4 mb-4 border shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-3">
            <MapPin size={24} className="text-primary" />
            <div>
              <Typography variant="h4" as="h2" weight="semibold" className="text-foreground">
                Interactive Map
              </Typography>
              <Typography variant="p" as="p" className="text-muted-foreground">
                Explore business locations and compliance data
              </Typography>
            </div>
          </div>

        </div>
      </Card>

      {/* Map Container */}
      <div className="flex-1 relative mx-7 mb-4 border ">
        {/* Search Box Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative mt-4">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              id="pac-input"
              type="text"
              placeholder="Search for places..."
              className="pl-10 pr-4 py-2 w-80 border border-input rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Map */}
        <div
          ref={mapRef}
          className="w-full h-full rounded-lg"
        />

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-background/80 dark:bg-background/90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <Typography variant="h1" as="p" className="mt-4 text-muted-foreground">
                Loading Maps...
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GISMain;