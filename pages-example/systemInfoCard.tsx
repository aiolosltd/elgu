// src/components/molecules/SystemInfoCard/SystemInfoCard.tsx
import * as React from "react"
import { Card } from "@/components/atoms/card"
import { Typography } from "@/components/atoms/typography"
import { Icon } from "@/components/atoms/icon"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const systemInfoCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      alert: "border-orange-200 bg-orange-50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface SystemInfoCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof systemInfoCardVariants> {
  systemInfo: string[]
  title?: string
  isLoading?: boolean
}

const SystemInfoCard = React.forwardRef<HTMLDivElement, SystemInfoCardProps>(
  ({ className, variant, systemInfo, title = "System Information", isLoading, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant={variant === "alert" ? "filled" : "default"}
        padding="md"
        className={cn(systemInfoCardVariants({ variant, className }))}
        {...props}
      >
        <div className="flex items-center mb-4">
          <Icon icon="📋" size="xl" className="mr-3" />
          <Typography variant="h3" as="h2" weight="semibold">
            {title}
          </Typography>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-start animate-pulse">
                <div className="h-2 w-2 bg-gray-200 rounded-full mt-2 mr-3"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        ) : systemInfo.length > 0 ? (
          <ul className="space-y-3">
            {systemInfo.map((info, index) => (
              <li key={index} className="flex items-start">
                <Icon icon="•" variant="primary" size="sm" className="mr-2 mt-1" />
                <Typography variant="p">
                  {info}.
                </Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="p" className="text-muted-foreground">
            No system information available
          </Typography>
        )}
      </Card>
    )
  }
)
SystemInfoCard.displayName = "SystemInfoCard"

export { SystemInfoCard }