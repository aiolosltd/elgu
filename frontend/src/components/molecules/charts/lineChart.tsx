"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartFooter } from './ChartFooter'
import type { BaseChartProps, ChartConfig } from "@/types/charts"

interface GenericLineChartProps extends BaseChartProps {
  chartConfig: ChartConfig;
  xAxisKey: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showFooter?: boolean;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  footerDescription?: string;
}

export default function GenericLineChart({ 
  data, 
  height = 300,
  title,
  description,
  chartConfig,
  xAxisKey,
  showGrid = true,
  showLegend = true,
  showFooter = false,
  trend,
  footerDescription,
  className = ""
}: GenericLineChartProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {showLegend && <Legend />}
              {Object.keys(chartConfig).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      {showFooter && (
        <ChartFooter 
          trend={trend}
          description={footerDescription}
        />
      )}
    </Card>
  )
}