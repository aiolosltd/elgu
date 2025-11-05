// hooks/useBusinessHeatmap.ts
import { useState, useEffect, useCallback } from 'react';
// import { BusinessService } from '@/services/businessService';
import type { BusinessMapDto } from '@/types/business';

// Leganes coordinates boundary
export const leganesCoords = [
  {lat:10.811672,lng:122.598649},{lat:10.808785,lng:122.61096},{lat:10.806279,lng:122.613272},{lat:10.80462,lng:122.61344},{lat:10.795828,lng:122.618913},{lat:10.794538,lng:122.620213},{lat:10.794021,lng:122.621286},{lat:10.793401,lng:122.629403},{lat:10.789797,lng:122.633377},{lat:10.789583,lng:122.6325},{lat:10.788722,lng:122.631615},{lat:10.788722,lng:122.629196},{lat:10.790778,lng:122.627083},{lat:10.792528,lng:122.627083},{lat:10.792916,lng:122.625809},{lat:10.792055,lng:122.625},{lat:10.79125,lng:122.6175},{lat:10.793694,lng:122.614197},{lat:10.791639,lng:122.612915},{lat:10.790444,lng:122.615837},{lat:10.789972,lng:122.61792},{lat:10.785444,lng:122.618332},{lat:10.785389,lng:122.620003},{lat:10.78625,lng:122.620834},{lat:10.786195,lng:122.624138},{lat:10.787056,lng:122.625809},{lat:10.785,lng:122.627113},{lat:10.782528,lng:122.627113},{lat:10.781195,lng:122.625832},{lat:10.781195,lng:122.623337},{lat:10.780389,lng:122.622475},{lat:10.780389,lng:122.617531},{lat:10.779583,lng:122.615837},{lat:10.777056,lng:122.614166},{lat:10.775444,lng:122.610809},{lat:10.776222,lng:122.605858},{lat:10.774167,lng:122.603775},{lat:10.7725,lng:122.603775},{lat:10.770833,lng:122.601219},{lat:10.768306,lng:122.60453},{lat:10.765833,lng:122.60453},{lat:10.763722,lng:122.601692},{lat:10.763722,lng:122.600807},{lat:10.76149,lng:122.598558},{lat:10.772291,lng:122.59246},{lat:10.773517,lng:122.586748},{lat:10.773441,lng:122.586188},{lat:10.766068,lng:122.581405},{lat:10.766718,lng:122.575504},{lat:10.76818,lng:122.572389},{lat:10.780274,lng:122.570009},{lat:10.780857,lng:122.569501},{lat:10.780857,lng:122.56913},{lat:10.788946,lng:122.557043},{lat:10.790066,lng:122.556504},{lat:10.802314,lng:122.566483},{lat:10.804878,lng:122.565579},{lat:10.81256,lng:122.572472},{lat:10.813768,lng:122.576014},{lat:10.811514,lng:122.586092},{lat:10.811244,lng:122.586326},{lat:10.809532,lng:122.59198},{lat:10.810892,lng:122.596868},{lat:10.811672,lng:122.598649}
];

// Use simple objects instead of google.maps.LatLng
export interface HeatmapPoint {
  location: { lat: number; lng: number }; // Simple object instead of google.maps.LatLng
  weight: number;
  businessCount: number;
}

export interface HeatmapData {
  points: HeatmapPoint[];
  maxDensity: number;
  totalBusinesses: number;
  barangayDistribution: Record<string, number>;
}

