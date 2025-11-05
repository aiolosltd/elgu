"use client"

import { LabelList, Pie, PieChart } from "recharts"
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
// import type { BaseChartProps, ChartConfig } from "@/types/charts"
import type { BaseChartProps, ChartConfig } from "@/types"
import { ChartFooter } from '@/components/molecules/charts/ChartFooter'

interface GenericPieChartProps extends BaseChartProps {
  chartConfig: ChartConfig;
  dataKey: string;
  nameKey: string;
  showLabels?: boolean;
  showFooter?: boolean;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  footerDescription?: string;
}

export default function GenericPieChart({
  data,
  height = 250,
  title,
  description,
  chartConfig,
  dataKey,
  nameKey,
  showLabels = true,
  showFooter = false,
  trend,
  footerDescription,
  className = ""
}: GenericPieChartProps) {
  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square"
          style={{ maxHeight: `${height}px` }}
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey={dataKey} hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              stroke="#fff"
              strokeWidth={2}
              labelLine={false}
            >
              {showLabels && (
                <LabelList
                  dataKey={nameKey}
                  position="inside"
                  className="fill-white font-medium"
                  fontSize={12}
                  stroke="none"
                  formatter={(value: string) => chartConfig[value]?.label || value}
                />
              )}
            </Pie>
          </PieChart>
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