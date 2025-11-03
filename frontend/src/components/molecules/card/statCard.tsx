// components/StatCard.tsx
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "gray";
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    value: "text-blue-900 dark:text-blue-100",
    trend: {
      positive: "text-green-600 dark:text-green-400",
      negative: "text-red-600 dark:text-red-400"
    }
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    value: "text-green-900 dark:text-green-100",
    trend: {
      positive: "text-green-600 dark:text-green-400",
      negative: "text-red-600 dark:text-red-400"
    }
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: "text-yellow-600 dark:text-yellow-400",
    value: "text-yellow-900 dark:text-yellow-100",
    trend: {
      positive: "text-green-600 dark:text-green-400",
      negative: "text-red-600 dark:text-red-400"
    }
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    value: "text-red-900 dark:text-red-100",
    trend: {
      positive: "text-green-600 dark:text-green-400",
      negative: "text-red-600 dark:text-red-400"
    }
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-600 dark:text-purple-400",
    value: "text-purple-900 dark:text-purple-100",
    trend: {
      positive: "text-green-600 dark:text-green-400",
      negative: "text-red-600 dark:text-red-400"
    }
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    icon: "text-gray-600 dark:text-gray-400",
    value: "text-gray-900 dark:text-gray-100",
    trend: {
      positive: "text-green-600 dark:text-green-400",
      negative: "text-red-600 dark:text-red-400"
    }
  }
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  description, 
  trend 
}: StatCardProps) {
  const config = colorConfig[color];

  return (
    <Card className={`border-2 transition-all hover:shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Title and Icon */}
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${config.icon}`} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className={`text-2xl font-bold ${config.value}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </h3>
              
              {/* Trend Badge */}
              {trend && (
                <Badge 
                  variant="outline" 
                  className={`
                    text-xs font-medium
                    ${trend.isPositive ? config.trend.positive : config.trend.negative}
                    border-current
                  `}
                >
                  <div className="flex items-center gap-1">
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </div>
                </Badge>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}