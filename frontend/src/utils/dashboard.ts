// utils/dashboard.ts
import type { 
  MonthlyComparison, 
  BusinessStatus, 
  BarangayData,
  DashboardStats,
  PieChartTransformedData,
  StackedBarTransformedData,
  LineChartTransformedData,
  HorizontalBarTransformedData,
  ComplianceRates
} from '@/types/dashboard';

// ========== DATA TRANSFORMERS ==========

/**
 * Calculate growth rate from monthly data
 */
export const calculateGrowthRate = (monthlyData: MonthlyComparison[]): number => {
  if (monthlyData.length === 0) return 0;
  
  const thisYearTotal = monthlyData
    .filter(item => item.seriesName === 'This Year')
    .reduce((sum, item) => sum + item.total, 0);
  
  const lastYearTotal = monthlyData
    .filter(item => item.seriesName === 'Last Year')
    .reduce((sum, item) => sum + item.total, 0);

  if (lastYearTotal === 0) return 0;
  
  return Number(((thisYearTotal - lastYearTotal) / lastYearTotal * 100).toFixed(2));
};

/**
 * Transform business status data for pie chart
 */
export const transformPieChartData = (businessStatus: BusinessStatus[]): PieChartTransformedData => {
  console.log('🔄 Transforming businessStatus for pie chart - INPUT:', businessStatus);
  
  const activeCount = businessStatus.find(item => item.statusGroup === 'Active')?.total || 0;
  const inactiveCount = businessStatus.find(item => item.statusGroup === 'Inactive')?.total || 0;

  const pieData = {
    title: "Business Status Distribution",
    description: "Active vs Inactive businesses across all municipalities",
    data: [
      { status: "active", value: activeCount, fill: "#10b981" },
      { status: "inactive", value: inactiveCount, fill: "#ef4444" }
    ]
  };

  console.log('🥧 Pie chart transformed data - OUTPUT:', pieData);
  return pieData;
};

/**
 * Transform business status data for separate bars (one bar per status group)
 */
// utils/dashboard.ts - Make sure transformStackedBarChartData preserves colors

/**
 * Transform business status data for separate bars (one bar per status group)
 */
export const transformStackedBarChartData = (businessStatus: BusinessStatus[]): StackedBarTransformedData => {
  console.log('🔄 [transformStackedBarChartData] Transforming businessStatus - INPUT:', businessStatus);
  
  // Create separate bars for each status group - MAKE SURE TO PRESERVE COLORS
  const chartData = businessStatus.map(item => ({
    name: item.statusGroup,
    total: item.total,
    percentage: item.percentage,
    color: item.color, // CRITICAL: Preserve the color from API
    fill: item.color   // ADD THIS: Some charts need 'fill' property
  }));

  console.log('📊 [transformStackedBarChartData] Output data with colors:', chartData.map(item => ({
    name: item.name,
    total: item.total,
    color: item.color,
    fill: item.fill
  })));

  return {
    title: "Business Status Overview",
    description: "Total businesses by status category",
    data: chartData
  };
};

/**
 * Transform monthly comparison data for line chart
 */
export const transformLineChartData = (monthlyComparison: MonthlyComparison[]): LineChartTransformedData => {
  const thisYearData = monthlyComparison.filter(item => item.seriesName === 'This Year');
  const lastYearData = monthlyComparison.filter(item => item.seriesName === 'Last Year');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = months.map((month, index) => {
    const thisYearMonth = thisYearData.find(item => item.month === index + 1);
    const lastYearMonth = lastYearData.find(item => item.month === index + 1);

    return {
      name: month,
      thisYear: thisYearMonth?.total || 0,
      lastYear: lastYearMonth?.total || 0
    };
  });

  return {
    title: "Monthly Business Registration Trends",
    description: "Year-over-year comparison of business registration patterns",
    data: chartData
  };
};

/**
 * Transform barangay data for horizontal bar chart
 */
export const transformHorizontalBarChartData = (barangayData: BarangayData[]): HorizontalBarTransformedData => {
  const sortedData = barangayData
    .sort((a, b) => b.totalBusinesses - a.totalBusinesses)
    .slice(0, 5);

  return {
    title: "Top Barangays by Business Count",
    description: "Barangays with the highest concentration of registered businesses",
    data: sortedData.map(item => ({
      name: item.barangay,
      businesses: item.totalBusinesses
    }))
  };
};

/**
 * Calculate compliance rates from stats
 */
export const calculateComplianceRates = (stats: DashboardStats): ComplianceRates => {
  const complianceRate = (stats.compliantBusinesses / stats.totalBusinesses) * 100;
  const nonComplianceRate = (stats.nonCompliantBusinesses / stats.totalBusinesses) * 100;
  
  return {
    complianceRate: Number(complianceRate.toFixed(1)),
    nonComplianceRate: Number(nonComplianceRate.toFixed(1)),
    pendingRate: Number(((stats.pendingBusinesses / stats.totalBusinesses) * 100).toFixed(1))
  };
};

// ========== DATA FORMATTERS ==========

/**
 * Format numbers with commas for display
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'PHP'): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ========== VALIDATORS ==========

/**
 * Check if data is empty or invalid
 */
export const isValidData = (data: unknown[]): boolean => {
  return Array.isArray(data) && data.length > 0;
};

/**
 * Validate dashboard stats
 */
export const validateStats = (stats: DashboardStats): boolean => {
  return (
    typeof stats.totalBusinesses === 'number' &&
    typeof stats.compliantBusinesses === 'number' &&
    typeof stats.pendingBusinesses === 'number' &&
    typeof stats.nonCompliantBusinesses === 'number' &&
    typeof stats.municipalities === 'number' &&
    typeof stats.growthRate === 'number'
  );
};

// ========== CHART VALIDATORS ==========

/**
 * Check if chart data is valid and has values
 */
export const hasChartData = (data: unknown[]): boolean => {
  if (!isValidData(data)) return false;
  
  return data.some(item => {
    if (typeof item === 'object' && item !== null) {
      return Object.values(item).some(val => 
        typeof val === 'number' && val > 0
      );
    }
    return false;
  });
};

/**
 * Get default chart height based on screen size
 */
export const getChartHeight = (defaultHeight: number = 300): number => {
  if (typeof window === 'undefined') return defaultHeight;
  
  const width = window.innerWidth;
  if (width < 640) return defaultHeight - 50; // mobile
  if (width < 1024) return defaultHeight - 20; // tablet
  return defaultHeight; // desktop
};

/**
 * Generate chart footer text based on data
 */
export const getChartFooter = (data: unknown[], defaultText: string): string => {
  if (!hasChartData(data)) {
    return "No data available for the selected period";
  }
  
  const total = Array.isArray(data) ? data.reduce((sum: number, item: any) => {
    if (typeof item === 'object' && item !== null) {
      const values = Object.values(item).filter(val => typeof val === 'number');
      return sum + values.reduce((a: number, b: number) => a + b, 0);
    }
    return sum;
  }, 0) : 0;

  return `${defaultText} | Total: ${formatNumber(total)}`;
};