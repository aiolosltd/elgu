// src/components/forms/TaxpayerInfo.tsx
import React from 'react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { RadioGroup } from '@/components/atoms/input/radio';
import { Checkbox } from '@/components/atoms/input/checkbox';
import { useForm } from '@/context/FormContext';
import { Mail, Phone, Calendar, MapPin, User, Eye, EyeOff } from 'lucide-react';

interface TaxpayerInfoProps {
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
}> = ({ title, description, children }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
    {children}
  </div>
);

const TaxpayerInfo: React.FC<TaxpayerInfoProps> = ({
  nextStep,
  prevStep,
  currentStep,
  totalSteps
}) => {
  const { formData, updateField } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleRadioChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateField(field, checked);
  };

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Taxpayer Information
        </h2>
        <p className="text-gray-600">
          Please provide your basic information for registration
        </p>
      </div>

      <div className="space-y-8">
        {/* Taxpayer Type Section */}
        <FormSection
          title="Taxpayer Type"
          description="Select the type of taxpayer you are registering as"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RadioGroup
              name="taxpayerType"
              options={[
                { label: "Individual", value: "individual" },
                { label: " Corporation", value: "corporation" },
                { label: " Partnership", value: "partnership" },
                { label: " Sole Proprietor", value: "sole-proprietor" },
              ]}
              selectedValue={formData.taxpayerType}
              onChange={(value) => handleRadioChange('taxpayerType', value)}
              layout="vertical"
            />
          </div>
        </FormSection>

        {/* Personal Information Section */}
        <FormSection
          title="Personal Information"
          description="Your basic personal details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledInput
              label="Full Name"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              variant="icon"
              icon={<User size={18} />}
              required
            />
            <LabeledInput
              label="Date of Birth"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              variant="icon"
              icon={<Calendar size={18} />}
              type="date"
              required
            />
          </div>
        </FormSection>

        {/* Contact Information Section */}
        <FormSection
          title="Contact Information"
          description="How we can reach you"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <LabeledInput
              label="Phone Number"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+63 912 345 6789"
              variant="icon"
              icon={<Phone size={18} />}
              type="tel"
              required
            />
          </div>
        </FormSection>

        {/* Address Information Section */}
        <FormSection
          title="Address Information"
          description="Your current residential address"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <LabeledInput
                label="Street Address"
                id="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="123 Main Street, Barangay Example"
                variant="icon"
                icon={<MapPin size={18} />}
                required
              />
            </div>
            <LabeledInput
              label="City/Municipality"
              id="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              variant="rounded"
              required
            />
            <LabeledInput
              label="Postal Code"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="5000"
              variant="rounded"
              required
            />
          </div>
        </FormSection>

        {/* Security Section */}
        <FormSection
          title="Security"
          description="Create your account credentials"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledInput
              label="Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              variant="icon"
              icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              type={showPassword ? "text" : "password"}
              onIconClick={() => setShowPassword(!showPassword)}
              required
            />
            <LabeledInput
              label="Confirm Password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              variant="icon"
              icon={<Eye size={18} />}
              type="password"
              required
            />
          </div>
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
                I agree to the Terms and Conditions
              </label>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, you confirm that all information provided is accurate and you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-gray-800">Stay Updated</p>
            <p className="text-sm text-gray-600">Receive important updates and notifications</p>
          </div>
          <Checkbox
            id="newsletter"
            checked={!!formData.newsletter}
            onCheckedChange={(checked) => handleCheckboxChange('newsletter', checked)}
          />
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
            Save Draft
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

export default TaxpayerInfo;