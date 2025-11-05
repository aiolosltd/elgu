// pages/DashboardPage.tsx
import { useState, useMemo } from 'react';

// Components
import GenericPieChart from '@/components/molecules/charts/pieChart';
import GenericBarChart from '@/components/molecules/charts/barChart';
import GenericLineChart from '@/components/molecules/charts/lineChart';
import GenericHorizontalBarChart from '@/components/molecules/charts/horizontalBarChart';
import { StatCard } from '@/components/molecules/card/statCard';
import { StatsSummary } from '@/components/molecules/card/statsSummary';
import { Building, CheckCircle, Clock, XCircle, MapPin, Filter } from 'lucide-react';
import { Typography } from '@/components/atoms/typography';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusinessHeatmap } from '@/components/molecules/charts/heatMap'
// Hooks
import { useDashboardData } from '@/hooks/useDashboardData';

// Centralized imports
import { 
  dashboardChartConfigs, 
  chartTrends, 
  getSummaryStats,
  MONTHS 
} from '@/data/dashboard';

import { 
  calculateComplianceRates, 
  formatNumber, 
  formatPercentage,
  isValidData 
} from '@/utils/dashboard';

import type { 
  DashboardFilters,
  // TrendData,
  ChartConfig
} from '@/types';

const DashboardPage = () => {
  const { stats, chartData, loading, error } = useDashboardData();

  // Debug the stacked bar chart data
  console.log('🎯 DASHBOARD PAGE - Stacked Bar Chart Data:', chartData.stackedBarChart.data);
  console.log('🎯 DASHBOARD PAGE - Stacked Bar Chart Data Length:', chartData.stackedBarChart.data.length);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({});

  // Dynamic config for bar chart that uses API colors
  const dynamicBarChartConfig = useMemo(() => {
    console.log('🎨 Creating dynamic bar chart config...');
    
    const config: ChartConfig = {};
    
    chartData.stackedBarChart.data.forEach((item: any) => {
      console.log('🎨 Processing item for config:', item);
      config[item.name] = {
        label: item.name,
        color: item.color || "#3b82f6" // Use color from API or fallback
      };
    });
    
    console.log('🎨 Final dynamic config:', config);
    return config;
  }, [chartData.stackedBarChart.data]);

  // ========== CALCULATIONS ==========
  const { complianceRate, nonComplianceRate, pendingRate } = calculateComplianceRates(stats);
  const summaryStats = getSummaryStats(stats);

  // Use the transformed data directly (no need for additional transformation)
  const businessBarData = chartData.stackedBarChart.data;

  console.log('📊 FINAL Business Bar Data for chart:', businessBarData);
  console.log('⚙️ FINAL Chart Config:', dynamicBarChartConfig);

  // ========== LOADING & ERROR STATES ==========
  if (loading) {
    return <DashboardLoadingState />;
  }

  if (error) {
    return <DashboardErrorState error={error} />;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6">
      
      {/* 🔹 Page Header with Filters */}
      <DashboardHeader 
        filters={filters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onFiltersChange={setFilters}
      />

      {/* 🔹 Statistics Cards Grid */}
      <StatisticsGrid 
        stats={stats}
        complianceRate={complianceRate}
        pendingRate={pendingRate}
        nonComplianceRate={nonComplianceRate}
      />

      {/* 🔹 Charts Section */}
      <DashboardCharts 
        chartData={chartData}
        businessBarData={businessBarData}
        dynamicBarChartConfig={dynamicBarChartConfig}
      />

      {/* 🔹 Performance Summary */}
      <StatsSummary
        title="Performance Summary"
        stats={summaryStats}
        className="mt-6"
      />
    </div>
  );
};

// ========== SUB-COMPONENTS ==========

interface DashboardHeaderProps {
  filters: DashboardFilters;
  showFilters: boolean;
  onToggleFilters: () => void;
  onFiltersChange: (filters: DashboardFilters) => void;
}

const DashboardHeader = ({ 
  filters, 
  showFilters, 
  onToggleFilters, 
  onFiltersChange 
}: DashboardHeaderProps) => {
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof DashboardFilters] !== undefined
  ).length;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <CardTitle>
            <Typography variant="h3" as="h1" weight="bold" className="mb-2 text-lg sm:text-xl md:text-2xl">
              Business Overview Dashboard
            </Typography>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Get a comprehensive view of all registered businesses, compliance rates, and performance trends across Leganes.
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </Badge>
            )}
          </CardDescription>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/50">
          <Typography variant="h4" as="h3" className="mb-3 text-sm font-semibold">
            Filter Dashboard Data
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Year</label>
              <select 
                className="w-full p-2 border rounded text-sm"
                value={filters.year || ''}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  year: e.target.value ? parseInt(e.target.value) : undefined 
                })}
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1 block">Month</label>
              <select 
                className="w-full p-2 border rounded text-sm"
                value={filters.month || ''}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  month: e.target.value ? parseInt(e.target.value) : undefined 
                })}
              >
                <option value="">All Months</option>
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Status</label>
              <select 
                className="w-full p-2 border rounded text-sm"
                value={filters.status || ''}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  status: e.target.value || undefined 
                })}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({})}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

interface StatisticsGridProps {
  stats: any;
  complianceRate: number;
  pendingRate: number;
  nonComplianceRate: number;
}

