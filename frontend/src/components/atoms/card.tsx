import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      default: "bg-white border-gray-200",
      gradient: "bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    hover: {
      none: "",
      shadow: "hover:shadow-xl transition-shadow duration-300",
    }
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
    hover: "none",
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }