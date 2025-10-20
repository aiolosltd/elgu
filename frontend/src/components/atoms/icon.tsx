// src/components/atoms/Icon/Icon.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconVariants = cva("flex-shrink-0", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-12 w-12",
    },
    variant: {
      default: "text-current",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
})

export interface IconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconVariants> {
  icon: string
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, size, variant, icon, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(iconVariants({ size, variant, className }))}
        {...props}
      >
        {icon}
      </span>
    )
  }
)
Icon.displayName = "Icon"

export { Icon }