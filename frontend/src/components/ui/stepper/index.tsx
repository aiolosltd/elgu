// Stepper.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

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
  return (
    <div className="w-full">
      {/* Progress Bar - Fixed responsive layout */}
      <div className="relative mb-8">
        <div className="flex items-start justify-between px-4 sm:px-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.stepNumber}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10 flex-1 min-w-0">
                <button
                  onClick={() => onStepClick?.(step.stepNumber)}
                  disabled={step.status === 'incomplete' && step.stepNumber > currentStep}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all duration-300 shrink-0',
                    'focus:outline-none focus:ring-4 focus:ring-blue-200',
                    {
                      'bg-green-500 border-green-500 text-white': step.status === 'complete',
                      'bg-blue-600 border-blue-600 text-white': step.status === 'current',
                      'bg-white border-gray-300 text-gray-400': step.status === 'incomplete',
                      'cursor-pointer hover:scale-105': step.stepNumber <= currentStep,
                      'cursor-not-allowed': step.stepNumber > currentStep,
                    }
                  )}
                >
                  {step.status === 'complete' ? (
                    <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                  ) : step.status === 'current' ? (
                    <span className="font-bold text-sm">{step.stepNumber}</span>
                  ) : (
                    <Circle size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
                
                {/* Step Labels */}
                <div className="mt-2 text-center w-full px-1">
                  <div className={cn(
                    'text-xs font-semibold mb-1 px-2 py-1 rounded-full whitespace-nowrap',
                    {
                      'bg-green-100 text-green-800': step.status === 'complete',
                      'bg-blue-100 text-blue-800': step.status === 'current',
                      'bg-gray-100 text-gray-600': step.status === 'incomplete',
                    }
                  )}>
                    {step.status === 'complete' ? 'COMPLETE' : 
                     step.status === 'current' ? 'CURRENT' : 'INCOMPLETE'}
                  </div>
                  <p className={cn(
                    'text-xs sm:text-sm font-semibold leading-tight break-words',
                    {
                      'text-green-700': step.status === 'complete',
                      'text-blue-700': step.status === 'current',
                      'text-gray-500': step.status === 'incomplete',
                    }
                  )}>
                    {step.label}
                  </p>
                  {step.subtitle && (
                    <p className={cn(
                      'text-xs mt-1 hidden sm:block',
                      {
                        'text-green-600': step.status === 'complete',
                        'text-blue-600': step.status === 'current',
                        'text-gray-400': step.status === 'incomplete',
                      }
                    )}>
                      {step.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting Line - Only show on desktop */}
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-1 mx-1 sm:mx-2 mt-5 sm:-mt-6 relative hidden sm:block',
                  {
                    'bg-green-500': step.status === 'complete',
                    'bg-gray-300': step.status !== 'complete',
                  }
                )}>
                  {/* Progress fill for current step */}
                  {step.status === 'current' && (
                    <div 
                      className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                      style={{ width: '50%' }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Background Line - Only show on desktop */}
        <div className="absolute top-5 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 h-1 bg-gray-200 -z-10 hidden sm:block" />
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mb-4 text-center">
        <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full">
          <AlertCircle size={14} className="text-blue-600 mr-1" />
          <span className="text-xs font-semibold text-blue-700">
            Step {currentStep}: {steps.find(s => s.status === 'current')?.label}
          </span>
        </div>
      </div>

      {/* Desktop Current Step Indicator */}
      <div className="hidden sm:block text-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
          <AlertCircle size={16} className="text-blue-600 mr-2" />
          <span className="text-sm font-semibold text-blue-700">
            Current: {steps.find(s => s.status === 'current')?.label}
          </span>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="sm:hidden mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Stepper;