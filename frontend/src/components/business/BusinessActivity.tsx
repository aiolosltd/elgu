import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@/context/FormContext';

interface BusinessActivityProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const LabeledInput: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, id, value, onChange, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <Input id={id} value={value} onChange={onChange} {...props} />
  </div>
);

const LabeledTextarea: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void } & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ label, id, value, onChange, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <Textarea id={id} value={value} onChange={onChange} {...props} />
    </div>
);

const BusinessActivity: React.FC<BusinessActivityProps> = ({ nextStep, prevStep, currentStep, totalSteps }) => {
  const { formData, updateField } = useForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField(e.target.id, e.target.value);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-6 border-b pb-2">Business Activity</h2>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabeledInput label="Primary Business Activity" id="primaryActivity" value={formData.primaryActivity || ''} onChange={handleInputChange} />
          <LabeledInput label="Secondary Business Activity" id="secondaryActivity" value={formData.secondaryActivity || ''} onChange={handleInputChange} />
        </div>
        <LabeledTextarea label="Products and Services" id="productsServices" value={formData.productsServices || ''} onChange={handleTextareaChange} placeholder="Describe the products and services offered" />
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

export default BusinessActivity;