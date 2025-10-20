// src/components/forms/TaxpayerInfo.tsx
import React from 'react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
// import { RadioGroup } from '@/components/atoms/input/radio';
import { Checkbox } from '@/components/atoms/input/checkbox';
import { useForm } from '@/context/FormContext';
import {Calendar, Phone, Mail } from 'lucide-react';

interface TaxpayerInfoProps {
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
  variant?: 'default' | 'rounded' | 'underline' | 'icon';
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
  error?: string;
  onIconClick?: () => void;
}> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  variant = 'rounded',
  icon,
  type = 'text',
  required = false,
  error,
  onIconClick
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
        variant={variant}
        icon={icon}
        iconPosition="right"
        onIconClick={onIconClick}
        className={cn(
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          "transition-all duration-200"
        )}
      />
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {error}</p>}
    </div>
  );

const FormSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  columns?: number;
}> = ({ title, description, children, columns = 2 }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {children}
    </div>
  </div>
);

const TaxpayerInfo: React.FC<TaxpayerInfoProps> = ({
  nextStep,
  prevStep,
  currentStep,
  totalSteps
}) => {
  const { formData, updateField } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleRadioChange = (field: string, value: string) => {
    updateField(field, value);
  };

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Taxpayer Information
        </h2>
        <p className="text-gray-600">
          Please provide your complete information for registration
        </p>
      </div>

      <div className="space-y-8">
        {/* Registrant Information */}
        <FormSection
          title="Registrant Information"
          description="Primary registrant details"
          columns={3}
        >
          <LabeledInput
            label="Registrant Name"
            id="registrantName"
            value={formData.registrantName}
            onChange={handleChange}
            placeholder="Enter registrant name"
            variant="rounded"
            required
          />
          <LabeledInput
            label="Registrant Position"
            id="registrantPosition"
            value={formData.registrantPosition}
            onChange={handleChange}
            placeholder="Enter position"
            variant="rounded"
          />
          <LabeledInput
            label="Ownership Type"
            id="ownershipType"
            value={formData.ownershipType}
            onChange={handleChange}
            placeholder="Enter ownership type"
            variant="rounded"
          />
        </FormSection>

        {/* Personal Name Information */}
        <FormSection
          title="Personal Name"
          description="Your complete name details"
          columns={4}
        >
          <LabeledInput
            label="First Name"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            variant="rounded"
            required
          />
          <LabeledInput
            label="Middle Name/Initial"
            id="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder="Enter middle name"
            variant="rounded"
          />
          <LabeledInput
            label="Last Name"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            variant="rounded"
            required
          />
          <LabeledInput
            label="Swiss Name"
            id="swissName"
            value={formData.swissName}
            onChange={handleChange}
            placeholder="Enter Swiss name"
            variant="rounded"
          />
        </FormSection>

        {/* Personal Details */}
        <FormSection
          title="Personal Details"
          description="Your personal information"
          columns={4}
        >
          <LabeledInput
            label="Birth Date"
            id="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            placeholder="MM/DD/YYYY"
            variant="icon"
            icon={<Calendar size={18} />}
            type="date"
            required
          />
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">Gender</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => handleRadioChange('gender', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Female</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => handleRadioChange('gender', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Male</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">Civil Status</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="civilStatus"
                  value="married"
                  checked={formData.civilStatus === 'married'}
                  onChange={(e) => handleRadioChange('civilStatus', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Married</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="civilStatus"
                  value="single"
                  checked={formData.civilStatus === 'single'}
                  onChange={(e) => handleRadioChange('civilStatus', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Single</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">Status</label>
            <div className="flex items-center gap-2 mt-1">
              <Checkbox
                id="notReady"
                checked={!!formData.notReady}
                onCheckedChange={(checked) => updateField('notReady', checked)}
              />
              <label htmlFor="notReady" className="text-sm text-gray-700">
                Not Ready
              </label>
            </div>
          </div>
        </FormSection>

        {/* Address Information */}
        <FormSection
          title="Address Information"
          description="Your complete address details"
          columns={3}
        >
          <LabeledInput
            label="Province Name"
            id="provinceName"
            value={formData.provinceName}
            onChange={handleChange}
            placeholder="Enter province"
            variant="rounded"
            required
          />
          <LabeledInput
            label="City/Municipality Name"
            id="cityMunicipality"
            value={formData.cityMunicipality}
            onChange={handleChange}
            placeholder="Enter city/municipality"
            variant="rounded"
            required
          />
          <LabeledInput
            label="Tel. No(s)"
            id="telephoneNumbers"
            value={formData.telephoneNumbers}
            onChange={handleChange}
            placeholder="Enter telephone numbers"
            variant="icon"
            icon={<Phone size={18} />}
            type="tel"
          />
        </FormSection>

        {/* Additional Address Information */}
        <FormSection
          title="Additional Address Details"
          description="More specific address information"
          columns={3}
        >
          <LabeledInput
            label="Barangay Name"
            id="barangayName"
            value={formData.barangayName}
            onChange={handleChange}
            placeholder="Enter barangay"
            variant="rounded"
          />
          <LabeledInput
            label="Sub Address"
            id="subAddress"
            value={formData.subAddress}
            onChange={handleChange}
            placeholder="Enter sub-address"
            variant="rounded"
          />
          <LabeledInput
            label="Caribbean No(s)"
            id="caribbeanNumbers"
            value={formData.caribbeanNumbers}
            onChange={handleChange}
            placeholder="Enter Caribbean numbers"
            variant="rounded"
          />
        </FormSection>

        {/* Street Information */}
        <FormSection
          title="Street Details"
          description="Street-level address information"
          columns={3}
        >
          <LabeledInput
            label="Street"
            id="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Enter street name"
            variant="rounded"
          />
          <LabeledInput
            label="Building Name"
            id="buildingName"
            value={formData.buildingName}
            onChange={handleChange}
            placeholder="Enter building name"
            variant="rounded"
          />
          <LabeledInput
            label="Far No(s)"
            id="farNumbers"
            value={formData.farNumbers}
            onChange={handleChange}
            placeholder="Enter FAR numbers"
            variant="rounded"
          />
        </FormSection>

        {/* Property Information */}
        <FormSection
          title="Property Details"
          description="Specific property information"
          columns={4}
        >
          <LabeledInput
            label="House No"
            id="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            placeholder="Enter house number"
            variant="rounded"
          />
          <LabeledInput
            label="Block"
            id="block"
            value={formData.block}
            onChange={handleChange}
            placeholder="Enter block"
            variant="rounded"
          />
          <LabeledInput
            label="IID"
            id="iid"
            value={formData.iid}
            onChange={handleChange}
            placeholder="Enter IID"
            variant="rounded"
          />
          <LabeledInput
            label="Email Address"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            variant="icon"
            icon={<Mail size={18} />}
            type="email"
            required
          />
        </FormSection>

        {/* Location References */}
        <FormSection
          title="Location References"
          description="Additional location identifiers"
          columns={3}
        >
          <LabeledInput
            label="Landmark/Council/Review"
            id="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="Enter landmark or reference"
            variant="rounded"
          />
          <LabeledInput
            label="Google Map Address"
            id="googleMapAddress"
            value={formData.googleMapAddress}
            onChange={handleChange}
            placeholder="Enter Google Maps address"
            variant="rounded"
          />
          <LabeledInput
            label="TIN"
            id="tin"
            value={formData.tin}
            onChange={handleChange}
            placeholder="Enter Tax Identification Number"
            variant="rounded"
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
            {currentStep === totalSteps ? 'Submit Application' : 'Continue →'}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
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
  return classes.filter(Boolean).join(' ');
};

export default TaxpayerInfo;