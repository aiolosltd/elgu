import React from 'react';
import { Button } from '@/components/ui/button';

interface CompleteProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const Complete: React.FC<CompleteProps> = ({ nextStep, prevStep, currentStep, totalSteps }) => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-6 border-b pb-2">Application Complete</h2>
      
      <div className="space-y-4">
        <p className="text-lg text-green-600">Thank you for your submission!</p>
        <p className="text-sm text-gray-600">Your application has been received and is now being processed. You will receive an email notification with the status of your application within 3-5 business days.</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12 pt-6 border-t">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>BACK</Button>
        <div className="flex gap-x-2">
          <Button variant="outline">SAVE AS DRAFT</Button>
          <Button onClick={nextStep}>{currentStep === totalSteps ? 'SUBMIT' : 'CONTINUE'}</Button>
        </div>
      </div>
    </section>
  );
};

export default Complete;