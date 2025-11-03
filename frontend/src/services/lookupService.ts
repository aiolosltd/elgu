import api from './api';
import type { LookupOptions } from '@/types';


class LookupService {
  // Get all lookup options
  async getAllOptions(): Promise<LookupOptions> {
    try {
      const response = await api.get('/Lookup');
      return response.data.data; // Assuming your API returns { success: true, data: {...} }
    } catch (error) {
      console.error('Error fetching lookup options:', error);
      return {};
    }
  }

  // Get options by specific type (gender, civilstatus, nationality, etc.)
  async getOptionsByType(type: string): Promise<string[]> {
    try {
      const response = await api.get(`/Lookup/${type}`);
      return response.data.data || []; // Assuming your API returns { success: true, data: [...] }
    } catch (error) {
      console.error(`Error fetching ${type} options:`, error);
      return [];
    }
  }

  // Get specific options with fallback
  async getGenderOptions(): Promise<string[]> {
    return await this.getOptionsByType('gender');
  }

  async getCivilStatusOptions(): Promise<string[]> {
    return await this.getOptionsByType('civilstatus');
  }

  async getNationalityOptions(): Promise<string[]> {
    return await this.getOptionsByType('nationality');
  }

  async getOwnershipTypeOptions(): Promise<string[]> {
    return await this.getOptionsByType('ownershiptype');
  }

  async getProvinceOptions(): Promise<string[]> {
    return await this.getOptionsByType('province');
  }

  async getMunicipalityOptions(): Promise<string[]> {
    return await this.getOptionsByType('municipality');
  }

  async getBarangayOptions(): Promise<string[]> {
    return await this.getOptionsByType('barangay');
  }
}

export const lookupService = new LookupService();