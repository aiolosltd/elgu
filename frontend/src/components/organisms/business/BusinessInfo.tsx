import React, { useState } from "react";
import { LabeledInput } from '@/components/molecules/labeledInput'
import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchSelect } from '@/components/atoms/input/search-select';
import { useForm } from "@/context/FormContext";
import { cn } from '@/lib/utils';
import { useLookup } from '@/hooks/useLookup';
import { usePhilippineAddress } from '@/hooks/usePhilippineAddress';
import { GoogleMapModal } from '@/components/organisms/GoogleMapModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface BusinessInfoProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const FormSection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  columns?: number;
}> = ({ title, children, className, columns = 1 }) => (
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          columns === 2 ? "sm:grid-cols-2" : "",
          className
        )}
      >
        {children}
      </div>
    </CardContent>
  </Card>
);

const CheckboxItem: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ id, label, checked, onCheckedChange }) => (
  <div className="flex items-center space-x-3">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
    />
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
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
  const [showMap, setShowMap] = useState(false);

  const { formData, updateField, setFormData, errors } = useForm();
  const { getSelectOptions } = useLookup();
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
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    updateField(field, value);

    if (field === 'provinceName') {
      handleProvinceChange(value);
      updateField('cityMunicipality', '');
      updateField('barangayName', '');
    } else if (field === 'cityMunicipality') {
      handleCityChange(value);
      updateField('barangayName', '');
    }
  };

  const ownershipTypeOptions = getSelectOptions('Ownership');

  const handleLocationSelect = (lat: number, lng: number) => {
 updateField('longlat_', `${lat}, ${lng}`);
    // const coords = `${lat},${lng}`;
    // setFormData((prev) => ({
    //   ...prev,
    //   googleMapAddress: coords,
    // }));
  };

  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <section className="w-full">
      <Card className="w-full">
        <CardContent className="p-4 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
              Business Information
            </CardTitle>
            <CardDescription className="text-base">
              Provide complete business details
            </CardDescription>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Main Office Section */}
            <FormSection title="Main Office">
              <div className="flex flex-col sm:flex-row gap-6">
                <CheckboxItem
                  id="ismain_"
                  label="Main Office"
                  checked={!!formData.ismain_}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("ismain_", checked)
                  }
                />

                <CheckboxItem
                  id="isbranch_"
                  label="Foreign Company"
                  checked={!!formData.isbranch_}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("isbranch_", checked)
                  }
                />

                <CheckboxItem
                  id="isforeign_"
                  label="Foreign Company"
                  checked={!!formData.isforeign_}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("isforeign_", checked)
                  }
                />
              </div>
            </FormSection>

            {/* End of Ownership Section */}
            <FormSection title="End of Ownership" columns={2}>
              <SearchSelect
                label="Kind Of Ownership"
                id="ownershiptype_"
                value={formData.ownershiptype_ || ''}
                onChange={(value) => handleSelectChange('ownershiptype_', value)}
                options={ownershipTypeOptions}
                placeholder="Select ownership type"
                required
                error={errors.ownershiptype_}
              />

              <LabeledInput
                label="Business Name"
                id="businessname_"
                value={formData.businessname_}
                onChange={handleChange}
                placeholder="Enter business name"
                required
                error={errors.businessname_}
              />

              <LabeledInput
                label="Date Established"
                id="dateestablished_"
                value={formData.dateestablished_}
                onChange={handleChange}
                type="date"
              />

              <LabeledInput
                label="Name of President (CEO / Manager)"
                id="registeredceo_"
                value={formData.registeredceo_}
                onChange={handleChange}
                placeholder="Enter president/CEO name"
              />

              <LabeledInput
                label="Building Space (Rent/Own)"
                id="buildingspace_"
                value={formData.buildingspace_}
                onChange={handleChange}
                placeholder="Enter building space"
              />
            </FormSection>

            <FormSection title="Market Stall">
              <div className="flex flex-col sm:flex-row gap-6">
                <CheckboxItem
                  id="ismarketstall"
                  label="Market Stall"
                  checked={!!formData.ismarketstall}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("ismarketstall", checked)
                  }
                />

                <CheckboxItem
                  id="iscommercialbuilding"
                  label="Commercial Building"
                  checked={!!formData.iscommercialbuilding}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("iscommercialbuilding", checked)
                  }
                />

                <CheckboxItem
                  id="isfranchise_"
                  label="Trade Name (Franchise)"
                  checked={!!formData.isfranchise_}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("isfranchise_", checked)
                  }
                />
              </div>
            </FormSection>

            {/* Market Stall Home/Number Section */}
            <FormSection title="Market Stall Home/Number" columns={2}>
              <LabeledInput
                label="Market Stall Home/Number"
                id="marketstall_"
                value={formData.marketstall_ || ''}
                onChange={handleChange}
                placeholder="Enter Market Stall"
                readOnly={!formData.ismarketstall}
              />

              <LabeledInput
                label="Franchise Brand"
                id="tradename_"
                value={formData.tradename_ || ''}
                onChange={handleChange}
                placeholder="Enter franchise Brand"
                readOnly={!formData.isfranchise_}
              />

              <LabeledInput
                label="Building Name"
                id="buildingspace_"
                value={formData.buildingspace_ || ''}
                onChange={handleChange}
                placeholder="Enter building name"
                readOnly={!formData.buildingspace_}
              />
            </FormSection>

            {/* Address Information */}
            <FormSection title="Address Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Province */}
                <SearchSelect
                  label="Province"
                  id="province_"
                  value={formData.province_ || ''}
                  onChange={(value) => {
                    handleSelectChange('province_', value)
                    handleProvinceChange(value);
                  }}
                  options={provinceOptions}
                  placeholder="Select province"
                  required
                  error={errors.province_}
                />

                {/* Municipality/City */}
                <SearchSelect
                  label="City/Municipality"
                  id="municipality_"
                  value={formData.municipality_ || ''}
                  onChange={(value) => handleSelectChange('municipality_', value)}
                  options={cityOptions}
                  placeholder="Select city/municipality"
                  isDisabled={!formData.province_}
                  required
                  error={errors.municipality_}
                />

                {/* Barangay */}
                <LabeledInput
                  label="Barangay Name"
                  id="barangay_"
                  value={formData.barangay_ || ''}
                  onChange={handleChange}
                  placeholder="Enter Barangay Name"
                />

                <LabeledInput
                  label="Subdivision Address"
                  id="subdivision_"
                  value={formData.subdivision_ || ''}
                  onChange={handleChange}
                  placeholder="Enter subdivision"
                />

                <LabeledInput
                  label="Street"
                  id="street_"
                  value={formData.street_ || ''}
                  onChange={handleChange}
                  placeholder="Enter street name"
                />

                <LabeledInput
                  label="Building Name"
                  id="buildingname_"
                  value={formData.buildingname_ || ''}
                  onChange={handleChange}
                  placeholder="Enter building name"
                />

                <LabeledInput
                  label="House No"
                  id="houseno_"
                  value={formData.houseno_ || ''}
                  onChange={handleChange}
                  placeholder="Enter house number"
                />

                <LabeledInput
                  label="Block"
                  id="phaseblock_"
                  value={formData.phaseblock_ || ''}
                  onChange={handleChange}
                  placeholder="Enter block"
                />

                <LabeledInput
                  label="Lot"
                  id="lot_"
                  value={formData.lot_ || ''}
                  onChange={handleChange}
                  placeholder="Enter lot"
                />
              </div>
            </FormSection>

            {/* Contact Information Section */}
            <FormSection title="Contact Information" columns={2}>
              <LabeledInput
                label="Tel. No"
                id="telno_"
                value={formData.telno_ || ''}
                onChange={handleChange}
                placeholder="Enter telephone number"
                type="tel"
              />
              <LabeledInput
                label="Cellphone No"
                id="cellno_"
                value={formData.cellno_ || ''}
                onChange={handleChange}
                placeholder="Enter cellphone number"
                type="tel"
              />
              <LabeledInput
                label="Fax No"
                id="faxno_"
                value={formData.faxno_ || ''}
                onChange={handleChange}
                placeholder="Enter fax number"
              />
              <LabeledInput
                label="Email Address"
                id="email_"
                value={formData.email_ || ''}
                onChange={handleChange}
                placeholder="Enter email address"
                type="email"
              />
              <LabeledInput
                label="TIN"
                id="tin_"
                value={formData.tin_ || ''}
                onChange={handleChange}
                placeholder="Enter TIN"
                required
                error={errors.tin_}
              />
            </FormSection>

            <FormSection title="Landmark">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LabeledInput
                  label="Landmark/Corner/Avenue"
                  id="landmark_"
                  value={formData.landmark_}
                  onChange={handleChange}
                  placeholder="Enter landmark"
                  required
                  error={errors.landmark_}
                />

                <LabeledInput
                  label="Google Map Address"
                  id="longlat_"
                  value={formData.longlat_ || ''}
                  onChange={handleChange}
                  placeholder="Click 'Locate Me' to set coordinates"
                />

                          <div className="flex items-end pb-1 mt-1">
                  <Button
                    variant="primary"
                    onClick={() => setShowMap(true)}>
                    Locate Me
                  </Button>
              </div>
          </div>
        </FormSection>

        {showMap && (
          <GoogleMapModal
            onClose={() => setShowMap(false)}
            onSelectLocation={handleLocationSelect}
          />
        )}
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
            {currentStep === totalSteps ? "Submit Application" : "Continue →"}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progressValue)}% Complete</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>
    </CardContent>
      </Card >
    </section >
  );
};

export default BusinessInfo;