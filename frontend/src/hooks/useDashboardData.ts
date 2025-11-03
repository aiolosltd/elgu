// hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';
import type { 
  EnhancedDashboardChartData, 
  DashboardStats 
} from '@/types/dashboard';

// Import from single files
import {
  calculateGrowthRate,
  transformPieChartData,
  transformStackedBarChartData,
  transformLineChartData,
  transformHorizontalBarChartData
} from '@/utils/dashboard';

import {
  initialChartData,
  initialStats
} from '@/data/dashboard';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [chartData, setChartData] = useState<EnhancedDashboardChartData>(initialChartData);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setGlobalLoading(true);
        setError(null);

        // Set all charts to loading
        setChartData(prev => ({
          pieChart: { ...prev.pieChart, isLoading: true },
          stackedBarChart: { ...prev.stackedBarChart, isLoading: true },
          lineChart: { ...prev.lineChart, isLoading: true },
          horizontalBarChart: { ...prev.horizontalBarChart, isLoading: true }
        }));

        console.log('🔄 [useDashboardData] Starting to fetch dashboard data...');

        // Parallel API calls
        const [quickStats, businessStatus, monthlyComparison, municipalityDistribution] = await Promise.all([
          dashboardService.getQuickStats(),
          dashboardService.getBusinessStatus(), 
          dashboardService.getMonthlyComparison(),
          dashboardService.getMunicipalityDistribution()
        ]);

        console.log('✅ [useDashboardData] API calls completed');
        
        // ========== CRITICAL DEBUG LOGS ==========
        console.log('📊 [useDashboardData] BUSINESS STATUS API RESPONSE:', businessStatus);
        console.log('🎨 [useDashboardData] Business Status Colors:', businessStatus.map(item => ({
          status: item.statusGroup,
          color: item.color,
          total: item.total
        })));
        
        console.log('📈 [useDashboardData] QUICK STATS:', quickStats);
        console.log('📅 [useDashboardData] MONTHLY COMPARISON:', monthlyComparison);
        console.log('🏙️ [useDashboardData] MUNICIPALITY DISTRIBUTION:', municipalityDistribution);

        // Update stats
        const updatedStats = {
          totalBusinesses: quickStats.totalBusinesses,
          compliantBusinesses: quickStats.verifiedBusinesses,
          pendingBusinesses: quickStats.unverifiedBusinesses,
          nonCompliantBusinesses: quickStats.inactiveBusinesses,
          municipalities: quickStats.totalMunicipalities,
          growthRate: calculateGrowthRate(monthlyComparison)
        };

        console.log('📋 [useDashboardData] Updated Stats:', updatedStats);
        setStats(updatedStats);

        // Transform chart data with detailed logging
        console.log('🔄 [useDashboardData] Transforming chart data...');
        
        const pieChartTransformed = transformPieChartData(businessStatus);
        console.log('🥧 [useDashboardData] Pie Chart Transformed:', pieChartTransformed);

        const stackedBarTransformed = transformStackedBarChartData(businessStatus);
        console.log('📊 [useDashboardData] Stacked Bar Transformed:', stackedBarTransformed);
        console.log('🔢 [useDashboardData] Stacked Bar Data Items:', stackedBarTransformed.data.map(item => ({
          name: item.name,
          total: item.total,
          color: item.color,
          hasColor: !!item.color
        })));

        const lineChartTransformed = transformLineChartData(monthlyComparison);
        console.log('📈 [useDashboardData] Line Chart Transformed:', lineChartTransformed);

        // Update charts with transformed data
        setChartData(prev => ({
          ...prev,
          pieChart: {
            ...pieChartTransformed,
            isLoading: false
          },
          stackedBarChart: {
            ...stackedBarTransformed,
            isLoading: false
          },
          lineChart: {
            ...lineChartTransformed,
            isLoading: false
          }
        }));

        console.log('✅ [useDashboardData] Charts updated with transformed data');

        // Fetch additional data for horizontal bar chart
        console.log('🔄 [useDashboardData] Fetching barangay data...');
        let barangayData: Awaited<ReturnType<typeof dashboardService.getBarangayData>> = [];
        if (municipalityDistribution.length > 0) {
          const topMunicipality = municipalityDistribution[0].municipality;
          console.log('📍 [useDashboardData] Top Municipality:', topMunicipality);
          barangayData = await dashboardService.getBarangayData(topMunicipality);
          console.log('🏘️ [useDashboardData] Barangay Data:', barangayData);
        } else {
          console.log('❌ [useDashboardData] No municipality data available for barangay fetch');
        }

        const horizontalBarTransformed = transformHorizontalBarChartData(barangayData);
        console.log('📊 [useDashboardData] Horizontal Bar Transformed:', horizontalBarTransformed);

        setChartData(prev => ({
          ...prev,
          horizontalBarChart: {
            ...horizontalBarTransformed,
            isLoading: false
          }
        }));

        console.log('✅ [useDashboardData] All dashboard data loaded successfully!');

      } catch (err) {
        console.error('❌ [useDashboardData] Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        
        // Stop all loading states on error
        setChartData(prev => ({
          pieChart: { ...prev.pieChart, isLoading: false },
          stackedBarChart: { ...prev.stackedBarChart, isLoading: false },
          lineChart: { ...prev.lineChart, isLoading: false },
          horizontalBarChart: { ...prev.horizontalBarChart, isLoading: false }
        }));
      } finally {
        setGlobalLoading(false);
        console.log('🏁 [useDashboardData] Dashboard loading completed');
      }
    };

    fetchDashboardData();
  }, []);

  // Return the data with current state
  console.log('🔄 [useDashboardData] Returning data:', {
    stats,
    chartData: {
      pieChart: chartData.pieChart,
      stackedBarChart: {
        ...chartData.stackedBarChart,
        data: chartData.stackedBarChart.data.map(item => ({
          name: item.name,
          total: item.total,
          color: item.color,
          hasColor: !!item.color
        }))
      }
    },
    loading: globalLoading,
    error
  });

  return { 
    stats, 
    chartData, 
    loading: globalLoading, 
    error 
  };
};