// components/organisms/Maps.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  MapPin,
  Filter,
  Clock,
  XCircle,
  Building,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BusinessDetailsPanel } from "@/components/organisms/BusinessDetailsPanel";
import { useMapBusinesses, useBusinessStats } from "@/hooks/useBusinessData"; // Updated imports
import { useGoogleMapsLoader } from "@/services/api/useGoogleMapsLoader";
import { BusinessService } from "@/services/businessService";
import { flagIcons } from "@/lib/mapConstants";
import type { BusinessDetails, BusinessMapDto } from "@/types"; // Updated types
import { StatCard } from "@/components/molecules/card/statCard";

interface MapsProps {
  complianceFilter?: string;
}

type MapViewType = "roadmap" | "satellite" | "terrain" | "streetview";

// Extend window interface for global function
declare global {
  interface Window {
    showFullInfoPopup: (businessId: string) => void;
  }
}

/**
 * 🗺️ MAPS COMPONENT
 * 📝 Purpose: Display businesses on an interactive Google Map
 * 🎯 Features: 
 *    - Filter businesses by compliance status
 *    - Show business details in modal
 *    - Different map views (roadmap, satellite, etc.)
 *    - Responsive design for mobile/desktop
 *    - Real-time statistics display
 */
const Maps: React.FC<MapsProps> = ({ complianceFilter = "all" }) => {
  // Refs for map objects
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMarkersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const isInitializedRef = useRef(false);

  // State management
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mapView, setMapView] = useState<MapViewType>("roadmap");
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [streetView, setStreetView] = useState<google.maps.StreetViewPanorama | null>(null);
  const [currentFilter, setCurrentFilter] = useState(complianceFilter);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Custom hooks for data fetching
  const { isLoaded, error: mapsError } = useGoogleMapsLoader();
  const { 
    businesses, 
    loading: businessesLoading, 
    error: businessesError,
    refetch: refetchBusinesses 
  } = useMapBusinesses(currentFilter); // Using new hook

  const { 
    stats, 
    loading: statsLoading, 
    error: statsError,
    refetch: refetchStats 
  } = useBusinessStats(); // Using new hook

  /**
   * 🗺️ INITIALIZE MAP
   * 📝 Purpose: Set up Google Maps instance
   * 🔄 Called only once when Google Maps loads
   */
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || isInitializedRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 10.7868, lng: 122.5894 }, // Leganes, Iloilo coordinates
      zoom: 14,
      mapTypeId: "roadmap",
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      maxZoom: 18,
      minZoom: 10,
    });

    const streetViewPanorama = map.getStreetView();
    setStreetView(streetViewPanorama);
    setGoogleMap(map);
    isInitializedRef.current = true;

    // Add global function for info window buttons
    window.showFullInfoPopup = showFullInfoPopup;

    console.log("✅ Map initialized successfully");
  }, []);

  /**
   * 🧹 CLEAR ALL MARKERS
   * 📝 Purpose: Remove all markers and info windows from map
   * 🔄 Called before adding new markers
   */
  const clearAllMarkers = useCallback(() => {
    // Clear markers from map
    googleMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    
    // Close all info windows
    infoWindowsRef.current.forEach((infoWindow) => {
      infoWindow.close();
    });
    
    // Clear arrays
    googleMarkersRef.current = [];
    infoWindowsRef.current = [];
  }, []);

  /**
   * 📍 CREATE MARKERS ON MAP
   * 📝 Purpose: Add business markers to the map
   * 🔄 Called when businesses data changes
   */
  const createMarkersOnMap = useCallback(() => {
    if (!googleMap || !window.google || businesses.length === 0) {
      return;
    }

    console.log(`📍 Creating ${businesses.length} markers...`);

    // Clear existing markers first
    clearAllMarkers();

    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];

    businesses.forEach((business: BusinessMapDto) => {
      // Parse coordinates with error handling
      let lat = 10.7868; // Default coordinates (Leganes)
      let lng = 122.5894;
      
      if (business.longLat) {
        try {
          const coords = business.longLat
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            lat = coords[0];
            lng = coords[1];
          }
        } catch (error) {
          console.warn("❌ Invalid coordinates for business:", business.businessId, business.longLat);
          return; // Skip this business if coordinates are invalid
        }
      }

      // Create marker with compliance-based icon
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: googleMap,
        title: `${business.businessName} - ${business.representativeName}`,
        icon: {
          url: flagIcons[business.complianceStatus],
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
        optimized: businesses.length > 1000, // Optimize for large datasets
      });

      // Create info window content
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: bold;">
              ${business.businessName || 'Unknown Business'}
            </h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 12px;">
              <strong>Owner:</strong> ${business.representativeName || 'Unknown Owner'}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 12px;">
              <strong>Address:</strong> ${business.address}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 12px;">
              <strong>Status:</strong> 
              <span style="color: ${
                business.complianceStatus === "compliant" ? "#10b981" :
                business.complianceStatus === "pending" ? "#f59e0b" : "#ef4444"
              }; font-weight: bold;">
                ${business.complianceStatus.toUpperCase()}
              </span>
            </p>
            <div style="margin-top: 8px;">
              <button onclick="window.showFullInfoPopup('${business.businessId}')" 
                      style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%;">
                View Full Details
              </button>
            </div>
          </div>
        `,
      });

      // Event listeners for different devices
      if (window.innerWidth < 768) {
        // Mobile: click to open info window
        marker.addListener("click", () => {
          newInfoWindows.forEach(iw => iw.close());
          infoWindow.open(googleMap, marker);
        });
      } else {
        // Desktop: hover to show info window
        marker.addListener("mouseover", () => {
          infoWindow.open(googleMap, marker);
        });
        marker.addListener("mouseout", () => {
          infoWindow.close();
        });
      }

      // Double click to zoom functionality
      let clickCount = 0;
      let clickTimer: ReturnType<typeof setTimeout>;

      marker.addListener("click", () => {
        clickCount++;
        if (clickCount === 2) {
          clickCount = 0;
          clearTimeout(clickTimer);
          googleMap.setZoom(18);
          googleMap.setCenter(marker.getPosition()!);
          infoWindow.open(googleMap, marker);
          showFullInfoPopup(business.businessId);
        } else {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 500);
        }
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    // Update refs with new markers and info windows
    googleMarkersRef.current = newMarkers;
    infoWindowsRef.current = newInfoWindows;

    console.log(`✅ Successfully created ${newMarkers.length} markers`);
  }, [googleMap, businesses, clearAllMarkers]);

  /**
   * 🔍 SHOW FULL INFO POPUP
   * 📝 Purpose: Fetch and display detailed business information
   * 🔄 Called when user clicks "View Full Details" button
   */
  const showFullInfoPopup = async (businessId: string) => {
    try {
      console.log("🔄 Loading business details for:", businessId);
      setDetailsLoading(true);
      
      const details = await BusinessService.getBusinessDetails(businessId);
      console.log("✅ Business details loaded:", details);
      
      // setSelectedBusiness(details);
      setShowDetails(true);
      setDetailsLoading(false);
    } catch (err) {
      console.error("❌ Error loading business details:", err);
      setDetailsLoading(false);
      
      let errorMessage = "Error loading business details. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  // Event handlers
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBusiness(null);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setShowMobileMenu(false);
  };

  const handleMapViewChange = (view: MapViewType) => {
    setMapView(view);
    if (googleMap && streetView) {
      if (view === "streetview") {
        streetView.setPosition(googleMap.getCenter()!);
        streetView.setPov({ heading: 265, pitch: 0 });
        streetView.setVisible(true);
      } else {
        streetView.setVisible(false);
        googleMap.setMapTypeId(view);
      }
    }
    setShowMobileMenu(false);
  };

  // Effect for initializing map
  useEffect(() => {
    if (isLoaded && mapRef.current && !isInitializedRef.current) {
      initializeMap();
    }
  }, [isLoaded, initializeMap]);

  // Effect for updating markers when businesses change
  useEffect(() => {
    if (isLoaded && googleMap && isInitializedRef.current) {
      const timer = setTimeout(() => {
        createMarkersOnMap();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, googleMap, businesses, createMarkersOnMap]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      clearAllMarkers();
      isInitializedRef.current = false;
    };
  }, [clearAllMarkers]);

  // Loading and error states
  const loading = businessesLoading || !isLoaded || statsLoading;
  const errorToShow = mapsError || businessesError || statsError;

  // Error display
  if (errorToShow) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <MapPin size={24} />
              <Typography as="h2" variant="h4" weight="semibold">
                Maps Error
              </Typography>
            </div>
            <Typography as="p" variant="p" className="text-muted-foreground">
              {errorToShow}
            </Typography>
            <Button onClick={() => { refetchBusinesses(); refetchStats(); }} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main component render
  return (
    <div className="h-screen flex flex-col relative">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="bg-card border-b border-border px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <Typography as="h1" variant="small" weight="semibold" className="text-foreground">
                Business Map
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLegend(!showLegend)}
                className="h-7 px-2 text-xs"
              >
                Legend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="h-7 w-7 p-0"
              >
                {showMobileMenu ? <X size={14} /> : <Menu size={14} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="bg-card border-b border-border px-3 py-3 space-y-3">
            {/* Quick Stats */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex-shrink-0 bg-muted rounded-lg px-3 py-2 min-w-[80px]">
                <Typography variant="small" className="text-muted-foreground text-xs">Total</Typography>
                <Typography variant="h4" weight="bold" className="text-foreground">{stats.total}</Typography>
              </div>
              <div className="flex-shrink-0 bg-muted rounded-lg px-3 py-2 min-w-[80px]">
                <Typography variant="small" className="text-muted-foreground text-xs">Pending</Typography>
                <Typography variant="h4" weight="bold" className="text-foreground">{stats.pending}</Typography>
              </div>
              <div className="flex-shrink-0 bg-muted rounded-lg px-3 py-2 min-w-[80px]">
                <Typography variant="small" className="text-muted-foreground text-xs">Compliant</Typography>
                <Typography variant="h4" weight="bold" className="text-foreground">{stats.compliant}</Typography>
              </div>
              <div className="flex-shrink-0 bg-muted rounded-lg px-3 py-2 min-w-[80px]">
                <Typography variant="small" className="text-muted-foreground text-xs">Non-Compliant</Typography>
                <Typography variant="h4" weight="bold" className="text-foreground">{stats.nonCompliant}</Typography>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted-foreground" />
                <select
                  className="flex-1 border border-input rounded px-2 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  onChange={(e) => handleFilterChange(e.target.value)}
                  value={currentFilter}
                >
                  <option value="all">All Businesses</option>
                  <option value="compliant">Compliant</option>
                  <option value="noncompliant">Non-Compliant</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground whitespace-nowrap">View:</span>
                <select
                  value={mapView}
                  onChange={(e) => handleMapViewChange(e.target.value as MapViewType)}
                  className="flex-1 border border-input rounded px-2 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="roadmap">Roadmap</option>
                  <option value="satellite">Satellite</option>
                  <option value="terrain">Terrain</option>
                  <option value="streetview">Street View</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 pt-4 pb-2">
        <Card className="mb-2">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-2 lg:space-y-0">
              <div className="flex-1">
                <CardTitle className="text-lg lg:text-xl mb-1">
                  Leganes Business Map
                </CardTitle>
                <Typography variant="p" className="text-muted-foreground text-sm">
                  View geographical distribution of businesses in Leganes
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
          <StatCard
            title="All Business"
            value={stats.total.toString()}
            icon={Building}
            color="blue"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending.toString()} 
            icon={Clock} 
            color="yellow" 
          />
          <StatCard
            title="Compliant"
            value={stats.compliant.toString()}
            icon={CheckCircle}
            color="green"
          />
          <StatCard 
            title="Non-Compliant" 
            value={stats.nonCompliant.toString()} 
            icon={XCircle} 
            color="red" 
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <select
                className="border border-input rounded px-2 py-1 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                onChange={(e) => handleFilterChange(e.target.value)}
                value={currentFilter}
              >
                <option value="all">All Businesses</option>
                <option value="compliant">Compliant</option>
                <option value="noncompliant">Non-Compliant</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            {currentFilter && currentFilter !== 'all' && (
              <Badge variant="secondary" className="px-2 py-1 text-xs">
                Filter: {currentFilter}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative min-h-0">
        
        {/* Desktop Map View Controls */}
        <Card className="hidden lg:block absolute top-2 right-2 z-10">
          <CardContent className="p-2">
            <Typography
              as="div"
              variant="small"
              weight="medium"
              className="text-foreground mb-1 text-xs"
            >
              Map View:
            </Typography>
            <select
              value={mapView}
              onChange={(e) => handleMapViewChange(e.target.value as MapViewType)}
              className="w-full px-2 py-1 border border-input rounded text-xs bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="roadmap">Roadmap</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="streetview">Street View</option>
            </select>
          </CardContent>
        </Card>

        {/* Map Element */}
        <div ref={mapRef} className="w-full h-full absolute inset-0" />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <Typography as="p" variant="p" className="mt-2 text-muted-foreground text-sm">
                {businessesLoading ? "Loading Business Data..." : 
                 statsLoading ? "Loading Statistics..." : "Loading Maps..."}
              </Typography>
            </div>
          </div>
        )}

        {/* Details Loading Overlay */}
        {detailsLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-60">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <Typography as="p" variant="p" className="mt-2 text-muted-foreground text-sm">
                Loading Business Details...
              </Typography>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {isLoaded && businesses.length === 0 && !loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Typography as="p" variant="small" className="text-muted-foreground mb-4 text-sm">
                  No business data available for this filter
                </Typography>
                <Button
                  onClick={refetchBusinesses}
                  size="sm"
                >
                  Reload Data
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Business Details Panel */}
        {showDetails && selectedBusiness && (
          <BusinessDetailsPanel
            selectedBusiness={selectedBusiness}
            onClose={handleCloseDetails}
          />
        )}

        {/* Mobile Legend */}
        {showLegend && (
          <Card className="lg:hidden absolute top-2 left-2 z-40 max-w-[120px]">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-1">
                <Typography
                  as="h4"
                  variant="small"
                  weight="semibold"
                  className="text-foreground text-xs"
                >
                  Legend
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLegend(false)}
                  className="h-5 w-5 p-0"
                >
                  <X size={10} />
                </Button>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></div>
                  <Typography as="span" className="text-xs">Compliant</Typography>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                  <Typography as="span" className="text-xs">Pending</Typography>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></div>
                  <Typography as="span" className="text-xs">Non-Compliant</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desktop Legend */}
        <Card className="hidden lg:block absolute bottom-2 right-2 z-40 max-w-[120px]">
          <CardContent className="p-2">
            <Typography
              as="h4"
              variant="small"
              weight="semibold"
              className="text-foreground mb-1 text-xs"
            >
              Legend
            </Typography>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></div>
                <Typography as="span" className="text-xs">Compliant</Typography>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                <Typography as="span" className="text-xs">Pending</Typography>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></div>
                <Typography as="span" className="text-xs">Non-Compliant</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Maps;