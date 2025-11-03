// src/hooks/useBusiness.ts
import { useState, useEffect } from 'react';
import api from '@/services/api';
import type { Business } from '@/types';


export const useBusiness = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/Business');
      console.log('📊 API Response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setBusinesses(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setBusinesses(response.data.data);
      } else {
        setBusinesses([]);
        console.warn('⚠️ Unexpected API response structure:', response.data);
      }
    } catch (err: any) {
      console.error('🚨 Error fetching businesses:', err);
      setError(err.response?.data?.message || 'Failed to fetch businesses');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

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