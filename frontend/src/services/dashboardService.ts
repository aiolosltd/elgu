// services/dashboardService.ts
import api from './api';

export interface QuickStats {
  totalBusinesses: number;
  activeBusinesses: number;
  inactiveBusinesses: number;
  totalMunicipalities: number;
  totalBarangays: number;
  verifiedBusinesses: number;
  unverifiedBusinesses: number;
  lastUpdated: string;
}

export interface BusinessStatus {
  statusGroup: string;
  total: number;
  color: string;
  percentage: number;
}

export interface MonthlyComparison {
  year: number;
  month: number;
  monthName: string;
  total: number;
  seriesName: string;
}

export interface MunicipalityDistribution {
  municipality: string;
  totalBusinesses: number;
  percentage: number;
}

export interface BarangayData {
  barangay: string;
  totalBusinesses: number;
  municipality: string;
  percentage: number;
}

export interface BusinessDetails {
  id: number;
  businessId: string;
  businessName: string;
  street: string;
  buildingName: string;
  email: string;
  contactNumber: string;
  status: string;
  registrationDate: string;
}

export interface ComprehensiveData {
  quickStats: QuickStats;
  businessStatus: BusinessStatus[];
  monthlyComparison: MonthlyComparison[];
  municipalityDistribution: MunicipalityDistribution[];
  lastUpdated: string;
}

class DashboardService {
  // Get quick stats
  async getQuickStats(): Promise<QuickStats> {
    const response = await api.get<QuickStats>('/Dashboard/quick-stats');
    return response.data;
  }

  // Get business status
  async getBusinessStatus(): Promise<BusinessStatus[]> {
    const response = await api.get<BusinessStatus[]>('/Dashboard/business-status');
    return response.data;


  }

  // Get monthly comparison
  async getMonthlyComparison(): Promise<MonthlyComparison[]> {
    const response = await api.get<MonthlyComparison[]>('/Dashboard/monthly-comparison');
    return response.data;
  }

  // Get municipality distribution
  async getMunicipalityDistribution(): Promise<MunicipalityDistribution[]> {
    const response = await api.get<MunicipalityDistribution[]>('/Dashboard/municipality-distribution');
    return response.data;
  }

  // Get barangay data
  async getBarangayData(municipality: string): Promise<BarangayData[]> {
    const response = await api.get<BarangayData[]>(`/Dashboard/barangay-data/${municipality}`);
    return response.data;
  }

  // Get business details
  async getBusinessDetails(municipality: string, barangay: string): Promise<BusinessDetails[]> {
    const response = await api.get<BusinessDetails[]>(
      `/Dashboard/business-details/${municipality}/${barangay}`
    );
    return response.data;
  }

  // Get comprehensive data (all in one call)
  async getComprehensiveData(): Promise<ComprehensiveData> {
    const response = await api.get<ComprehensiveData>('/Dashboard/comprehensive-data');
    return response.data;
  }

  // Get chart data with filters
  async getChartData(
    chartType: string,
    filters?: {
      year?: number;
      month?: number;
      municipality?: string;
      barangay?: string;
      businessType?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/Dashboard/chart-data/${chartType}?${params}`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();