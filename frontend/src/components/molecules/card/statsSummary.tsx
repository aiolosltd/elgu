// components/molecules/stats-summary/index.tsx
import * as React from "react"
import { Card } from "@/components/atoms/card"
import { Typography } from "@/components/atoms/typography"

export interface StatsSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  stats: Array<{
    label: string
    value: string | number
    color: "blue" | "green" | "yellow" | "red"
  }>
}

const StatsSummary = React.forwardRef<HTMLDivElement, StatsSummaryProps>(
  ({ className, title, stats, ...props }, ref) => {
    const colorClasses = {
      blue: "text-blue-600",
      green: "text-green-600",
      yellow: "text-yellow-600",
      red: "text-red-600",
    }

    return (
      <Card ref={ref} variant="gradient" className={className} {...props}>
        <Typography as="h2" variant="large" weight="semibold" className="mb-4 text-gray-800">
          {title}
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <Typography as="div" variant="h3" weight="bold" className={colorClasses[stat.color]}>
                {stat.value}
              </Typography>
              <Typography as="div" className="text-gray-600">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </Card>
    )
  }
)
StatsSummary.displayName = "StatsSummary"

export { StatsSummary }