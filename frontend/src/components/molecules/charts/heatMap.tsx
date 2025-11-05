// components/molecules/charts/heatMap.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleMapsLoader } from '@/services/api/useGoogleMapsLoader';
import { useBusinessHeatmap } from '@/hooks/useBusinessHeatmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/atoms/typography';
import { MapPin, RefreshCw, ZoomIn, ZoomOut, Filter, AlertCircle } from 'lucide-react';

interface BusinessHeatmapProps {
  height?: number;
  showControls?: boolean;
  className?: string;
}

export const BusinessHeatmap: React.FC<BusinessHeatmapProps> = ({
  height = 400,
  showControls = true,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  
  const { isLoaded: isGoogleMapsLoaded, error: mapsError } = useGoogleMapsLoader();
  const { heatmapData, loading, error, refetch, leganesBoundary } = useBusinessHeatmap();

  // Enhanced debug logs
  useEffect(() => {
    console.log('🗺️ Google Maps Status:', {
      isLoaded: isGoogleMapsLoaded,
      mapsError,
      visualization: !!window.google?.maps?.visualization,
      HeatmapLayer: !!window.google?.maps?.visualization?.HeatmapLayer,
      heatmapData: heatmapData?.points?.length,
      samplePoint: heatmapData?.points?.[0]
    });
  }, [isGoogleMapsLoaded, mapsError, heatmapData]);

  // Initialize map only when Google Maps is fully loaded
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapRef.current || googleMap) return;

    console.log('🗺️ Initializing Google Map...');

    try {
      // Safety check for google object
      if (!window.google || !window.google.maps) {
        console.error('❌ Google Maps not available during initialization');
        return;
      }

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 10.7868, lng: 122.5894 }, // Leganes center coordinates
        zoom: 13,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }] // Show labels for better orientation
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }] // Light gray water bodies
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true
      });

      // Draw Leganes boundary as a polygon on the map
      const leganesBoundaryPolygon = new google.maps.Polygon({
        paths: leganesBoundary,
        strokeColor: '#3b82f6', // Blue border
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#3b82f6', // Light blue fill
        fillOpacity: 0.1, // Very transparent fill
      });
      
      leganesBoundaryPolygon.setMap(map);
      setGoogleMap(map);
      setIsMapReady(true);

      console.log('🗺️ Map initialized successfully with Leganes boundary');

    } catch (err) {
      console.error('❌ Error initializing map:', err);
    }
  }, [isGoogleMapsLoaded, leganesBoundary]);

  // Create manual heatmap using circles as fallback
  const createManualHeatmap = useCallback((map: google.maps.Map, points: any[]) => {
    console.log('🔥 Creating manual heatmap fallback with', points.length, 'points');
    
    const circles: google.maps.Circle[] = [];
    
    points.forEach(point => {
      const color = point.weight >= 4 ? '#FF0000' : 
                   point.weight >= 3 ? '#FF6B00' : 
                   point.weight >= 2 ? '#FFA500' : 
                   '#00AAFF';
      
      // Create proper LatLng for circles
      const center = new google.maps.LatLng(point.location.lat, point.location.lng);
      
      const circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        center: center,
        radius: point.weight * 100 // Larger radius for higher density
      });
      
      circles.push(circle);
    });
    
    return circles;
  }, []);

  // Update heatmap when data changes and map is ready
  useEffect(() => {
    if (!googleMap || !heatmapData || !isMapReady || !isGoogleMapsLoaded) {
      console.log('🔥 Heatmap update skipped:', {
        hasGoogleMap: !!googleMap,
        hasHeatmapData: !!heatmapData,
        isMapReady,
        isGoogleMapsLoaded
      });
      return;
    }

    console.log('🔥 Updating heatmap with', heatmapData.points.length, 'points');
    console.log('🔥 Sample point structure:', heatmapData.points[0]);

    try {
      // Clear existing heatmap
      if (heatmapLayer) {
        heatmapLayer.setMap(null);
        setHeatmapLayer(null);
      }

      // Check if visualization library is available
      const hasVisualization = window.google?.maps?.visualization?.HeatmapLayer;
      
      if (hasVisualization) {
        console.log('✅ Using Google Maps Visualization Heatmap');
        
        // ✅ FIXED: Convert our simple objects to proper Google Maps LatLng objects
        const heatmapDataPoints = heatmapData.points.map(point => {
          // Create proper google.maps.LatLng objects
          return {
            location: new google.maps.LatLng(point.location.lat, point.location.lng),
            weight: point.weight
          };
        });

        console.log('🔥 Processed heatmap data points:', heatmapDataPoints.slice(0, 2));

        try {
          const newHeatmapLayer = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataPoints,
            map: googleMap,
            radius: 40, // Increased radius for better visibility
            opacity: 0.8,
            gradient: [
              'rgba(102, 255, 255, 0)',
              'rgba(102, 255, 255, 1)',
              'rgba(102, 204, 255, 1)',
              'rgba(102, 153, 255, 1)',
              'rgba(102, 102, 255, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(204, 102, 255, 1)',
              'rgba(255, 102, 204, 1)',
              'rgba(255, 102, 153, 1)',
              'rgba(255, 102, 102, 1)'
            ]
          });

          setHeatmapLayer(newHeatmapLayer);
          setUsingFallback(false);
          console.log('🔥 Google Heatmap layer created successfully');
          
        } catch (heatmapError) {
          console.error('❌ Error creating Google Heatmap layer:', heatmapError);
          // Fallback to manual heatmap if Google heatmap fails
          console.log('🔄 Falling back to manual heatmap');
          createManualHeatmap(googleMap, heatmapData.points);
          setUsingFallback(true);
        }
      } else {
        console.log('⚠️ Visualization not available, using manual heatmap fallback');
        createManualHeatmap(googleMap, heatmapData.points);
        setUsingFallback(true);
      }

      // Fit map to show all heatmap points if there are any
      if (heatmapData.points.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        heatmapData.points.forEach(point => {
          // Create LatLng object for bounds
          const latLng = new google.maps.LatLng(point.location.lat, point.location.lng);
          bounds.extend(latLng);
        });
        googleMap.fitBounds(bounds);
        
        // Add a slight padding to the bounds
        googleMap.panToBounds(bounds, 50);
      }

    } catch (err) {
      console.error('❌ Error creating heatmap layer:', err);
      // Fallback to manual heatmap
      if (googleMap && heatmapData) {
        createManualHeatmap(googleMap, heatmapData.points);
        setUsingFallback(true);
      }
    }
  }, [googleMap, heatmapData, isMapReady, isGoogleMapsLoaded, heatmapLayer, createManualHeatmap]);

  const handleZoomIn = () => {
    if (googleMap) {
      const currentZoom = googleMap.getZoom() || 13;
      googleMap.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (googleMap) {
      const currentZoom = googleMap.getZoom() || 13;
      googleMap.setZoom(currentZoom - 1);
    }
  };

  const handleResetView = () => {
    if (googleMap) {
      googleMap.setCenter({ lat: 10.7868, lng: 122.5894 });
      googleMap.setZoom(13);
    }
  };

  // Show specific error for visualization library
  if (mapsError?.includes('Visualization')) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-amber-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <Typography variant="h4" as="h3" className="mb-2">
              Heatmap Library Required
            </Typography>
            <Typography variant="p" className="mb-4">
              Please add "visualization" to your Google Maps API libraries.
            </Typography>
            <Button onClick={refetch} variant="default">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mapsError) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <Typography variant="h4" as="h3" className="mb-2">
              Map Error
            </Typography>
            <Typography variant="p">
              {mapsError}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Business Density Heatmap
              {usingFallback && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Circle Visualization
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {usingFallback 
                ? 'Using circle visualization for business density' 
                : 'Heatmap visualization of business concentration across Leganes'
              }
              {heatmapData && ` - ${heatmapData.points.length} hotspots detected`}
            </CardDescription>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-2 py-1">
                {heatmapData?.points.length || 0} Hotspots
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Heatmap Legend */}
        <div className="px-6 py-3 bg-muted/50 border-b">
          <div className="flex items-center justify-between">
            <Typography variant="small" className="text-muted-foreground">
              Density Legend:
            </Typography>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <Typography variant="small">Low</Typography>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <Typography variant="small">Medium</Typography>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <Typography variant="small">High</Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            style={{ height: `${height}px` }}
            className="w-full"
          />
          
          {/* Loading Overlay */}
          {(loading || !isGoogleMapsLoaded) && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <Typography variant="p" className="text-muted-foreground">
                  {!isGoogleMapsLoaded ? 'Loading Google Maps...' : 'Loading business data...'}
                </Typography>
                {!isGoogleMapsLoaded && (
                  <Typography variant="small" className="text-muted-foreground mt-2">
                    Including visualization library...
                  </Typography>
                )}
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && !loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center">
                <Typography variant="h4" as="h3" className="text-red-600 mb-2">
                  Heatmap Error
                </Typography>
                <Typography variant="p" className="text-muted-foreground mb-4">
                  {error}
                </Typography>
                <Button onClick={refetch} variant="default">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Map Controls */}
          {showControls && isMapReady && (
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleResetView}
                className="h-8 w-8"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Statistics Footer */}
        {heatmapData && (
          <div className="px-6 py-3 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Total Businesses
                </Typography>
                <Typography variant="p" className="font-semibold">
                  {heatmapData.totalBusinesses}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Density Hotspots
                </Typography>
                <Typography variant="p" className="font-semibold">
                  {heatmapData.points.length}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Max Density
                </Typography>
                <Typography variant="p" className="font-semibold">
                  {heatmapData.maxDensity} businesses
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Visualization
                </Typography>
                <Typography variant="p" className="font-semibold">
                  {usingFallback ? 'Circles' : 'Heatmap'}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};