const StatisticsGrid = ({ 
  stats, 
  complianceRate, 
  pendingRate, 
  nonComplianceRate 
}: StatisticsGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
    <StatCard
      title="Total Businesses"
      value={stats.totalBusinesses}
      icon={Building}
      color="blue"
      trend={{
        value: stats.growthRate,
        isPositive: stats.growthRate >= 0
      }}
      description={`${formatNumber(stats.totalBusinesses)} registered`}
    />

    <StatCard
      title="Compliant"
      value={stats.compliantBusinesses}
      icon={CheckCircle}
      color="green"
      description={`${formatPercentage(complianceRate)} of total`}
    />

    <StatCard
      title="Pending"
      value={stats.pendingBusinesses}
      icon={Clock}
      color="yellow"
      description={`${formatPercentage(pendingRate)} of total`}
    />

    <StatCard
      title="Non-Compliant"
      value={stats.nonCompliantBusinesses}
      icon={XCircle}
      color="red"
      description={`${formatPercentage(nonComplianceRate)} of total`}
    />

    <StatCard
      title="Barangays Covered"
      value={stats.municipalities}
      icon={MapPin}
      color="purple"
      description="Coverage areas"
    />
  </div>
);

interface DashboardChartsProps {
  chartData: any;
  businessBarData: any[];
  dynamicBarChartConfig: ChartConfig;
}

const DashboardCharts = ({ chartData, businessBarData, dynamicBarChartConfig }: DashboardChartsProps) => {
  // Check if charts have data
  const hasPieData = isValidData(chartData.pieChart.data);
  const hasBarData = isValidData(businessBarData);
  const hasLineData = isValidData(chartData.lineChart.data);
  const hasHorizontalData = isValidData(chartData.horizontalBarChart.data);

  console.log('📊 Charts Data Check:', {
    hasPieData,
    hasBarData,
    hasLineData,
    hasHorizontalData
  });

  return (
    <div className="space-y-6">

      <BusinessHeatmap 
        height={400}
        showControls={true}
        className="w-full"
      />

      {/* Row 1: Pie Chart and Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasPieData ? (
          <GenericPieChart
            data={chartData.pieChart.data}
            title={chartData.pieChart.title}
            description={chartData.pieChart.description}
            chartConfig={dashboardChartConfigs.pie}
            dataKey="value"
            nameKey="status"
            height={320}
            showFooter={true}
            trend={chartTrends.pieChart}
            footerDescription="Showing total active and inactive businesses"
          />
        ) : (
          <EmptyChartState 
            title="Business Status Distribution"
            description="No data available for pie chart"
          />
        )}

        {hasBarData ? (
          <GenericBarChart
            data={businessBarData}
            title="Business Status Overview"
            description="Total businesses by status category"
            dataKey="total"
            xAxisKey="name"
            chartConfig={dynamicBarChartConfig}
            height={320}
            showFooter={true}
            trend={chartTrends.barChart}
            footerDescription="Showing all business status categories"
          />
        ) : (
          <EmptyChartState 
            title="Business Status Overview"
            description="No data available for bar chart"
          />
        )}
      </div>

      {/* Row 2: Line Chart */}
      {hasLineData ? (
        <GenericLineChart
          data={chartData.lineChart.data}
          title={chartData.lineChart.title}
          description={chartData.lineChart.description}
          chartConfig={dashboardChartConfigs.line}
          xAxisKey="name"
          height={350}
          showFooter={true}
          trend={chartTrends.lineChart}
          footerDescription="Data from January to December 2024"
        />
      ) : (
        <EmptyChartState 
          title="Monthly Business Registration Trends"
          description="No data available for line chart"
          fullWidth
        />
      )}

      {/* Row 3: Horizontal Bar Chart */}
      {hasHorizontalData ? (
        <GenericHorizontalBarChart
          data={chartData.horizontalBarChart.data}
          title={chartData.horizontalBarChart.title}
          description={chartData.horizontalBarChart.description}
          chartConfig={dashboardChartConfigs.horizontalBar}
          dataKey="businesses"
          xAxisKey="name"
          height={300}
          showFooter={true}
          trend={chartTrends.horizontalBarChart}
          footerDescription="Data collected from all registered Leganes "
        />
      ) : (
        <EmptyChartState 
          title="Top Barangays by Business Count"
          description="No data available for horizontal bar chart"
          fullWidth
        />
      )}
    </div>
  );
};

// ========== UTILITY COMPONENTS ==========

const DashboardLoadingState = () => (
  <div className="p-4 sm:p-6">
    <div className="animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-4 h-24 sm:h-28"></div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 h-80"></div>
        ))}
      </div>
    </div>
  </div>
);

interface DashboardErrorStateProps {
  error: string;
}

const DashboardErrorState = ({ error }: DashboardErrorStateProps) => (
  <div className="p-6 text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
      <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <Typography variant="h4" as="h2" className="text-red-800 mb-2">
        Unable to Load Dashboard
      </Typography>
      <Typography variant="h1" className="text-red-600 mb-4">
        {error}
      </Typography>
      <Button 
        onClick={() => window.location.reload()} 
        variant="default"
      >
        Retry
      </Button>
    </div>
  </div>
);

interface EmptyChartStateProps {
  title: string;
  description: string;
  fullWidth?: boolean;
}

const EmptyChartState = ({ title, description, fullWidth = false }: EmptyChartStateProps) => (
  <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 text-center ${fullWidth ? 'w-full' : ''}`}>
    <div className="max-w-sm mx-auto">
      <Typography variant="h4" as="h3" className="text-gray-600 mb-2">
        {title}
      </Typography>
      <Typography variant="h1" className="text-gray-500">
        {description}
      </Typography>
    </div>
  </div>
);

export default DashboardPage;