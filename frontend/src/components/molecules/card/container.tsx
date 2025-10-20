import * as React from "react"
import { Card } from "@/components/atoms/card"
import { Typography } from "@/components/atoms/typography"

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={className} {...props}>
        <Typography as="h2" variant="h4" weight="semibold" className="mb-4 text-gray-800">
          {title}
        </Typography>
        <div className="w-full h-80">
          {children}
        </div>
      </Card>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

export { ChartContainer }