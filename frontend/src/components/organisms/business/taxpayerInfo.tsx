import React, { useEffect } from 'react'
import { LabeledInput } from '@/components/molecules/labeledInput'
import { Button } from '@/components/atoms/button'
import { SearchSelect } from '@/components/atoms/input/search-select'
import { useForm } from '@/context/FormContext'
import { Mail, Phone, Calendar, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLookup } from '@/hooks/useLookup'
import { usePhilippineAddress } from '@/hooks/usePhilippineAddress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from "@/components/atoms/input/checkbox";

interface TaxpayerInfoProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

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

const FormSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className }) => (
  <Card className="w-full">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      {description && (
        <CardDescription>{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent>
      <div className={cn("grid grid-cols-1 gap-4", className)}>
        {children}
      </div>
    </CardContent>
  </Card>
);

const TaxpayerInfo: React.FC<TaxpayerInfoProps> = ({
  nextStep,
  prevStep,
  currentStep,
  totalSteps
}) => {
  const { formData, updateField, errors } = useForm();
  const { getSelectOptions, loading, error, refresh } = useLookup();
  const {
    provinceOptions,
    cityOptions,
    handleProvinceChange,
    handleCityChange
  } = usePhilippineAddress();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateField(field, checked);

  };
  const handleSelectChange = (field: string, value: string) => {
    updateField(field, value);

    // Handle address dependencies
    if (field === 'provinceName') {
      handleProvinceChange(value);
      updateField('cityMunicipality', '');
      updateField('barangayName', '');
    } else if (field === 'cityMunicipality') {
      handleCityChange(value);
      updateField('barangayName', '');
    }
  };

  // Debug effect
  useEffect(() => {
    console.log('Form Data:', formData);
    console.log('Ownership Type Rep:', formData.ownershiptype_rep);
    console.log('Gender:', formData.gender_);
    console.log('Civil Status:', formData.civilstatus_);
    console.log('Nationality:', formData.nationality_);
  }, [formData]);

  // Get options from lookup API
  const genderOptions = getSelectOptions('gender');
  const civilStatusOptions = getSelectOptions('civilstatus');
  const nationalityOptions = getSelectOptions('nationality');
  const ownershipTypeOptions = getSelectOptions('Ownership');

  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <section className="w-full mx-auto">
      <Card className="w-full">
        <CardContent className="p-4 sm:p-8">
          {/* Header with Refresh Button */}
          <div className="text-center mb-6 sm:mb-8 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={refresh}
              disabled={loading}
              className="absolute top-0 right-0"
              title="Refresh options"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>

            <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
              Taxpayer Information
            </CardTitle>
            <CardDescription className="text-base">
              Please provide your complete information for registration
            </CardDescription>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Registrant Information */}
            <FormSection
              title="Registrant Information"
              description="Primary registrant details"
              className="md:grid-cols-3"
            >
              <LabeledInput
                label="Registrant Name"
                id="repname_"
                value={formData.repname_}
                onChange={handleChange}
                placeholder="Enter registrant name"
                required
                error={errors.repname_}
              />
              <LabeledInput
                label="Registrant Position"
                id="repposition_"
                value={formData.repposition_}
                onChange={handleChange}
                placeholder="Enter position"
              />

              <SearchSelect
                label="Ownership Type"
                id="ownershiptype_rep"
                value={formData.ownershiptype_rep || ''}
                onChange={(value) => handleSelectChange('ownershiptype_rep', value)}
                options={ownershipTypeOptions}
                placeholder="Select ownership type"
                required
                error={errors.ownershiptype_rep}
              />
            </FormSection>

            {/* Personal Name Information */}
            <FormSection
              title="Personal Name"
              description="Your complete name details"
              className="md:grid-cols-4"
            >
              <LabeledInput
                label="First Name"
                id="firstname_"
                value={formData.firstname_}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                error={errors.firstname_}
              />
              <LabeledInput
                label="Middle Name/Initial"
                id="middlename_"
                value={formData.middlename_ || ''}
                onChange={handleChange}
                placeholder="Enter middle name"
                error={errors.middlename_}
              />
              <LabeledInput
                label="Last Name"
                id="lastname_"
                value={formData.lastname_}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                error={errors.lastname_}
              />
              <LabeledInput
                label="Suffix Name"
                id="suffixname_"
                value={formData.suffixname_ || ''}
                onChange={handleChange}
                placeholder="e.g., Jr., Sr., III"
              />

              <LabeledInput
                label="Birth Date"
                id="birthdate_"
                value={formData.birthdate_}
                onChange={handleChange}
                placeholder="MM/DD/YYYY"
                variant="icon"
                icon={<Calendar className="h-4 w-4" />}
                type="date"
                required
                error={errors.birthdate_}
              />

              <SearchSelect
                label="Gender"
                id="gender_"
                value={formData.gender_ || ''}
                onChange={(value) => handleSelectChange('gender_', value)}
                options={genderOptions}
                placeholder="Select gender"
                required
                error={errors.gender_}
              />

              <SearchSelect
                label="Civil Status"
                id="civilstatus_"
                value={formData.civilstatus_ || ''}
                onChange={(value) => handleSelectChange('civilstatus_', value)}
                options={civilStatusOptions}
                placeholder="Select civil status"
                required
                error={errors.civilstatus_}
              />

              <SearchSelect
                label="Nationality"
                id="nationality_"
                value={formData.nationality_ || ''}
                onChange={(value) => handleSelectChange('nationality_', value)}
                options={nationalityOptions}
                placeholder="Select nationality"
                required
                error={errors.nationality_}
              />
            </FormSection>




            {/* Address Information */}
            <FormSection
              title="Address Information"
              description="Your complete address details"
              className="md:grid-cols-3"
            >

             <div className="md:col-span-3">
                <CheckboxItem
                  id="outsidecity_"
                  label="Outside City/Municipality of Iloilo"
                  checked={!!formData.outsidecity_}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("outsidecity_", checked)
                  }
                />
              </div>

              {/* Province */}
              <SearchSelect
                label="Province"
                id="province_rep"
                value={formData.province_rep || ''}
                onChange={(value) => {
                  handleSelectChange('province_rep', value)
                  handleProvinceChange(value);
                }}
                options={provinceOptions}
                placeholder="Select province"
                required
                error={errors.province_rep}
              />

              {/* Municipality/City */}
              <SearchSelect
                label="City/Municipality"
                id="municipality_rep"
                value={formData.municipality_rep || ''}
                onChange={(value) => handleSelectChange('municipality_rep', value)}
                options={cityOptions}
                placeholder="Select city/municipality"
                isDisabled={!formData.province_rep}
                required
                error={errors.municipality_rep}
              />

              {/* Barangay */}
              <LabeledInput
                label="Barangay Name"
                id="barangay_rep"
                value={formData.barangay_rep || ''}
                onChange={handleChange}
                placeholder="Enter Barangay Name"
              />

              <LabeledInput
                label="Subdivision Address"
                id="subdivision_rep"
                value={formData.subdivision_rep || ''}
                onChange={handleChange}
                placeholder="Enter subdivision"
              />

              <LabeledInput
                label="Street"
                id="street_rep"
                value={formData.street_rep || ''}
                onChange={handleChange}
                placeholder="Enter street name"
              />

              <LabeledInput
                label="Building Name"
                id="buildingname_rep"
                value={formData.buildingname_rep || ''}
                onChange={handleChange}
                placeholder="Enter building name"
              />

              <LabeledInput
                label="House No"
                id="houseno_rep"
                value={formData.houseno_rep || ''}
                onChange={handleChange}
                placeholder="Enter house number"
              />

              <LabeledInput
                label="Block"
                id="block_"
                value={formData.block_ || ''}
                onChange={handleChange}
                placeholder="Enter block"
              />

              <LabeledInput
                label="Lot"
                id="lot_rep"
                value={formData.lot_rep || ''}
                onChange={handleChange}
                placeholder="Enter lot"
              />

              <LabeledInput
                label="Landmark"
                id="landmark_rep"
                value={formData.landmark_rep || ''}
                onChange={handleChange}
                placeholder="Enter Landmark"
              />
            </FormSection>

            {/* Contact Information */}
            <FormSection
              title="Contact Information"
              description="Primary contact details"
              className="md:grid-cols-3"
            >
              <LabeledInput
                label="Tel. No(s)"
                id="telno_rep"
                value={formData.telno_rep || ''}
                onChange={handleChange}
                placeholder="Enter telephone numbers"
                variant="icon"
                icon={<Phone className="h-4 w-4" />}
                type="tel"
              />

              <LabeledInput
                label="Cellphone No(s)"
                id="cellno_rep"
                value={formData.cellno_rep || ''}
                onChange={handleChange}
                placeholder="Enter cellphone numbers"
              />

              <LabeledInput
                label="Fax No(s)"
                id="faxno_rep"
                value={formData.faxno_rep || ''}
                onChange={handleChange}
                placeholder="Enter FAX numbers"
              />

              <LabeledInput
                label="T.I.N"
                id="tin_rep"
                value={formData.tin_rep || ''}
                onChange={handleChange}
                placeholder="Enter TIN"
              />

              <LabeledInput
                label="Email Address"
                id="email_rep"
                value={formData.email_rep}
                onChange={handleChange}
                placeholder="your.email@example.com"
                variant="icon"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                  error={errors.email_rep } 
                required
              />
            </FormSection>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t gap-4">
            <Button
              variant="primary"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto px-8 py-3"
            >
              ← Back
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                onClick={nextStep}
                className="w-full sm:w-auto px-8 py-3"
              >
                {currentStep === totalSteps ? 'Submit Application' : 'Continue →'}
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progressValue)}% Complete</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TaxpayerInfo;