// src/components/forms/BusinessOperation.tsx
import React from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Checkbox } from '@/components/atoms/input/checkbox';
import { RadioGroup } from '@/components/atoms/input/radio';
import { useForm } from '@/context/FormContext';
import { Calendar, MapPin, Users, Ruler, Building } from 'lucide-react';

interface BusinessOperationProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

// Enhanced LabeledInput with better styling
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

// Section wrapper for better organization
const FormSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}> = ({ title, description, children, columns = 2 }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
    <div className={cn(
      "grid gap-6",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-3"
    )}>
      {children}
    </div>
  </div>
);

// Date Input Group Component
const DateInputGroup: React.FC<{
  label: string;
  id: string;
  value: string;
  issuedDate: string;
  expirationDate: string;
  onValueChange: (value: string) => void;
  onIssuedDateChange: (date: string) => void;
  onExpirationDateChange: (date: string) => void;
}> = ({ label, id, value, issuedDate, expirationDate, onValueChange, onIssuedDateChange, onExpirationDateChange }) => (
  <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
    <LabeledInput
      label={label}
      id={id}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={`Enter ${label}`}
      variant="rounded"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabeledInput
        label="Issued Date"
        id={`${id}IssuedDate`}
        value={issuedDate}
        onChange={(e) => onIssuedDateChange(e.target.value)}
        type="date"
        variant="icon"
        icon={<Calendar size={18} />}
      />
      <LabeledInput
        label="Expiration Date"
        id={`${id}ExpirationDate`}
        value={expirationDate}
        onChange={(e) => onExpirationDateChange(e.target.value)}
        type="date"
        variant="icon"
        icon={<Calendar size={18} />}
      />
    </div>
  </div>
);

