import { useState, useEffect } from 'react';
import { lookupService } from '@/services/lookupService';
import type { LookupOptions } from '@/types';

export const useLookup = () => {
  const [lookupOptions, setLookupOptions] = useState<LookupOptions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all lookup options on component mount
  useEffect(() => {
    loadLookupOptions();
  }, []);

  const loadLookupOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const options = await lookupService.getAllOptions();

      // 🔧 Normalize all keys to lowercase for consistent access
      const normalizedOptions = Object.keys(options).reduce((acc, key) => {
        acc[key.toLowerCase()] = options[key];
        return acc;
      }, {} as Record<string, string[]>);

      setLookupOptions(normalizedOptions);

    } catch (err) {
      setError('Failed to load lookup options');
      console.error('Error loading lookup options:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get options for a specific type (case-insensitive)
  const getOptions = (type: string): string[] => {
    if (!lookupOptions) return [];
    // make it case-insensitive
    const key = type.toLowerCase();
    return lookupOptions[key] || [];
  };

  // Get options as { value, label } for Select components
  const getSelectOptions = (type: string): { value: string; label: string }[] => {
    const options = getOptions(type);
    return options.map(option => ({
      value: option.toLowerCase().replace(/\s+/g, '_'),
      label: option
    }));
  };

  // Refresh lookup options
  const refresh = () => {
    loadLookupOptions();
  };


  return {
    lookupOptions,
    loading,
    error,
    getOptions,
    getSelectOptions,
    refresh,
  };
};
