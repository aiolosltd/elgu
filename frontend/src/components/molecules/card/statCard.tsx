// components/molecules/stat-card/index.tsx
import * as React from "react"
import { Card } from "@/components/atoms/card"
import { Typography } from "@/components/atoms/typography"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statCardVariants = cva("", {
    variants: {
        layout: {
            default: "text-blue-600",
            trend: "flex items-center text-sm",
        },
        color: {
            default: "text-gray-600",
            blue: "text-blue-600",
            green: "text-green-600",
            yellow: "text-yellow-600",
            red: "text-red-600",
            purple: "text-purple-600",
            orange : "text-orange-600"
        }
    },
    defaultVariants: {
        layout: "default",
        color: "blue",
    },
})

export interface StatCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
    title: string
    value: string | number
    color?: "blue" | "green" | "yellow" | "red" | "purple" | "orange"
    icon: React.ComponentType<{ className?: string }>
    description?: string
    trend?: {
        value: number
        isPositive: boolean
    }
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    ({ className, title, value, icon: Icon, description, trend, color, layout, ...props }, ref) => {
        const bgColorClass = {
            blue: "bg-blue-100",
            green: "bg-green-100",
            yellow: "bg-yellow-100",
            red: "bg-red-100",
            purple: "bg-purple-100",
            orange : "bg-orange-100"
        }[color || "blue"]

        const trendColorClass = trend?.isPositive ? "text-green-600" : "text-red-600"

        return (
            <Card ref={ref} className={cn("hover:shadow-xl transition-shadow duration-300", className)} {...props}>
                <div className="flex items-center justify-between">
                    <div>
                        <Typography variant="small" weight="medium" className="text-gray-600 mb-2">
                            {title}
                        </Typography>
                        <Typography variant="h2" weight="bold" className={statCardVariants({ color, layout })}>
                            {value}
                        </Typography>
                        {description && (
                            <Typography variant="small" className="text-gray-600 mt-2">
                                {description}
                            </Typography>
                        )}
                        {trend && (
                            <div className={cn("flex items-center mt-2", statCardVariants({ layout: "trend" }))}>
                                <span className={trendColorClass}>
                                    {trend.isPositive ? '↗️' : '↘️'}
                                </span>
                                <Typography variant="small" className={cn("ml-1", trendColorClass)}>
                                    {trend.value >= 0 ? '+' : ''}{trend.value}% from last month
                                </Typography>
                            </div>
                        )}
                    </div>
                    <div className={cn("p-3 rounded-full", bgColorClass)}>
                        <Icon className={cn("w-6 h-6", statCardVariants({ color }))} />
                    </div>
                </div>
            </Card>
        )
    }
)
StatCard.displayName = "StatCard"

export { StatCard }