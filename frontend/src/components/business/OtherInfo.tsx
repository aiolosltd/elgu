import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/context/FormContext";

interface OtherInfoProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const LabeledInput: React.FC<
  {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, id, value, onChange, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <Input id={id} value={value} onChange={onChange} {...props} />
  </div>
);

const LabeledTextarea: React.FC<
  {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ label, id, value, onChange, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <Textarea id={id} value={value} onChange={onChange} {...props} />
  </div>
);

const OtherInfo: React.FC<OtherInfoProps> = ({
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) => {
  const { formData, updateField } = useForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField(e.target.id, e.target.value);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-6 border-b pb-2">
        Other Required Information
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Emergency Contact Person</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledInput
              label="Full Name"
              id="emergencyName"
              value={formData.emergencyName || ""}
              onChange={handleInputChange}
            />
            <LabeledInput
              label="Contact Number"
              id="emergencyContact"
              value={formData.emergencyContact || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Business Insurance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledInput
              label="Insurance Provider"
              id="insuranceProvider"
              value={formData.insuranceProvider || ""}
              onChange={handleInputChange}
            />
            <LabeledInput
              label="Policy Number"
              id="policyNumber"
              value={formData.policyNumber || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <LabeledTextarea
          label="Additional Comments"
          id="additionalComments"
          value={formData.additionalComments || ""}
          onChange={handleTextareaChange}
          placeholder="Any other information you would like to provide."
        />
        <div className="flex items-center">
          <Checkbox
            id="termsAndConditions"
            checked={!!formData.termsAndConditions}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("termsAndConditions", e.target.checked)
            }
          />
          {/* <Checkbox id="termsAndConditions" checked={!!formData.termsAndConditions} onChange={(e) => updateField('termsAndConditions', !!e.target.checked)} /> */}
          <label htmlFor="termsAndConditions" className="ml-2 text-sm">
            I agree to the{" "}
            <a href="#" className="text-blue-600">
              Terms and Conditions
            </a>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12 pt-6 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          BACK
        </Button>
        <div className="flex gap-x-2">
          <Button variant="outline">SAVE AS DRAFT</Button>
          <Button onClick={nextStep}>
            {currentStep === totalSteps ? "SUBMIT" : "CONTINUE"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OtherInfo;
