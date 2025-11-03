// Stepper.tsx - Shadcn UI Version (With Blue Color Scheme)
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/button';

interface StepperProps {
  steps: { 
    label: string; 
    status: 'complete' | 'incomplete' | 'current';
    subtitle?: string;
    stepNumber: number;
  }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  const getStatusColors = (status: 'complete' | 'incomplete' | 'current') => {
    switch (status) {
      case 'complete':
        return {
          circle: 'bg-blue-600 border-blue-600 text-white',
          label: 'text-blue-700 font-semibold',
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          line: 'bg-blue-600'
        };
      case 'current':
        return {
          circle: 'bg-blue-500 border-blue-500 text-white',
          label: 'text-blue-600 font-bold',
          badge: 'bg-blue-500 text-white border-blue-500',
          line: 'bg-blue-500'
        };
      case 'incomplete':
        return {
          circle: 'bg-gray-100 border-gray-300 text-gray-400',
          label: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-500 border-gray-200',
          line: 'bg-gray-300'
        };
      default:
        return {
          circle: 'bg-gray-100 border-gray-300 text-gray-400',
          label: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-500 border-gray-200',
          line: 'bg-gray-300'
        };
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar - Fixed responsive layout */}
      <div className="relative mb-8">
        <div className="flex items-start justify-between px-4 sm:px-8">
          {steps.map((step, index) => {
            const colors = getStatusColors(step.status);
            
            return (
              <React.Fragment key={step.stepNumber}>
                {/* Step Circle */}
                <div className="flex flex-col items-center relative z-10 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStepClick?.(step.stepNumber)}
                    disabled={step.status === 'incomplete' && step.stepNumber > currentStep}
                    className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all duration-300 shrink-0',
                      'focus:ring-4 focus:ring-blue-200',
                      colors.circle,
                      {
                        'cursor-pointer hover:scale-105': step.stepNumber <= currentStep,
                        'cursor-not-allowed opacity-50': step.stepNumber > currentStep,
                      }
                    )}
                  >
                    {step.status === 'complete' ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : step.status === 'current' ? (
                      <span className="font-bold text-sm">{step.stepNumber}</span>
                    ) : (
                      <Circle className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                  
                  {/* Step Labels */}
                  <div className="mt-2 text-center w-full px-1">
                    <div className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mb-1',
                      colors.badge
                    )}>
                      {step.status === 'complete' ? 'COMPLETE' : 
                       step.status === 'current' ? 'CURRENT' : 'INCOMPLETE'}
                    </div>
                    <p className={cn(
                      'text-xs sm:text-sm font-semibold leading-tight break-words',
                      colors.label
                    )}>
                      {step.label}
                    </p>
                    {step.subtitle && (
                      <p className={cn(
                        'text-xs mt-1 hidden sm:block text-gray-500'
                      )}>
                        {step.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connecting Line - Only show on desktop */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-1 mx-1 sm:mx-2 mt-5 sm:-mt-6 relative hidden sm:block bg-gray-200'
                  )}>
                    {/* Progress fill */}
                    <div 
                      className={cn(
                        'absolute top-0 left-0 h-full transition-all duration-500',
                        colors.line
                      )}
                      style={{ 
                        width: step.status === 'complete' ? '100%' : 
                               step.status === 'current' ? '50%' : '0%' 
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Background Line - Only show on desktop */}
        <div className="absolute top-5 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 h-1 bg-gray-200 -z-10 hidden sm:block" />
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mb-4 text-center">
        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          <span className="text-xs font-semibold">
            Step {currentStep}: {steps.find(s => s.status === 'current')?.label}
          </span>
        </div>
      </div>

      {/* Desktop Current Step Indicator */}
      <div className="hidden sm:block text-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold">
            Current: {steps.find(s => s.status === 'current')?.label}
          </span>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="sm:hidden mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Stepper;