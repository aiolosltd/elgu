import { useState, useEffect } from 'react';
import TotalBusinessChart from '@/components/molecules/charts/pieChart';
import MonthlyBusinessComparisonChart from '@/components/molecules/charts/lineChart';
import BusinessStatusChart from '@/components/molecules/charts/stackBarChart';
import MunicipalityChart from '@/components/molecules/charts/horizontalBarChart';
import { StatCard } from '@/components/molecules/card/statCard';
import { ChartContainer } from '@/components/molecules/card/container';
import { StatsSummary } from '@/components/molecules/card/statsSummary';
import { Building, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import { Typography } from '@/components/atoms/typography';
import type { DashboardStats } from '@/types';
import { Card } from '@/components/atoms/card';


const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    compliantBusinesses: 0,
    pendingBusinesses: 0,
    nonCompliantBusinesses: 0,
    municipalities: 0,
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalBusinesses: 156,
          compliantBusinesses: 89,
          pendingBusinesses: 42,
          nonCompliantBusinesses: 25,
          municipalities: 12,
          growthRate: 12.5
        });
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg p-6 h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const complianceRate = (stats.compliantBusinesses / stats.totalBusinesses) * 100;
  const nonComplianceRate = (stats.nonCompliantBusinesses / stats.totalBusinesses) * 100;

  const summaryStats = [
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

  return (
    <div className="p-6">
      {/* 🔹 Header */}
      <Card variant="default" padding="lg" className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-5">
        <div>
          <Typography variant="h1" as="h1" weight="bold" className="text-2xl text-gray-900 mb-1">
            Business Overview Dashboard
          </Typography>
          <Typography variant="p" className="text-gray-600">
            Get a comprehensive view of all registered businesses, compliance rates, and performance trends across municipalities.
          </Typography>

        </div>
        <div className="flex items-center space-x-3">
          {/* Download Dropdown */}


        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Businesses"
          value={stats.totalBusinesses}
          icon={Building}
          color="blue"
          trend={{
            value: stats.growthRate,
            isPositive: stats.growthRate >= 0
          }}
        />

        <StatCard
          title="Compliant"
          value={stats.compliantBusinesses}
          icon={CheckCircle}
          color="green"
          description={`${complianceRate.toFixed(1)}% of total`}
        />

        <StatCard
          title="Pending"
          value={stats.pendingBusinesses}
          icon={Clock}
          color="yellow"
          description={`${((stats.pendingBusinesses / stats.totalBusinesses) * 100).toFixed(1)}% of total`}
        />

        <StatCard
          title="Non-Compliant"
          value={stats.nonCompliantBusinesses}
          icon={XCircle}
          color="red"
          description={`${nonComplianceRate.toFixed(1)}% of total`}
        />

        <StatCard
          title="Municipalities"
          value={stats.municipalities}
          icon={MapPin}
          color="purple"
          description="Coverage area"
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Row 1: Two columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer title="Total Business Distribution">
            <TotalBusinessChart />
          </ChartContainer>

          <ChartContainer title="Business Compliance Status">
            <BusinessStatusChart />
          </ChartContainer>
        </div>

        {/* Row 2: Single column */}
        <div className="space-y-8">
          <ChartContainer title="Monthly Business Trends">
            <MonthlyBusinessComparisonChart />
          </ChartContainer>

          <ChartContainer title="Businesses by Municipality">
            <MunicipalityChart />
          </ChartContainer>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <StatsSummary
        title="Performance Summary"
        stats={summaryStats}
        className="mt-8"
      />
    </div>
  );
};

export default DashboardPage;