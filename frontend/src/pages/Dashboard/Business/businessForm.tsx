// src/components/pages/BusinessForm.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Stepper from "@/components/molecules/stepper";
import BusinessInfo from "@/components/organisms/business/BusinessInfo";
import BusinessRequirements from "@/components/organisms/business/BusinessRequirements";
import Summary from "@/components/organisms/business/Undertaking";
import TaxpayerInfo from "@/components/organisms/business/taxpayerInfo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography";
import { useForm } from "@/context/FormContext";
import { RefreshCw } from "lucide-react";

const BusinessForm: React.FC = () => {
  // ✅ FIXED: Get ALL parameters to check what's available
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const { validateStep, resetForm, loadBusinessData, formData, isEditMode, setIsEditMode } = useForm();

  console.log('🔍 BusinessForm - ALL URL params:', params);
  
  // ✅ FIXED: Try different possible parameter names
  const businessId = params.businessId || params.id;
  console.log('🔍 BusinessForm - businessId resolved:', businessId);

  // ✅ FIXED: Improved initialization with proper edit mode setting
  useEffect(() => {
    const initializeForm = async () => {
      console.log('🔄 Initializing form with businessId:', businessId);
      
      if (businessId) {
        console.log('🔄 EDIT mode detected for business:', businessId);
        setIsEditMode(true); // ✅ Explicitly set edit mode
        setLoading(true);
        try {
          await loadBusinessData(businessId);
          console.log('✅ Business data loaded successfully');
        } catch (error) {
          console.error('❌ Error loading business data:', error);
          // If loading fails, reset to create mode
          setIsEditMode(false);
          resetForm();
        } finally {
          setLoading(false);
        }
      } else {
        console.log('🔄 CREATE mode - resetting form');
        setIsEditMode(false);
        resetForm();
      }
    };

    initializeForm();
  }, [businessId]); // ✅ Only depend on businessId

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { label: "Taxpayer Info", stepNumber: 1 },
    { label: "Business Info", stepNumber: 2 },
    { label: "Requirements", stepNumber: 3 },
    { label: "Summary", stepNumber: 4 },
  ].map((step, index) => {
    const stepNumber = index + 1;
    let status: "complete" | "current" | "incomplete" = "incomplete";
    if (stepNumber < currentStep) status = "complete";
    else if (stepNumber === currentStep) status = "current";

    return {
      label: step.label,
      status,
      stepNumber,
    };
  });

  const renderStep = () => {
    const props = { 
      nextStep, 
      prevStep, 
      currentStep, 
      totalSteps,
    };
    
    switch (currentStep) {
      case 1:
        return <TaxpayerInfo {...props} />;
      case 2:
        return <BusinessInfo {...props} />;
      case 3:
        return <BusinessRequirements {...props} />;
      case 4:
        return <Summary {...props} />;
      default:
        return <TaxpayerInfo {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <Typography variant="p" className="text-gray-600">
            {businessId ? 'Loading business data...' : 'Initializing form...'}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* Back Button */}
     

      <Card className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 sm:space-y-4 lg:space-y-0 mb-4 sm:mb-6 md:mb-8 p-4 sm:p-6">
        <div>
          <CardTitle>
            <Typography variant="h3" as="h3" weight="bold" className="pl-0 sm:pl-5 mb-2 text-lg sm:text-xl md:text-2xl">
                {isEditMode ? 'Edit Business' : 'Business Registration'}
            </Typography>
          </CardTitle>
          <CardDescription className='ml-0 sm:ml-5 text-xs sm:text-sm'>
            {isEditMode 
              ? `Editing business: ${formData.businessname_ || ''}`
              : 'Complete the business registration form to register your business with the local government.'
            }
            {isEditMode && businessId && ` (ID: ${businessId})`}and performance trends across municipalities.
          </CardDescription>
        </div>
      </Card>


  

      <div className="mx-auto  p-8">
        <div className="mb-8 overflow-x-auto">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default BusinessForm;