export const useBusinessHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to check if point is within Leganes boundary
  // const isPointInLeganes = useCallback((lat: number, lng: number): boolean => {
  //   const minLat = Math.min(...leganesCoords.map(coord => coord.lat));
  //   const maxLat = Math.max(...leganesCoords.map(coord => coord.lat));
  //   const minLng = Math.min(...leganesCoords.map(coord => coord.lng));
  //   const maxLng = Math.max(...leganesCoords.map(coord => coord.lng));
    
  //   return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  // }, []);

  // Function to generate heatmap points from business data
  const generateHeatmapPoints = useCallback((businesses: BusinessMapDto[]): HeatmapData => {
    console.log('🔥 Generating heatmap points from', businesses.length, 'businesses');
    
    // ✅ TEMPORARY DUMMY DATA FOR TESTING
    console.log('🔥 USING DUMMY DATA FOR HEATMAP TESTING');
    
    // Create realistic dummy heatmap points within Leganes area
    // ✅ FIX: Use simple {lat, lng} objects instead of google.maps.LatLng
    const dummyPoints: HeatmapPoint[] = [
      // High density areas (weight: 4-5)
      {
        location: { lat: 10.7868, lng: 122.5894 }, // Simple object
        weight: 5,
        businessCount: 15
      },
      {
        location: { lat: 10.7912, lng: 122.5956 },
        weight: 4,
        businessCount: 12
      },
      {
        location: { lat: 10.7823, lng: 122.5831 },
        weight: 5,
        businessCount: 18
      },
      {
        location: { lat: 10.7881, lng: 122.5923 },
        weight: 4,
        businessCount: 11
      },
      
      // Medium density areas (weight: 2-3)
      {
        location: { lat: 10.7895, lng: 122.5812 },
        weight: 3,
        businessCount: 8
      },
      {
        location: { lat: 10.7798, lng: 122.5923 },
        weight: 3,
        businessCount: 7
      },
      {
        location: { lat: 10.7941, lng: 122.5876 },
        weight: 2,
        businessCount: 5
      },
      {
        location: { lat: 10.7852, lng: 122.5987 },
        weight: 3,
        businessCount: 6
      },
      
      // Low density areas (weight: 1)
      {
        location: { lat: 10.7756, lng: 122.5987 },
        weight: 1,
        businessCount: 2
      },
      {
        location: { lat: 10.7992, lng: 122.5798 },
        weight: 1,
        businessCount: 3
      },
      {
        location: { lat: 10.7815, lng: 122.5754 },
        weight: 1,
        businessCount: 1
      },
      {
        location: { lat: 10.7891, lng: 122.6023 },
        weight: 2,
        businessCount: 4
      },
      {
        location: { lat: 10.7923, lng: 122.5821 },
        weight: 1,
        businessCount: 2
      },
      {
        location: { lat: 10.7789, lng: 122.5856 },
        weight: 1,
        businessCount: 1
      }
    ];

    const barangayDistribution = {
      'Leganes Proper': 25,
      'Pavia': 18,
      'Guinobatan': 12,
      'Cagamatan': 8,
      'Napnud': 5,
      'Guikaman': 3
    };

    const maxDensity = 18;
    const totalBusinesses = 75;

    console.log('🔥 DUMMY DATA - Heatmap data generated:', {
      points: dummyPoints.length,
      maxDensity,
      totalBusinesses,
      barangayDistribution,
      samplePoint: dummyPoints[0] // Log a sample point to verify structure
    });

    return {
      points: dummyPoints,
      maxDensity,
      totalBusinesses,
      barangayDistribution
    };
  }, []);

  const fetchHeatmapData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔥 Fetching business data for heatmap...');
      
      // ✅ TEMPORARY: Use empty array since we're using dummy data
      const businesses: BusinessMapDto[] = [];
      
      console.log('🔥 Using dummy data instead of API call');
      
      // Generate heatmap data using dummy data
      const heatmapData = generateHeatmapPoints(businesses);
      
      setHeatmapData(heatmapData);
      
    } catch (err: any) {
      console.error('🔥 Error fetching heatmap data:', err);
      setError(err.message || 'Failed to load heatmap data');
    } finally {
      setLoading(false);
    }
  }, [generateHeatmapPoints]);

  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData]);

  const refetch = () => {
    fetchHeatmapData();
  };

  return {
    heatmapData,
    loading,
    error,
    refetch,
    leganesBoundary: leganesCoords
  };
};