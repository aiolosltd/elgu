// src/components/forms/BusinessInfo.tsx
import React from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/input/checkbox";
import { useForm } from "@/context/FormContext";

interface BusinessInfoProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const LabeledInput: React.FC<{
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-semibold text-gray-800">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="rounded"
    />
  </div>
);

const FormSection: React.FC<{
  title: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}> = ({ title, children, columns = 2 }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-4"
      )}
    >
      {children}
    </div>
  </div>
);

const CheckboxItem: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ id, label, checked, onCheckedChange }) => (
  <div className="flex items-center space-x-3">
    <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
    <label htmlFor={id} className="text-sm font-medium text-gray-800">
      {label}
    </label>
  </div>
);

const BusinessInfo: React.FC<BusinessInfoProps> = ({
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) => {
  const { formData, updateField } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateField(field, checked);
  };

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Business Information
        </h2>
        <p className="text-gray-600">Provide complete business details</p>
      </div>

      <div className="space-y-8">
        {/* Main Office Section */}
        <FormSection title="Main Office" columns={1}>
          <CheckboxItem
            id="branch"
            label="Branch"
            checked={!!formData.branch}
            onCheckedChange={(checked) =>
              handleCheckboxChange("branch", checked)
            }
          />
          <CheckboxItem
            id="foreignCompany"
            label="Foreign Company"
            checked={!!formData.foreignCompany}
            onCheckedChange={(checked) =>
              handleCheckboxChange("foreignCompany", checked)
            }
          />
        </FormSection>

        {/* End of Ownership Section */}
        <FormSection title="End of Ownership" columns={2}>
          <LabeledInput
            label="Business Name"
            id="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter business name"
            required
          />
          <LabeledInput
            label="Date Established"
            id="dateEstablished"
            value={formData.dateEstablished}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Name of President (CEO / Manager)"
            id="presidentName"
            value={formData.presidentName}
            onChange={handleChange}
            placeholder="Enter president/CEO name"
          />
          <LabeledInput
            label="Building Space (PartDow)"
            id="buildingSpace"
            value={formData.buildingSpace}
            onChange={handleChange}
            placeholder="Enter building space"
          />
        </FormSection>

        {/* Market Stall Section */}
        <FormSection title="Market Stall" columns={1}>
          <CheckboxItem
            id="commercialBuilding"
            label="Commercial Building"
            checked={!!formData.commercialBuilding}
            onCheckedChange={(checked) =>
              handleCheckboxChange("commercialBuilding", checked)
            }
          />
          <CheckboxItem
            id="tradeName"
            label="Trade Name (Franchise)"
            checked={!!formData.tradeName}
            onCheckedChange={(checked) =>
              handleCheckboxChange("tradeName", checked)
            }
          />
        </FormSection>

        {/* Market Stall Home/Number Section */}
        <FormSection title="Market Stall Home/Number" columns={2}>
          <LabeledInput
            label="Franchise Board"
            id="franchiseBoard"
            value={formData.franchiseBoard}
            onChange={handleChange}
            placeholder="Enter franchise board"
          />
          <LabeledInput
            label="Building Name"
            id="marketBuildingName"
            value={formData.marketBuildingName}
            onChange={handleChange}
            placeholder="Enter building name"
          />
        </FormSection>

        {/* Address Section */}
        <FormSection title="Address Information" columns={2}>
          <LabeledInput
            label="Province Name"
            id="provinceName"
            value={formData.provinceName}
            onChange={handleChange}
            placeholder="Enter province name"
          />
          <LabeledInput
            label="City/Municipality Name"
            id="cityMunicipality"
            value={formData.cityMunicipality}
            onChange={handleChange}
            placeholder="Enter city/municipality"
          />
          <LabeledInput
            label="Subdivision"
            id="subdivision"
            value={formData.subdivision}
            onChange={handleChange}
            placeholder="Enter subdivision"
          />
          <LabeledInput
            label="Street"
            id="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Enter street"
          />
          <LabeledInput
            label="Building Name"
            id="buildingName"
            value={formData.buildingName}
            onChange={handleChange}
            placeholder="Enter building name"
          />
          <LabeledInput
            label="House No."
            id="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            placeholder="Enter house number"
          />
          <LabeledInput
            label="Private Block"
            id="privateBlock"
            value={formData.privateBlock}
            onChange={handleChange}
            placeholder="Enter private block"
          />
          <LabeledInput
            label="L4I"
            id="l4i"
            value={formData.l4i}
            onChange={handleChange}
            placeholder="Enter L4I"
          />
          <LabeledInput
            label="Landmark/Corner"
            id="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="Enter landmark/corner"
          />
          <LabeledInput
            label="Google Map Address"
            id="googleMapAddress"
            value={formData.googleMapAddress}
            onChange={handleChange}
            placeholder="Enter Google Map address"
          />
        </FormSection>

        {/* Contact Information Section */}
        <FormSection title="Contact Information" columns={2}>
          <LabeledInput
            label="Tel. No"
            id="telephoneNo"
            value={formData.telephoneNo}
            onChange={handleChange}
            placeholder="Enter telephone number"
            type="tel"
          />
          <LabeledInput
            label="Cellphone No"
            id="cellphoneNo"
            value={formData.cellphoneNo}
            onChange={handleChange}
            placeholder="Enter cellphone number"
            type="tel"
          />
          <LabeledInput
            label="Fax No"
            id="faxNo"
            value={formData.faxNo}
            onChange={handleChange}
            placeholder="Enter fax number"
          />
          <LabeledInput
            label="Email Address"
            id="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            placeholder="Enter email address"
            type="email"
          />
          <LabeledInput
            label="TIN"
            id="tin"
            value={formData.tin}
            onChange={handleChange}
            placeholder="Enter TIN"
            required
          />
        </FormSection>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200 gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="w-full sm:w-auto px-8 py-3"
        >
          ← Back
        </Button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={nextStep}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === totalSteps ? "Submit Application" : "Continue →"}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default BusinessInfo;
