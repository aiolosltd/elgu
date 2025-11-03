// hooks/useBusinessData.ts
import { useState, useEffect, useCallback } from 'react';
import { BusinessService } from '@/services/businessService';
import type { Business, BusinessDetails, BusinessMapDto, BusinessMapStats, MapFilterRequest } from '@/types';

/**
 * 🎯 HOOK: useBusinessData
 * 📝 Purpose: Fetch all businesses with basic information
 * 💡 Usage: For business listings, tables, etc.
 * 🔄 Auto-fetches on mount, provides refetch capability
 */
export const useBusinessData = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching all businesses...');
      const data = await BusinessService.getAllBusinesses();
      setBusinesses(data);
      console.log(`✅ Businesses fetched: ${data.length} records`);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch businesses');
      console.error('❌ Error in useBusinessData:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const refetch = () => {
    fetchBusinesses();
  };

  return {
    businesses,
    loading,
    error,
    refetch
  };
};

/**
 * 🎯 HOOK: useMapBusinesses
 * 📝 Purpose: Fetch businesses optimized for map display with backend filtering
 * 💡 Usage: For map components, location-based displays
 * 🔄 Auto-fetches when filter changes, provides refetch capability
 */
export const useMapBusinesses = (complianceFilter: string = 'all') => {
  const [businesses, setBusinesses] = useState<BusinessMapDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapBusinesses = useCallback(async (filter: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🗺️ Fetching map businesses with filter: ${filter}`);
      
      const filterRequest: MapFilterRequest = { complianceFilter: filter };
      const data = await BusinessService.getBusinessesForMap(filterRequest);
      
      setBusinesses(data);
      console.log(`✅ Map businesses fetched: ${data.length} records`);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch map businesses');
      console.error('❌ Error in useMapBusinesses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMapBusinesses(complianceFilter);
  }, [complianceFilter, fetchMapBusinesses]);

  const refetch = () => {
    fetchMapBusinesses(complianceFilter);
  };

  return {
    businesses,
    loading,
    error,
    refetch
  };
};

/**
 * 🎯 HOOK: useBusinessDetails
 * 📝 Purpose: Fetch detailed information for a single business
 * 💡 Usage: For business detail modals, profile pages
 * 🔄 Auto-fetches when businessId changes
 */
export const useBusinessDetails = (businessId: string | undefined) => {
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔍 Fetching details for business: ${id}`);
      const data = await BusinessService.getBusinessDetails(id);
      setBusinessDetails(data);
      console.log('✅ Business details fetched successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch business details');
      console.error('❌ Error in useBusinessDetails:', err);
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

  const refetch = () => {
    if (businessId) {
      fetchBusinessDetails(businessId);
    }
  };

  return {
    businessDetails,
    loading,
    error,
    refetch
  };
};

/**
 * 🎯 HOOK: useBusinessStats
 * 📝 Purpose: Fetch business statistics from backend
 * 📊 Data: Total, Compliant, Pending, Non-Compliant counts
 * 💡 Usage: For dashboards, statistics cards, overview pages
 * 🔄 Auto-fetches on mount, provides refetch capability
 */
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
      console.log('📊 Fetching business statistics...');
      const data = await BusinessService.getBusinessMapStats();
      setStats(data);
      console.log('✅ Business statistics fetched:', data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch business statistics');
      console.error('❌ Error in useBusinessStats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
};

/**
 * 🎯 HOOK: useBusinessCompliance
 * 📝 Purpose: Fetch compliance status for a specific business
 * 💡 Usage: For status badges, compliance checking
 * 🔄 Auto-fetches when businessId changes
 */
export const useBusinessCompliance = (businessId: string | undefined) => {
  const [compliance, setCompliance] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompliance = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📋 Fetching compliance for business: ${id}`);
      const data = await BusinessService.getBusinessCompliance(id);
      setCompliance(data);
      console.log(`✅ Compliance status: ${data}`);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch compliance status');
      console.error('❌ Error in useBusinessCompliance:', err);
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

  const refetch = () => {
    if (businessId) {
      fetchCompliance(businessId);
    }
  };

  return {
    compliance,
    loading,
    error,
    refetch
  };
};