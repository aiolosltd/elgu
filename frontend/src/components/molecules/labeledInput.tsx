import React from 'react';
import { Input } from '@/components/atoms/input';
import { cn } from '@/lib/utils';

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  variant?: 'default' | 'rounded' | 'underline' | 'icon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  id,
  required = false,
  error,
  isDisabled = false,
  className,
  variant = 'default',
  icon,
  iconPosition = 'right',
  onIconClick,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {/* 🏷️ Label */}
      <label
        htmlFor={id}
        className={cn(
          'text-sm font-medium text-foreground',
          'transition-colors duration-200',
          isDisabled && 'opacity-50 cursor-not-allowed',
          error && 'text-destructive' // Make label red when there's error
        )}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      {/* 🧩 Input Container */}
      <div className="relative">
        <Input
          id={id}
          disabled={isDisabled}
          className={cn(
            // Base styles
            'transition-all duration-200',
            
            // Variant styles
            variant === 'rounded' && 'rounded-full',
            variant === 'underline' && 'rounded-none border-0 border-b-2 border-input bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary',
            variant === 'icon' && iconPosition === 'left' ? 'pl-10' : 'pr-10',
            
            // ✅ CRITICAL FIX: Add border-destructive class for red border
            error && [
              'border-destructive', // This makes the border red
              'focus-visible:border-destructive', // Keep red on focus
              'focus-visible:ring-destructive/20', // Red ring on focus
              'text-foreground', // Keep text color normal
            ],
            
            // Disabled states
            isDisabled && [
              'cursor-not-allowed opacity-50',
              'bg-muted text-muted-foreground',
              error && 'border-destructive/50' // Keep red border even when disabled
            ]
          )}
          {...props}
        />

        {/* Icon */}
        {icon && (
          <div
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2',
              'flex items-center justify-center',
              'text-muted-foreground transition-colors duration-200',
              onIconClick && 'cursor-pointer hover:text-foreground',
              iconPosition === 'left' ? 'left-3' : 'right-3',
              isDisabled && 'opacity-50 cursor-not-allowed',
              error && 'text-destructive' // Make icon red when there's error
            )}
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
      </div>

      {/* ⚠️ Error message */}
      {error && (
        <p className="text-destructive text-xs flex items-center gap-1 animate-in fade-in duration-200">
          <svg 
            className="w-3 h-3 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};