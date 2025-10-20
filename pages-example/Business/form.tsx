import React, { useState } from "react";
import Stepper from "@/components/ui/stepper";
import BusinessInfo from "@/components/business/BusinessInfo";
import BusinessOperation from "@/components/business/BusinessRequirments";
import BusinessActivity from "@/components/business/BusinessActivity";
import OtherInfo from "@/components/business/OtherInfo";
import Summary from "@/components/business/Undertaking";
import BasicRequirements from "@/components/business/taxpayerInfo";
import Complete from "@/components/business/Complete";

const BusinessForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    "Complete",
    "Basic Documentary Requirements",
    "Business Information",
    "Business Operation",
    "Business Activity",
    "Other Required Information",
    "Summary Page",
  ].map((label, index) => {
    const stepNumber = index + 1;
    let status: "complete" | "current" | "incomplete" = "incomplete";
    if (stepNumber < currentStep) {
      status = "complete";
    } else if (stepNumber === currentStep) {
      status = "current";
    }
    return { label, status };
  });

  const renderStep = () => {
    const props = { nextStep, prevStep, currentStep, totalSteps };
    switch (currentStep) {
      case 1:
        return <BasicRequirements {...props} />;
      case 2:
        return <BusinessInfo {...props} />;
      case 3:
        return <BusinessOperation {...props} />;
      case 4:
        return <BusinessActivity {...props} />;
      case 5:
        return <OtherInfo {...props} />;
      case 6:
        return (
          <Summary
            prevStep={prevStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onSubmit={handleSubmit}
          />
        );
      case 7:
        return <Complete {...props} />;
      default:
        return <BusinessInfo {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button className="text-blue-600">&larr; BACK TO HOME PAGE</button>
          <div className="text-right">
            <p className="text-sm">
              Logged in as: <span className="font-bold">JUVILYN SANTOS</span>
            </p>
            <p className="text-xs text-gray-500">PROTECTED WHEN COMPLETED</p>
          </div>
        </div>
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            UNIFIED ONLINE BUSINESS PERMIT APPLICATION
          </h1>
        </header>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-8 overflow-x-auto">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
          {renderStep()}
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
          <p>QCLPO.BPLD.BPO.FR</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;
