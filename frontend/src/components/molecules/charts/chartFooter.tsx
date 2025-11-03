import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { CardFooter } from "@/components/ui/card"
interface ChartFooterProps {
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  description?: string;
  className?: string;
}

export function ChartFooter({ 
  trend, 
  description, 
  className = "" 
}: ChartFooterProps) {
  const getTrendIcon = (isPositive?: boolean) => {
    if (isPositive === undefined) return <Minus className="h-4 w-4 text-gray-500" />;
    return isPositive 
      ? <TrendingUp className="h-4 w-4 text-green-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendText = (trend?: { value: number; isPositive?: boolean; label?: string }) => {
    if (!trend) return null;
    
    const trendText = trend.label || `Trending ${trend.isPositive ? 'up' : 'down'} by ${Math.abs(trend.value)}%`;
    return trendText;
  };

  return (
    <CardFooter className={`flex-col gap-2 text-sm ${className}`}>
      {trend && (
        <div className="flex items-center gap-2 leading-none font-medium">
          {getTrendText(trend)} {getTrendIcon(trend.isPositive)}
        </div>
      )}
      {description && (
        <div className="text-muted-foreground leading-none">
          {description}
        </div>
      )}
    </CardFooter>
  );
}