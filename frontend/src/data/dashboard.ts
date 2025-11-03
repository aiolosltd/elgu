// data/dashboard.ts
import type { 
  EnhancedDashboardChartData, 
  DashboardStats,
  TrendData,
  ChartConfig,
  SummaryStat
} from '@/types/dashboard';

// ========== CHART CONFIGURATIONS ==========
export const pieChartConfig: ChartConfig = {
  active: {
    label: "Active",
    color: "#10b981",
  },
  inactive: {
    label: "Inactive",
    color: "#ef4444",
  },
};

export const businessBarChartConfig: ChartConfig = {
  total: {
    label: "Total Businesses",
    color: "#3b82f6",
  },
};

export const lineChartConfig: ChartConfig = {
  thisYear: {
    label: "This Year",
    color: "#3b82f6",
  },
  lastYear: {
    label: "Last Year",
    color: "#10b981",
  },
};

export const horizontalBarConfig: ChartConfig = {
  businesses: {
    label: "Businesses",
    color: "#f59e0b",
  },
};

// Export all configs together
export const dashboardChartConfigs = {
  pie: pieChartConfig,
  bar: businessBarChartConfig,
  line: lineChartConfig,
  horizontalBar: horizontalBarConfig
} as const;

// ========== DEFAULT DATA ==========
export const initialChartData: EnhancedDashboardChartData = {
  pieChart: {
    title: "Business Status Distribution",
    description: "Active vs Inactive businesses across all municipalities",
    data: [],
    isLoading: true
  },
  stackedBarChart: {
    title: "Business Status Overview", 
    description: "Total businesses by status category",
    data: [],
    isLoading: true
  },
  lineChart: {
    title: "Monthly Business Registration Trends",
    description: "Year-over-year comparison of business registration patterns",
    data: [],
    isLoading: true
  },
  horizontalBarChart: {
    title: "Top Barangays by Business Count",
    description: "Barangays with the highest concentration of registered businesses", 
    data: [],
    isLoading: true
  }
};

export const initialStats: DashboardStats = {
  totalBusinesses: 0,
  compliantBusinesses: 0,
  pendingBusinesses: 0,
  nonCompliantBusinesses: 0,
  municipalities: 0,
  growthRate: 0
};

// ========== TREND CONFIGURATIONS ==========
export const chartTrends: Record<string, TrendData> = {
  pieChart: { 
    value: 5.2, 
    isPositive: true, 
    label: "Trending up by 5.2% this month" 
  },
  barChart: { 
    value: 12.5, 
    isPositive: true 
  },
  lineChart: { 
    value: 8.3, 
    isPositive: true 
  },
  horizontalBarChart: { 
    value: 3.7, 
    isPositive: true 
  }
} as const;

// ========== STATIC DATA ==========
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const STATUS_COLORS = {
  active: "#10b981",
  inactive: "#ef4444", 
  verified: "#3b82f6",
  unverified: "#f59e0b",
  pending: "#f59e0b",
  rejected: "#ef4444"
} as const;

// ========== SUMMARY STATS TEMPLATE ==========
export const getSummaryStats = (stats: DashboardStats): SummaryStat[] => {
  const complianceRate = (stats.compliantBusinesses / stats.totalBusinesses) * 100;
  const nonComplianceRate = (stats.nonCompliantBusinesses / stats.totalBusinesses) * 100;

  return [
    {
      label: "Total Registered",
      value: stats.totalBusinesses,
      color: "blue" as const
    },
    {
      label: "Compliance Rate",
      value: `${complianceRate.toFixed(0)}%`,
      color: "green" as const
    },
    {
      label: "Need Attention",
      value: stats.pendingBusinesses,
      color: "yellow" as const
    },
    {
      label: "Non-Compliant",
      value: `${nonComplianceRate.toFixed(0)}%`,
      color: "red" as const
    }
  ];
};