// Requirements Table Component
const RequirementsTable: React.FC<{
  requirements: Array<{
    id: string;
    type: string;
    description: string;
    name: string;
    status: string;
  }>;
  onRequirementChange: (id: string, field: string, value: string) => void;
}> = ({ requirements, onRequirementChange }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
            Requirement Type
          </th>
          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
            Description
          </th>
          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
            Name
          </th>
          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {requirements.map((req, index) => (
          <tr key={req.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="border border-gray-300 px-4 py-3">
              <Input
                value={req.type}
                onChange={(e) => onRequirementChange(req.id, 'type', e.target.value)}
                variant="underline"
                className="border-0 focus:ring-0"
              />
            </td>
            <td className="border border-gray-300 px-4 py-3">
              <Input
                value={req.description}
                onChange={(e) => onRequirementChange(req.id, 'description', e.target.value)}
                variant="underline"
                className="border-0 focus:ring-0"
              />
            </td>
            <td className="border border-gray-300 px-4 py-3">
              <Input
                value={req.name}
                onChange={(e) => onRequirementChange(req.id, 'name', e.target.value)}
                variant="underline"
                className="border-0 focus:ring-0"
              />
            </td>
            <td className="border border-gray-300 px-4 py-3">
              <Input
                value={req.status}
                onChange={(e) => onRequirementChange(req.id, 'status', e.target.value)}
                variant="underline"
                className="border-0 focus:ring-0"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BusinessOperation: React.FC<BusinessOperationProps> = ({ 
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

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateField(field, checked);
  };

  // const handleDateGroupChange = (baseField: string, value: string, issuedDate: string, expirationDate: string) => {
  //   updateField(baseField, value);
  //   updateField(`${baseField}IssuedDate`, issuedDate);
  //   updateField(`${baseField}ExpirationDate`, expirationDate);
  // };

  const handleRequirementChange = (id: string, field: string, value: string) => {
    const updatedRequirements = (formData.requirements || []).map((req: { id: string; }) => 
      req.id === id ? { ...req, [field]: value } : req
    );
    updateField('requirements', updatedRequirements);
  };

  // Initialize requirements if not exists
  React.useEffect(() => {
    if (!formData.requirements || formData.requirements.length === 0) {
      updateField('requirements', [
        { id: '1', type: 'Business Permit', description: 'Business Permit', name: 'Debts', status: 'Pending' },
        { id: '2', type: 'Community Tax Certification', description: 'Community Tax Certification (PT)', name: 'Debts', status: 'Pending' }
      ]);
    }
  }, []);

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Business Operation and Requirements
        </h2>
        <p className="text-gray-600">
          Provide operational details and required business documents
        </p>
      </div>

      <div className="space-y-8">
        {/* Business Basic Information */}
        <FormSection 
          title="Business Operations" 
          description="Basic information about your business operations"
        >
          <LabeledInput
            label="Business Area (in sq. m.)"
            id="businessArea"
            value={formData.businessArea || ''}
            onChange={handleChange}
            placeholder="Enter area in square meters"
            variant="icon"
            icon={<Ruler size={18} />}
          />
          <LabeledInput
            label="No. of Employees"
            id="numEmployees"
            value={formData.numEmployees || ''}
            onChange={handleChange}
            placeholder="Enter number of employees"
            variant="icon"
            icon={<Users size={18} />}
          />
        </FormSection>

        {/* Business Address */}
        <FormSection 
          title="Business Address" 
          description="Location where the business operates"
          columns={1}
        >
          <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <Checkbox
              id="opSameAsMain"
              checked={!!formData.opSameAsMain}
              onCheckedChange={(checked) => handleCheckboxChange('opSameAsMain', checked)}
            />
            <label htmlFor="opSameAsMain" className="text-sm font-medium text-gray-800 cursor-pointer">
              Same as Main Office Address
            </label>
          </div>
          
          {!formData.opSameAsMain && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LabeledInput
                label="Street Address"
                id="opStreetAddress"
                value={formData.opStreetAddress || ''}
                onChange={handleChange}
                placeholder="Enter street address"
                variant="icon"
                icon={<MapPin size={18} />}
              />
              <LabeledInput
                label="City/Municipality"
                id="opCity"
                value={formData.opCity || ''}
                onChange={handleChange}
                placeholder="Enter city"
                variant="rounded"
              />
              <LabeledInput
                label="Postal Code"
                id="opPostalCode"
                value={formData.opPostalCode || ''}
                onChange={handleChange}
                placeholder="Enter postal code"
                variant="rounded"
              />
              <LabeledInput
                label="Building Name"
                id="opBuildingName"
                value={formData.opBuildingName || ''}
                onChange={handleChange}
                placeholder="Enter building name"
                variant="icon"
                icon={<Building size={18} />}
              />
            </div>
          )}
        </FormSection>

        {/* Registration Numbers Section */}
        <FormSection 
          title="Registration and License Numbers" 
          description="Official registration numbers and their validity periods"
        >
          <DateInputGroup
            label="OTH No."
            id="othNo"
            value={formData.othNo || ''}
            issuedDate={formData.othNoIssuedDate || ''}
            expirationDate={formData.othNoExpirationDate || ''}
            onValueChange={(value) => updateField('othNo', value)}
            onIssuedDateChange={(date) => updateField('othNoIssuedDate', date)}
            onExpirationDateChange={(date) => updateField('othNoExpirationDate', date)}
          />
          
          <DateInputGroup
            label="SEC Registration No."
            id="secRegistrationNo"
            value={formData.secRegistrationNo || ''}
            issuedDate={formData.secRegistrationNoIssuedDate || ''}
            expirationDate={formData.secRegistrationNoExpirationDate || ''}
            onValueChange={(value) => updateField('secRegistrationNo', value)}
            onIssuedDateChange={(date) => updateField('secRegistrationNoIssuedDate', date)}
            onExpirationDateChange={(date) => updateField('secRegistrationNoExpirationDate', date)}
          />
        </FormSection>

        {/* Additional Registration Numbers */}
        <FormSection 
          title="Additional Registrations" 
          description="Other government registration numbers"
          columns={2}
        >
          <DateInputGroup
            label="CCM No."
            id="ccmNo"
            value={formData.ccmNo || ''}
            issuedDate={formData.ccmNoIssuedDate || ''}
            expirationDate={formData.ccmNoExpirationDate || ''}
            onValueChange={(value) => updateField('ccmNo', value)}
            onIssuedDateChange={(date) => updateField('ccmNoIssuedDate', date)}
            onExpirationDateChange={(date) => updateField('ccmNoExpirationDate', date)}
          />
          
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <LabeledInput
              label="SSS No."
              id="sssNo"
              value={formData.sssNo || ''}
              onChange={handleChange}
              placeholder="Enter SSS number"
              variant="rounded"
            />
            <LabeledInput
              label="Date Registered"
              id="sssDateRegistered"
              value={formData.sssDateRegistered || ''}
              onChange={handleChange}
              type="date"
              variant="icon"
              icon={<Calendar size={18} />}
            />
          </div>

          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <LabeledInput
              label="Local Clearance No."
              id="localClearanceNo"
              value={formData.localClearanceNo || ''}
              onChange={handleChange}
              placeholder="Enter local clearance number"
              variant="rounded"
            />
            <LabeledInput
              label="Date Registered"
              id="localClearanceDate"
              value={formData.localClearanceDate || ''}
              onChange={handleChange}
              type="date"
              variant="icon"
              icon={<Calendar size={18} />}
            />
          </div>

          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <LabeledInput
              label="Pricc No."
              id="priccNo"
              value={formData.priccNo || ''}
              onChange={handleChange}
              placeholder="Enter Pricc number"
              variant="rounded"
            />
            <LabeledInput
              label="Date Registered"
              id="priccDateRegistered"
              value={formData.priccDateRegistered || ''}
              onChange={handleChange}
              type="date"
              variant="icon"
              icon={<Calendar size={18} />}
            />
          </div>
        </FormSection>

        {/* Community Tax Certificate Section */}
        <FormSection 
          title="Community Tax Certificate" 
          description="Community tax registration details"
        >
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <label className="text-sm font-semibold text-gray-800 mb-3 block">
                Do you have an existing Community Tax Certificate?
              </label>
              <RadioGroup
                name="hasCommunityTaxCert"
                options={[
                  { label: "✅ YES", value: "yes" },
                  { label: "❌ NO", value: "no" },
                ]}
                selectedValue={formData.hasCommunityTaxCert}
                onChange={(value) => handleRadioChange('hasCommunityTaxCert', value)}
                layout="horizontal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LabeledInput
                label="Community Tax Cert No."
                id="communityTaxCertNo"
                value={formData.communityTaxCertNo || ''}
                onChange={handleChange}
                placeholder="Enter certificate number"
                variant="rounded"
              />
              <LabeledInput
                label="Place of Issue"
                id="communityTaxPlaceOfIssue"
                value={formData.communityTaxPlaceOfIssue || ''}
                onChange={handleChange}
                placeholder="Enter place of issue"
                variant="rounded"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LabeledInput
                label="Date Registered"
                id="communityTaxDateRegistered"
                value={formData.communityTaxDateRegistered || ''}
                onChange={handleChange}
                type="date"
                variant="icon"
                icon={<Calendar size={18} />}
              />
              <LabeledInput
                label="Expiration Date"
                id="communityTaxExpirationDate"
                value={formData.communityTaxExpirationDate || ''}
                onChange={handleChange}
                type="date"
                variant="icon"
                icon={<Calendar size={18} />}
              />
              <LabeledInput
                label="Issued Date"
                id="communityTaxIssuedDate"
                value={formData.communityTaxIssuedDate || ''}
                onChange={handleChange}
                type="date"
                variant="icon"
                icon={<Calendar size={18} />}
              />
            </div>

            <LabeledInput
              label="Amount"
              id="communityTaxAmount"
              value={formData.communityTaxAmount || ''}
              onChange={handleChange}
              placeholder="Enter amount"
              variant="rounded"
              type="number"
            />
          </div>
        </FormSection>

        {/* Requirements Section */}
        <FormSection 
          title="List of Requirements" 
          description="Required documents for business operation"
          columns={1}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Document Description</h4>
              <p className="text-sm text-gray-600">List all required documents and their current status</p>
            </div>
            
            <RequirementsTable
              requirements={formData.requirements || []}
              onRequirementChange={handleRequirementChange}
            />
            
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                const newRequirement = {
                  id: Date.now().toString(),
                  type: '',
                  description: '',
                  name: '',
                  status: 'Pending'
                };
                updateField('requirements', [...(formData.requirements || []), newRequirement]);
              }}
            >
              + Add Requirement
            </Button>
          </div>
        </FormSection>

        {/* Verification Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="operationVerified"
              checked={!!formData.operationVerified}
              onCheckedChange={(checked) => handleCheckboxChange('operationVerified', checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor="operationVerified" className="text-sm font-semibold text-gray-800 cursor-pointer">
                I verify that all operational information provided is accurate
              </label>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, you confirm that all business operation details and registration information are current and valid.
              </p>
            </div>
          </div>
        </div>
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
            variant="outline"
            className="w-full sm:w-auto px-8 py-3"
          >
            💾 Save Draft
          </Button>
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

// Add cn utility if not already available
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default BusinessOperation;