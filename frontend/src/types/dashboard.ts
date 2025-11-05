// types/dashboard.ts



export interface DashboardStats {
  totalBusinesses: number;
  compliantBusinesses: number;
  pendingBusinesses: number;
  nonCompliantBusinesses: number;
  municipalities: number;
  growthRate: number;
}


// ========== BASE CHART TYPES ==========
export interface BaseChartProps {
  data: unknown[];
  height?: number;
  title?: string;
  description?: string;
  className?: string;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

// ========== DASHBOARD DATA TYPES ==========
export interface DashboardStats {
  totalBusinesses: number;
  compliantBusinesses: number;
  pendingBusinesses: number;
  nonCompliantBusinesses: number;
  municipalities: number;
  growthRate: number;
}

export interface DashboardChartData {
  pieChart: {
    title: string;
    description: string;
    data: Array<{ status: string; value: number; fill: string }>;
  };
  stackedBarChart: {
    title: string;
    description: string;
    data: Array<{ name: string; total: number; percentage?: number; color?: string }>;
  };
  lineChart: {
    title: string;
    description: string;
    data: Array<{ name: string; thisYear: number; lastYear: number }>;
  };
  horizontalBarChart: {
    title: string;
    description: string;
    data: Array<{ name: string; businesses: number }>;
  };
}

export interface EnhancedDashboardChartData extends DashboardChartData {
  pieChart: DashboardChartData['pieChart'] & { isLoading: boolean };
  stackedBarChart: DashboardChartData['stackedBarChart'] & { isLoading: boolean };
  lineChart: DashboardChartData['lineChart'] & { isLoading: boolean };
  horizontalBarChart: DashboardChartData['horizontalBarChart'] & { isLoading: boolean };
}

// ========== API RESPONSE TYPES ==========
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



export interface ComprehensiveData {
  quickStats: QuickStats;
  businessStatus: BusinessStatus[];
  monthlyComparison: MonthlyComparison[];
  municipalityDistribution: MunicipalityDistribution[];
  lastUpdated: string;
}

// ========== FILTER TYPES ==========
export interface DashboardFilters {
  year?: number;
  month?: number;
  municipality?: string;
  barangay?: string;
  businessType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// ========== TREND/CARD TYPES ==========
export interface TrendData {
  value: number;
  isPositive: boolean;
  label?: string;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  description?: string;
  trend?: TrendData;
}

export interface SummaryStat {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

// ========== TRANSFORMER RETURN TYPES ==========
export interface PieChartTransformedData {
  title: string;
  description: string;
  data: Array<{ status: string; value: number; fill: string }>;
}

export interface StackedBarTransformedData {
  title: string;
  description: string;
  data: Array<{ name: string; total: number; percentage?: number; color?: string }>;
}

export interface LineChartTransformedData {
  title: string;
  description: string;
  data: Array<{ name: string; thisYear: number; lastYear: number }>;
}

export interface HorizontalBarTransformedData {
  title: string;
  description: string;
  data: Array<{ name: string; businesses: number }>;
}

export interface ComplianceRates {
  complianceRate: number;
  nonComplianceRate: number;
  pendingRate: number;
}