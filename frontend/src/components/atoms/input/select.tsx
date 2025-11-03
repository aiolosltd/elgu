// src/components/ui/select.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  error,
  className
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full px-4 py-3 border border-gray-300 rounded-2xl",
            "bg-white appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-all duration-200",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            "pr-10" // Make room for the chevron
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={18} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};