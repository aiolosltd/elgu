import React, { useState } from 'react';
import Stepper from '@/components/ui/stepper';
import BusinessInfo from '@/components/business/BusinessInfo';
import BusinessRequirements from '@/components/business/BusinessRequirements'
import Undertaking from '@/components/business/Undertaking';
import TaxpayerInfo from '@/components/business/taxpayerInfo'
import { Card } from '@/components/atoms/card';
import { Typography } from '@/components/atoms/typography';

const BusinessForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    'Taxpayer Information',
    'Business Information',
    'Business Requirements',
    'Undertaking/Waiver',
  ].map((label, index) => {
    const stepNumber = index + 1;
    let status: 'complete' | 'current' | 'incomplete' = 'incomplete';
    if (stepNumber < currentStep) status = 'complete';
    else if (stepNumber === currentStep) status = 'current';
    return { label, status };
  });

  const renderStep = () => {
    const props = { nextStep, prevStep, currentStep, totalSteps };
    switch (currentStep) {
      case 1:
        return <TaxpayerInfo {...props} />;
      case 2:
        return <BusinessInfo {...props} />;
      case 3:
        return <BusinessRequirements {...props} />;
      case 4:
        return <Undertaking {...props} />;
      default:
        return <TaxpayerInfo {...props} />;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <Card
        variant="default"
        padding="lg"
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-5"
      >
        <div>
          <Typography
            variant="h1"
            as="h1"
            weight="bold"
            className="text-2xl text-gray-900 mb-1"
          >
            Business Overview Dashboard
          </Typography>
          <Typography variant="p" className="text-gray-600">
            Get a comprehensive view of all registered businesses, compliance rates, and performance
            trends across municipalities.
          </Typography>
        </div>
      </Card>

      <div className="mx-auto bg-white p-8 ">
        <div className="mb-8 overflow-x-auto">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default BusinessForm;
