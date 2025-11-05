// hooks/useBusinessData.ts
import { useState, useEffect, useCallback } from 'react';
import { BusinessService } from '@/services/businessService';
// import type { 
//   Business, 
//   BusinessDetails, 
//   BusinessMapDto, 
//   BusinessMapStats,
//   MapFilterRequest 
// } from '@/types/business';

import type { 
  Business, 
  BusinessDetails, 
  BusinessMapDto, 
  BusinessMapStats,
  MapFilterRequest 
} from '@/types';
// Hook for all businesses
export const useBusinessData = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BusinessService.getAllBusinesses();
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return { businesses, loading, error, refetch: fetchBusinesses };
};

// Hook for map businesses
export const useMapBusinesses = (complianceFilter: string = 'all') => {
  const [businesses, setBusinesses] = useState<BusinessMapDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapBusinesses = useCallback(async (filter: string) => {
    try {
      setLoading(true);
      setError(null);
      const filterRequest: MapFilterRequest = { complianceFilter: filter };
      const data = await BusinessService.getBusinessesForMap(filterRequest);
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch map businesses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMapBusinesses(complianceFilter);
  }, [complianceFilter, fetchMapBusinesses]);

  return { 
    businesses, 
    loading, 
    error, 
    refetch: () => fetchMapBusinesses(complianceFilter) 
  };
};

// Hook for business details
export const useBusinessDetails = (businessId: string | undefined) => {
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await BusinessService.getBusinessDetails(id);
      setBusinessDetails(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch business details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails(businessId);
    } else {
      setLoading(false);
      setError('No business ID provided');
    }
  }, [businessId, fetchBusinessDetails]);

  return { 
    businessDetails, 
    loading, 
    error, 
    refetch: () => businessId && fetchBusinessDetails(businessId) 
  };
};

// Hook for business statistics
export const useBusinessStats = () => {
  const [stats, setStats] = useState<BusinessMapStats>({
    total: 0,
    compliant: 0,
    pending: 0,
    nonCompliant: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BusinessService.getBusinessMapStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch business statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook for business compliance
export const useBusinessCompliance = (businessId: string | undefined) => {
  const [compliance, setCompliance] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompliance = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await BusinessService.getBusinessCompliance(id);
      setCompliance(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch compliance status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      fetchCompliance(businessId);
    } else {
      setLoading(false);
      setError('No business ID provided');
    }
  }, [businessId, fetchCompliance]);

  return { 
    compliance, 
    loading, 
    error, 
    refetch: () => businessId && fetchCompliance(businessId) 
  };
};