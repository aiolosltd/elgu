"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
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
import type { BaseChartProps, ChartConfig } from "@/types"
// import type { BaseChartProps, ChartConfig } from "@/types/charts"

interface GenericBarChartProps extends BaseChartProps {
  dataKey: string;
  xAxisKey: string;
  chartConfig: ChartConfig;
  barColor?: string;
  showGrid?: boolean;
  showFooter?: boolean;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  footerDescription?: string;
}

export default function GenericBarChart({ 
  data, 
  height = 300,
  title,
  description,
  dataKey,
  xAxisKey,
  chartConfig,
  barColor,
  showGrid = true,
  showFooter = false,
  trend,
  footerDescription,
  className = ""
}: GenericBarChartProps) {
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid vertical={false} />}
              <XAxis 
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar 
                dataKey={dataKey} 
                fill={barColor || `var(--color-${dataKey})`}
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
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