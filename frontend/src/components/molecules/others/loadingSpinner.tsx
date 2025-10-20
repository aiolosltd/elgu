// src/components/molecules/LoadingSpinner/LoadingSpinner.tsx
import * as React from "react"
import { Typography } from "@/components/atoms/typography"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loadingSpinnerVariants = cva("flex flex-col items-center justify-center", {
  variants: {
    size: {
      sm: "p-4",
      md: "p-8",
      lg: "p-12",
      full: "min-h-screen p-6",
    },
    variant: {
      default: "text-gray-600",
      primary: "text-primary",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
})

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingSpinnerVariants> {
  text?: string
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, text = "Loading...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(loadingSpinnerVariants({ size, variant, className }))}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-current border-t-transparent",
            {
              "h-8 w-8": size === "sm",
              "h-12 w-12": size === "md",
              "h-16 w-16": size === "lg",
              "h-20 w-20": size === "full",
            }
          )}
        />
        {text && (
          <Typography
            variant="p"
            className={cn("mt-4", {
              "text-gray-600": variant === "default",
              "text-primary": variant === "primary",
              "text-white": variant === "white",
            })}
          >
            {text}
          </Typography>
        )}
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner }