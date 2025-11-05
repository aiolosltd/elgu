// export interface BaseChartProps {
//   data: unknown[];
//   height?: number;
//   title?: string;
//   description?: string;
//   className?: string;
// }

// export interface PieChartConfig {
//   value: {
//     label: string;
//   };
//   active: {
//     label: string;
//     color: string;
//   };
//   inactive: {
//     label: string;
//     color: string;
//   };
// }

// export interface LineChartConfig {
//   thisYear: {
//     label: string;
//     color: string;
//   };
//   lastYear: {
//     label: string;
//     color: string;
//   };
// }

// export interface BarChartConfig {
//   businesses: {
//     label: string;
//     color: string;
//   };
// }

// export interface ChartConfig {
//   [key: string]: {
//     label: string;
//     color: string;
//   };
// }


// export interface DashboardStats {
//   totalBusinesses: number;
//   compliantBusinesses: number;
//   pendingBusinesses: number;
//   nonCompliantBusinesses: number;
//   municipalities: number;
//   growthRate: number;
// }

// export interface DashboardChartData {
//   pieChart: {
//     title: string;
//     description: string;
//     data: Array<{ status: string; value: number; fill: string }>;
//   };
//   stackedBarChart: {
//     title: string;
//     description: string;
//     data: Array<{ name: number; [key: string]: number }>;
//   };
//   lineChart: {
//     title: string;
//     description: string;
//     data: Array<{ name: string; thisYear: number; lastYear: number }>;
//   };
//   horizontalBarChart: {
//     title: string;
//     description: string;
//     data: Array<{ name: string; businesses: number }>;
//   };
// }


// export const pieChartConfig: ChartConfig = {
//   active: {
//     label: "Active",
//     color: "#10b981",
//   },
//   inactive: {
//     label: "Inactive",
//     color: "#ef4444",
//   },
// };

// export const businessBarChartConfig: ChartConfig = {
//   total: {
//     label: "Total Businesses",
//     color: "#3b82f6",
//   },
// };

// export const lineChartConfig: ChartConfig = {
//   thisYear: {
//     label: "This Year",
//     color: "#3b82f6",
//   },
//   lastYear: {
//     label: "Last Year",
//     color: "#10b981",
//   },
// };

// export const horizontalBarConfig: ChartConfig = {
//   businesses: {
//     label: "Businesses",
//     color: "#f59e0b",
//   },
// };

// // Export all configs together
// export const dashboardChartConfigs = {
//   pie: pieChartConfig,
//   bar: businessBarChartConfig,
//   line: lineChartConfig,
//   horizontalBar: horizontalBarConfig
// } as const;
