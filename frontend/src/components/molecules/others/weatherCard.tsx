// src/components/molecules/WeatherCard/WeatherCard.tsx
import * as React from "react"
import { Card } from "@/components/atoms/card"
import { Typography } from "@/components/atoms/typography"
import { Icon } from "@/components/atoms/icon"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const weatherCardVariants = cva("", {
  variants: {
    layout: {
      horizontal: "flex items-center space-x-4",
      vertical: "space-y-3",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    layout: "vertical",
    size: "md",
  },
})

export interface WeatherData {
  city: string
  temperature: string
  description: string
  fullDescription?: string
}

export interface WeatherCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof weatherCardVariants> {
  weather: WeatherData | null
  greeting?: string
  isLoading?: boolean
}

const WeatherCard = React.forwardRef<HTMLDivElement, WeatherCardProps>(
  ({ className, layout, size, weather, greeting, isLoading, ...props }, ref) => {
    if (isLoading) {
      return (
        <Card variant="default" padding="md" className={className}>
          <div className="animate-pulse space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </Card>
      )
    }

    if (!weather) {
      return (
        <Card variant="default" padding="md" className={className}>
          <Typography variant="p" className="text-muted-foreground">
            Weather data unavailable
          </Typography>
        </Card>
      )
    }

    return (
      <Card
        ref={ref}
        variant="default"
        padding="md"
        className={cn(weatherCardVariants({ layout, size, className }))}
        {...props}
      >
        <div className="flex items-center mb-4">
          <Icon icon="☁️" size="xl" className="mr-3" />
          <Typography variant="h3" as="h2" weight="semibold">
            Weather Update
          </Typography>
        </div>
        
        <div className="space-y-3">
          <Typography variant="large" weight="semibold">
            {weather.city}
          </Typography>
          
          <Typography variant="h1" as="div" weight="bold" className="text-3xl">
            {weather.temperature}
          </Typography>
          
          {greeting ? (
            <Typography variant="p" className="text-muted-foreground">
              {greeting}
            </Typography>
          ) : (
            <Typography variant="p" className="text-muted-foreground capitalize">
              {weather.description}
            </Typography>
          )}
        </div>
      </Card>
    )
  }
)
WeatherCard.displayName = "WeatherCard"

export { WeatherCard }