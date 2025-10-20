// src/components/molecules/NewsCard/NewsCard.tsx
import * as React from "react"
import { Card } from "@/components/atoms/card"
import { Typography } from "@/components/atoms/typography"
import { Button } from "@/components/atoms/button"
import { Icon } from "@/components/atoms/icon"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface NewsItem {
  title: string
  link: string
}

const newsCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      compact: "space-y-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface NewsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof newsCardVariants> {
  news: NewsItem[]
  title?: string
  isLoading?: boolean
  onRetry?: () => void
}

const NewsCard = React.forwardRef<HTMLDivElement, NewsCardProps>(
  ({ className, variant, news, title = "Local News", isLoading, onRetry, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="default"
        padding="md"
        className={cn(newsCardVariants({ variant, className }))}
        {...props}
      >
        <div className="flex items-center mb-4">
          <Icon icon="📰" size="xl" className="mr-3" />
          <Typography variant="h3" as="h2" weight="semibold">
            {title}
          </Typography>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start animate-pulse">
                <div className="h-2 w-2 bg-gray-200 rounded-full mt-2 mr-3"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <ul className="space-y-3">
            {news.map((item, index) => (
              <li key={index} className="flex items-start">
                <Icon icon="•" variant="primary" size="sm" className="mr-2 mt-1" />
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors break-words"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Typography variant="p" className="text-muted-foreground mb-4">
              No news available at the moment
            </Typography>
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                Retry Loading News
              </Button>
            )}
          </div>
        )}
      </Card>
    )
  }
)
NewsCard.displayName = "NewsCard"

export { NewsCard }