"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
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

interface GenericHorizontalBarChartProps extends BaseChartProps {
  chartConfig: ChartConfig;
  dataKey: string;
  xAxisKey: string;
  showGrid?: boolean;
  showValues?: boolean;
  showFooter?: boolean;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  footerDescription?: string;
}

export default function GenericHorizontalBarChart({ 
  data, 
  height = 250,
  title,
  description,
  chartConfig,
  dataKey,
  xAxisKey,
  showGrid = true,
  showValues = true,
  showFooter = false,
  trend,
  footerDescription,
  className = ""
}: GenericHorizontalBarChartProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={20}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />}
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fontSize: 14 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey={dataKey}
                fill={`var(--color-${dataKey})`}
                radius={[0, 6, 6, 0]}
              >
                {showValues && (
                  <LabelList
                    dataKey={dataKey}
                    position="insideRight"
                    fill="#fff"
                    fontSize={13}
                  />
                )}
              </Bar>
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