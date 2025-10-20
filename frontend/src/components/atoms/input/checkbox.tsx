// src/components/ui/checkbox.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onCheckedChange,
  className,
  ...props
}) => {
  return (
    <label className={cn("flex items-center space-x-3 cursor-pointer group", className)}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className={cn(
            "h-4 w-4 appearance-none rounded border-2 border-gray-300",
            "transition-all duration-200 ease-in-out",
            "checked:border-blue-500 checked:bg-blue-500",
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "hover:border-blue-400 group-hover:border-blue-400",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...props}
        />
        {checked && (
          <svg
            className="absolute h-3 w-3 text-white pointer-events-none transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
};