// services/businessService.ts
import api from './api';
import type { 
  Business, 
  BusinessDetails, 
  BusinessMapDto, 
  BusinessMapStats, 
  MapFilterRequest,
  ApiResponse 
} from '@/types/business';

// No need for separate interface definitions here
// since we're importing from types

export class BusinessService {
  // Get all businesses
  static async getAllBusinesses(): Promise<Business[]> {
    const response = await api.get<ApiResponse<Business[]>>('/Business');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch businesses');
  }

  // Get business details by ID
  static async getBusinessDetails(businessId: string): Promise<BusinessDetails> {
    const response = await api.get<ApiResponse<BusinessDetails>>(`/Business/${businessId}/details`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch business details');
  }

  // Get businesses for map with backend filtering
  static async getBusinessesForMap(filter: MapFilterRequest): Promise<BusinessMapDto[]> {
    const response = await api.post<ApiResponse<BusinessMapDto[]>>('/BusinessMap/businesses', filter);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch map businesses');
  }

  // Get business map statistics from backend
  static async getBusinessMapStats(): Promise<BusinessMapStats> {
    const response = await api.get<ApiResponse<BusinessMapStats>>('/BusinessMap/statistics');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch map statistics');
  }

  // Get compliance status for single business
  static async getBusinessCompliance(businessId: string): Promise<string> {
    const response = await api.get<ApiResponse<string>>(`/BusinessMap/${businessId}/compliance`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch compliance status');
  }

  // Helper functions (keep these for compatibility)
  static parseDate(dateString: string | undefined): Date | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  static isValidDate(date: Date | null): boolean {
    return date !== null && !isNaN(date.getTime());
  }
}