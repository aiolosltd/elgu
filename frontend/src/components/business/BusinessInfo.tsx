// src/components/forms/BusinessInfo.tsx
import React from 'react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { RadioGroup } from '@/components/atoms/input/radio';
import { Checkbox } from '@/components/atoms/input/checkbox';
import { useForm } from '@/context/FormContext';
import { Building, MapPin, User, Calendar, Phone, FileText, Home } from 'lucide-react';

interface BusinessInfoProps {
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

// Checkbox Group Component
const CheckboxGroup: React.FC<{
  label: string;
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}> = ({ label, options, selectedValues, onChange }) => (
  <div className="flex flex-col gap-3">
    <label className="text-sm font-semibold text-gray-800 mb-2">{label}</label>
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <Checkbox
            id={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...selectedValues, option.value]);
              } else {
                onChange(selectedValues.filter(v => v !== option.value));
              }
            }}
          />
          <label htmlFor={option.value} className="ml-2 text-sm text-gray-700">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </div>
);

const BusinessInfo: React.FC<BusinessInfoProps> = ({ 
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

  const handleArrayCheckboxChange = (field: string, values: string[]) => {
    updateField(field, values);
  };

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Business Information and Registration
        </h2>
        <p className="text-gray-600">
          Provide complete details about your business structure and operations
        </p>
      </div>

      <div className="space-y-8">
        {/* Business Type Section */}
        <FormSection 
          title="Business Structure" 
          description="Select the legal structure of your business"
          columns={1}
        >
          <RadioGroup
            name="businessType"
            options={[
              { label: "👤 Sole Proprietorship", value: "sole" },
              { label: "🤝 Partnership", value: "partnership" },
              { label: "🏢 Corporation", value: "corporation" },
              { label: "👥 Cooperative", value: "cooperative" },
              { label: "👨‍💼 One-Person Corporation", value: "one-person" },
            ]}
            selectedValue={formData.businessType}
            onChange={(value) => handleRadioChange('businessType', value)}
            layout="vertical"
          />
        </FormSection>

        {/* Registration Information */}
        <FormSection 
          title="Registration Details" 
          description="Official registration numbers and identifiers"
        >
          <LabeledInput
            label="DTI / SEC / CDA Registration Number"
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="Enter registration number"
            variant="icon"
            icon={<FileText size={18} />}
            required
          />
          <LabeledInput
            label="Tax Identification Number (TIN)"
            id="tin"
            value={formData.tin}
            onChange={handleChange}
            placeholder="Enter TIN"
            variant="icon"
            icon={<FileText size={18} />}
            required
          />
        </FormSection>

        {/* Business Names */}
        <FormSection 
          title="Business Identification" 
          description="Official names and trade names"
        >
          <LabeledInput
            label="Business Name"
            id="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter official business name"
            variant="icon"
            icon={<Building size={18} />}
            required
          />
          <LabeledInput
            label="Trade Name / Franchise"
            id="tradeName"
            value={formData.tradeName}
            onChange={handleChange}
            placeholder="Enter trade name if different"
            variant="icon"
            icon={<Building size={18} />}
          />
          <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Checkbox
              id="sameAsBusinessName"
              checked={!!formData.sameAsBusinessName}
              onCheckedChange={(checked) => handleCheckboxChange('sameAsBusinessName', checked)}
            />
            <label htmlFor="sameAsBusinessName" className="text-sm font-medium text-gray-800 cursor-pointer">
              Same as Business Name
            </label>
          </div>
        </FormSection>

        {/* Main Office Section */}
        <FormSection 
          title="Office Type" 
          description="Select the type of main office"
          columns={1}
        >
          <CheckboxGroup
            label="Main Office Type"
            options={[
              { label: "🏢 Branch Office", value: "branch" },
              { label: "🌍 Foreign Company", value: "foreign-company" },
            ]}
            selectedValues={formData.mainOfficeType || []}
            onChange={(values) => handleArrayCheckboxChange('mainOfficeType', values)}
          />
        </FormSection>

        {/* Ownership Information */}
        <FormSection 
          title="Ownership Details" 
          description="Information about business ownership and management"
        >
          <LabeledInput
            label="Business Name"
            id="ownershipBusinessName"
            value={formData.ownershipBusinessName}
            onChange={handleChange}
            placeholder="Enter business name"
            variant="rounded"
          />
          <LabeledInput
            label="Ownership Information"
            id="ownershipInformation"
            value={formData.ownershipInformation}
            onChange={handleChange}
            placeholder="Additional ownership details"
            variant="rounded"
          />
          <LabeledInput
            label="Date Enabled/Held"
            id="dateEnabled"
            value={formData.dateEnabled}
            onChange={handleChange}
            type="date"
            variant="icon"
            icon={<Calendar size={18} />}
          />
          <LabeledInput
            label="President / CEO / Manager"
            id="ceoName"
            value={formData.ceoName}
            onChange={handleChange}
            placeholder="Full name of head officer"
            variant="icon"
            icon={<User size={18} />}
          />
          <LabeledInput
            label="T20/2025 Reference"
            id="t202025"
            value={formData.t202025}
            onChange={handleChange}
            placeholder="T20/2025 reference number"
            variant="rounded"
          />
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Checkbox
              id="unfebrafizedOwnership"
              checked={!!formData.unfebrafizedOwnership}
              onCheckedChange={(checked) => handleCheckboxChange('unfebrafizedOwnership', checked)}
            />
            <label htmlFor="unfebrafizedOwnership" className="text-sm font-medium text-gray-800 cursor-pointer">
              Unfebrafized Ownership
            </label>
          </div>
        </FormSection>

        {/* Building Space */}
        <FormSection 
          title="Building Space" 
          description="Information about your business premises"
          columns={1}
        >
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Checkbox
              id="unfebrafizedBuilding"
              checked={!!formData.unfebrafizedBuilding}
              onCheckedChange={(checked) => handleCheckboxChange('unfebrafizedBuilding', checked)}
            />
            <label htmlFor="unfebrafizedBuilding" className="text-sm font-medium text-gray-800 cursor-pointer">
              Unfebrafized Building Space (Pinet/Own)
            </label>
          </div>
        </FormSection>

        {/* Market Stall Information */}
        <FormSection 
          title="Market Stall Details" 
          description="Information about your market stall or commercial space"
        >
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Checkbox
              id="commercialBuilding"
              checked={!!formData.commercialBuilding}
              onCheckedChange={(checked) => handleCheckboxChange('commercialBuilding', checked)}
            />
            <label htmlFor="commercialBuilding" className="text-sm font-medium text-gray-800 cursor-pointer">
              Commercial Building
            </label>
          </div>
          <LabeledInput
            label="Trade Name (Prunchie)"
            id="tradeNamePrunchie"
            value={formData.tradeNamePrunchie}
            onChange={handleChange}
            placeholder="Enter trade name"
            variant="rounded"
          />
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Checkbox
              id="franchiseBrand"
              checked={!!formData.franchiseBrand}
              onCheckedChange={(checked) => handleCheckboxChange('franchiseBrand', checked)}
            />
            <label htmlFor="franchiseBrand" className="text-sm font-medium text-gray-800 cursor-pointer">
              Franchise Brand
            </label>
          </div>
          <LabeledInput
            label="Market Stall Name/Member"
            id="marketStallName"
            value={formData.marketStallName}
            onChange={handleChange}
            placeholder="Enter market stall name"
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
        </FormSection>

        {/* Address Information */}
        <FormSection 
          title="Address Details" 
          description="Complete address information for your business"
          columns={3}
        >
          <LabeledInput
            label="Pointless Name"
            id="pointlessName"
            value={formData.pointlessName}
            onChange={handleChange}
            placeholder="Cloud"
            variant="rounded"
          />
          <LabeledInput
            label="Buildings/Name"
            id="buildingsName"
            value={formData.buildingsName}
            onChange={handleChange}
            placeholder="Building name"
            variant="rounded"
          />
          <LabeledInput
            label="Site Area"
            id="siteArea"
            value={formData.siteArea}
            onChange={handleChange}
            placeholder="Site area"
            variant="rounded"
          />
          <LabeledInput
            label="Street"
            id="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street name"
            variant="icon"
            icon={<MapPin size={18} />}
          />
          <LabeledInput
            label="House No."
            id="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            placeholder="2"
            variant="rounded"
          />
          <LabeledInput
            label="Landmark/Connect/Inventor"
            id="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="User man model"
            variant="rounded"
          />
          <LabeledInput
            label="City/Municipality"
            id="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Adoptio"
            variant="icon"
            icon={<MapPin size={18} />}
          />
          <LabeledInput
            label="Subdivision"
            id="subdivision"
            value={formData.subdivision}
            onChange={handleChange}
            placeholder="Subdivision name"
            variant="rounded"
          />
          <LabeledInput
            label="Building Name"
            id="addressBuildingName"
            value={formData.addressBuildingName}
            onChange={handleChange}
            placeholder="Blog_200"
            variant="rounded"
          />
        </FormSection>

        {/* Contact Information */}
        <FormSection 
          title="Contact Information" 
          description="How customers and authorities can reach your business"
        >
          <div className="md:col-span-2">
            <CheckboxGroup
              label="Communication Methods"
              options={[
                { label: "📞 Telephone N643", value: "tel-n643" },
                { label: "📱 Cellphone N643", value: "cellphone-n643" },
                { label: "📠 Fax N643", value: "fax-n643" },
                { label: "✉️ Email Address", value: "email-address" },
                { label: "™️ T.M.", value: "tm" },
              ]}
              selectedValues={formData.communicationMethods || []}
              onChange={(values) => handleArrayCheckboxChange('communicationMethods', values)}
            />
          </div>
          <LabeledInput
            label="Phone/Block"
            id="phoneBlock"
            value={formData.phoneBlock}
            onChange={handleChange}
            placeholder="Ld4"
            variant="icon"
            icon={<Phone size={18} />}
          />
          <LabeledInput
            label="Google Map Address"
            id="googleMapAddress"
            value={formData.googleMapAddress}
            onChange={handleChange}
            placeholder="14.9581 192, 21.1785699"
            variant="icon"
            icon={<MapPin size={18} />}
          />
          <LabeledInput
            label="Mobile Phone"
            id="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            placeholder="Mobile number"
            variant="icon"
            icon={<Phone size={18} />}
          />
          <LabeledInput
            label="Building Details"
            id="buildingDetails"
            value={formData.buildingDetails}
            onChange={handleChange}
            placeholder="Additional building details"
            variant="icon"
            icon={<Home size={18} />}
          />
        </FormSection>

        {/* Terms and Conditions */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={!!formData.terms}
              onCheckedChange={(checked) => handleCheckboxChange('terms', checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor="terms" className="text-sm font-semibold text-gray-800 cursor-pointer">
                I certify that all information provided is accurate and complete
              </label>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, you confirm that all business information provided is truthful and accurate to the best of your knowledge.
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

export default BusinessInfo;