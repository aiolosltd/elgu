import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'rounded' | 'underline' | 'icon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void; // Add this for click handling
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant = 'default',
      icon,
      iconPosition = 'right',
      onIconClick, // Add this prop
      ...props
    },
    ref
  ) => {
    // 🎨 Base styles
    const baseStyles =
      'flex w-full bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

    // ✨ Variants
    const variants = {
      default:
        'h-10 rounded-md border border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      rounded:
        'h-12 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
      underline:
        'border-0 border-b border-gray-400 focus:border-blue-500 focus:ring-0 rounded-none px-0',
      icon:
        'h-12 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-4 pr-10',
    };

    return (
      <div className={cn('relative w-full', variant === 'icon' ? 'flex items-center' : '')}>
        {icon && variant === 'icon' && iconPosition === 'left' && (
          <div 
            className={cn(
              "absolute left-3 text-gray-400", 
              onIconClick && "cursor-pointer" // Only show pointer if clickable
            )}
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            variants[variant],
            variant === 'icon' && iconPosition === 'left' ? 'pl-9' : '',
            variant === 'icon' && iconPosition === 'right' ? 'pr-9' : '',
            className
          )}
          {...props}
        />

        {icon && variant === 'icon' && iconPosition === 'right' && (
          <div 
            className={cn(
              "absolute right-3 text-gray-400", 
              onIconClick && "cursor-pointer" // Only show pointer if clickable
            )}
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };


// {/* Default Input */ }
// <Input
//   type="email"
//   placeholder="Default Input"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
// />

// {/* Rounded Input */ }
// <Input
//   type="email"
//   placeholder="Rounded Input"
//   variant="rounded"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
// />

// {/* Underline Input */ }
// <Input
//   type="email"
//   placeholder="Underline Input"
//   variant="underline"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
// />

// {/* Icon Input */ }
// <Input
//   type="email"
//   placeholder="Email"
//   variant="icon"
//   icon={<Mail size={18} />}
//   iconPosition="right"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
// />