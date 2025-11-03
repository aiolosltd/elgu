// src/components/atoms/badge.tsx
import React from 'react';
import { Typography } from '@/components/atoms/typography';

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  children, 
  className = '' 
}) => {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const variantClasses = {
    default: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
    destructive: 'bg-red-100 text-red-800 border border-red-200',
    outline: 'bg-transparent text-gray-700 border border-gray-300',
    success: 'bg-green-700 text-green-800 border border-green-200',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <span className={combinedClasses}>
      <Typography
        variant="small"
        as="span"
        className="font-medium inline-flex items-center"
      >
        {children}
      </Typography>
    </span>
  );
};
