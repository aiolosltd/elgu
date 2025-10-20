// src/components/ui/radio.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  value,
  checked = false,
  onChange,
  className,
  ...props
}) => {
  return (
    <label className={cn("flex items-center space-x-3 cursor-pointer group", className)}>
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "h-4 w-4 appearance-none rounded-full border-2 border-gray-300",
            "transition-all duration-200 ease-in-out",
            "checked:border-blue-500 checked:bg-blue-500",
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "hover:border-blue-400 group-hover:border-blue-400",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...props}
        />
        {checked && (
          <div className="absolute h-2 w-2 rounded-full bg-white transition-all" />
        )}
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
};

interface RadioGroupProps {
  name: string;
  options: { label: string; value: string }[];
  selectedValue?: string;
  onChange: (value: string) => void;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  className,
  layout = 'vertical'
}) => {
  return (
    <div className={cn(
      "space-y-2",
      layout === 'horizontal' && "flex flex-wrap gap-4 space-y-0",
      className
    )}>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          checked={selectedValue === option.value}
          onChange={onChange}
        />
      ))}
    </div>
  );
};