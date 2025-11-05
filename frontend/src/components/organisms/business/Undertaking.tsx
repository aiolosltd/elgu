import React from 'react';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@/context/FormContext';
import { FileText, Building, Users, MapPin, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SummaryProps {
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

// Section wrapper for better organization
const SummarySection: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <Card>
    <CardHeader className="pb-4">
      <div className="flex items-center">
        {icon && <div className="mr-3 text-primary">{icon}</div>}
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

// Summary Item Component
const SummaryItem: React.FC<{
  label: string;
  value: string | number | boolean;
  type?: 'text' | 'date' | 'boolean';
}> = ({ label, value, type = 'text' }) => (
  <div className="flex justify-between py-2 border-b border-border last:border-b-0">
    <span className="font-medium text-muted-foreground">{label}:</span>
    <span className="text-foreground">
      {type === 'boolean'
        ? (value ? 'Yes' : 'No')
        : type === 'date'
          ? (value ? new Date(value as string).toLocaleDateString() : 'Not provided')
          : value || 'Not provided'}
    </span>
  </div>
);

const Summary: React.FC<SummaryProps> = ({ prevStep, currentStep, totalSteps }) => {
  const { formData, submitForm, updateForm, isLoading, updateField, isEditMode } = useForm();
  const [agreed, setAgreed] = React.useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const businessId = params.businessId || params.id;

  React.useEffect(() => {
    if (formData.waiverstatus_) {
      setAgreed(true);
    }
  }, [formData.waiverstatus_]);

  // Function to format date in "2nd day of November, 2025" format
  const formatDateForWaiver = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'long' });
    const year = date.getFullYear();

    // Add ordinal suffix
    const getOrdinalSuffix = (n: number): string => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinalSuffix(day)} day of ${month}, ${year}`;
  };

  // Function to get representative's full name
  const getRepresentativeFullName = (): string => {
    const { firstname_, middlename_, lastname_, suffixname_ } = formData;
    let fullName = firstname_ || '';

    if (middlename_) fullName += ` ${middlename_}`;
    if (lastname_) fullName += ` ${lastname_}`;
    if (suffixname_) fullName += ` ${suffixname_}`;

    return fullName.trim();
  };

  // Function to generate waiver content
  const generateWaiverContent = (): string => {
    const representativeName = getRepresentativeFullName();
    const currentDate = formatDateForWaiver(new Date());

    return `I, ${representativeName}, of legal age, and business registrant of City, undertake to comply with all statutory and regulatory requirements necessary to my license/permit application both on prerequisite and post inspection bases. I hereby authorize access to the premises of my establishment for city inspector/s to conduct the incidental/mandatory ocular inspection pursuant to law/ordinance.

Likewise, I declare under penalty of perjury, that all information declared in this application are true and correct to the best of my personal knowledge and hereby attest to the authenticity of all the attached documents. I also acknowledge that all personal data and account transaction information records with the City of may be processed, profiled or shared to requesting parties or for the purpose of any court, legal process examination/inquiry/investigation of any legal authority consistent and within the limits of the provisions of Data Privacy Act of 2012 and its Implementing Rules and Regulations.

Accordingly, I hereby recognize the right of the City of to issue suspension or revocation of my permit/license or execute foreclosure after due process in case of non-compliance on my part of any requirement, refusal to be inspected, and violation of pertinent law or any of the terms and conditions of my permit/license.

IN WITNESS WHEREOF, I have hereunto set my hand this ${currentDate} at City of, Iloilo, Philippines.`;
  };

  const handleAgreementChange = (checked: boolean) => {
    setAgreed(checked);
    updateField("agreedToTerms", checked);

    if (checked) {
      // When user agrees, automatically generate and update waiver data
      const representativeName = getRepresentativeFullName();
      const waiverContent = generateWaiverContent();

      // ✅ UPDATE WAIVER FIELDS IN DATABASE
      updateField("waiverstatus_", true);
      updateField("waivername_", representativeName);
      updateField("waivertype_", "Business Permit"); // Set to "Business Permit"
      updateField("content_", waiverContent);
      updateField("waiveragreement_", true);

      console.log('✅ Waiver data generated and saved to database:', {
        waivername_: representativeName,
        waivertype_: "Business Permit",
        waiverstatus_: true,
        content_: waiverContent
      });
    } else {
      // When user unchecks, reset waiver data
      updateField("waiverstatus_", false);
      updateField("waivername_", "");
      updateField("waivertype_", "");
      updateField("content_", "");
      updateField("waiveragreement_", false);
    }
  };

  const handleSubmit = async () => {
    if (!agreed) {
      Swal.fire({
        icon: 'warning',
        title: 'Agreement Required',
        text: 'You must agree to the terms and conditions before submitting your application.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      Swal.fire({
        title: isEditMode ? 'Updating Business...' : 'Submitting Application...',
        text: 'Please wait while we process your request.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let success = false;

      if (isEditMode && businessId) {
        console.log('🔄 UPDATE MODE - Updating business:', businessId);
        console.log('📤 Update data being sent:', {
          businessname_: formData.businessname_,
          businessId: businessId,
          waiverData: {
            waivername_: formData.waivername_,
            waivertype_: formData.waivertype_,
            waiverstatus_: formData.waiverstatus_,
            content_: formData.content_
          }
        });
        success = await updateForm(businessId);
      } else {
        console.log('🔄 CREATE MODE - Creating new business');
        console.log('📤 Create data being sent:', {
          businessname_: formData.businessname_,
          waiverData: {
            waivername_: formData.waivername_,
            waivertype_: formData.waivertype_,
            waiverstatus_: formData.waiverstatus_,
            content_: formData.content_
          }
        });
        success = await submitForm();
      }

      if (success) {
        Swal.fire({
          icon: 'success',
          title: isEditMode ? 'Updated Successfully!' : 'Submitted Successfully!',
          text: `Business ${formData.businessname_} has been ${isEditMode ? 'updated' : 'created'} successfully.`,
          confirmButtonColor: '#10b981',
        }).then(() => {
          navigate('/business-lists');
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error processing your request. Please try again.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  // Get current waiver content for display
  const currentWaiverContent = generateWaiverContent();

  return (
    <section className="w-full">
      <Card className="w-full">
        <CardContent className="p-4 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
              {isEditMode ? 'Update Summary' : 'Application Summary'}
            </CardTitle>
            <CardDescription className="text-base">
              {isEditMode
                ? `Review your changes before updating business: ${businessId}`
                : 'Review your information before submitting the application'}
            </CardDescription>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Business Information Summary */}
            <SummarySection title="Business Information" icon={<Building className="h-5 w-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <SummaryItem label="Business Name" value={formData.businessname_} />
                  <SummaryItem label="Ownership Type" value={formData.ownershiptype_} />
                  <SummaryItem label="Main Office" value={formData.ismain_} type="boolean" />
                  <SummaryItem label="Foreign Company" value={formData.isforeign_} type="boolean" />
                  <SummaryItem label="Date Established" value={formData.dateestablished_} type="date" />
                </div>
                <div className="space-y-3">
                  <SummaryItem label="Registered CEO" value={formData.registeredceo_} />
                  <SummaryItem label="Trade Name" value={formData.tradename_ || ''} />
                  <SummaryItem label="Is Franchise" value={formData.isfranchise_} type="boolean" />
                  <SummaryItem label="Building Space" value={formData.buildingspace_} />
                </div>
              </div>
            </SummarySection>

            {/* Address Information Summary */}
            <SummarySection title="Address Information" icon={<MapPin className="h-5 w-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <SummaryItem label="Province" value={formData.province_} />
                  <SummaryItem label="Municipality" value={formData.municipality_} />
                  <SummaryItem label="Barangay" value={formData.barangay_} />
                  <SummaryItem label="Street" value={formData.street_ || ''} />
                  <SummaryItem label="House Number" value={formData.houseno_ || ''} />
                </div>
                <div className="space-y-3">
                  <SummaryItem label="Subdivision" value={formData.subdivision_ || ''} />
                  <SummaryItem label="Building Name" value={formData.buildingname_ || ''} />
                  <SummaryItem label="Landmark" value={formData.landmark_} />
                  <SummaryItem label="Email" value={formData.email_} />
                  <SummaryItem label="TIN" value={formData.tin_ || ''} />
                </div>
              </div>
            </SummarySection>

            {/* Representative Information Summary */}
            <SummarySection title="Representative Information" icon={<Users className="h-5 w-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <SummaryItem label="Representative Name" value={formData.repname_} />
                  <SummaryItem label="Position" value={formData.repposition_} />
                  <SummaryItem label="First Name" value={formData.firstname_} />
                  <SummaryItem label="Last Name" value={formData.lastname_} />
                  <SummaryItem label="Birth Date" value={formData.birthdate_} type="date" />
                </div>
                <div className="space-y-3">
                  <SummaryItem label="Gender" value={formData.gender_} />
                  <SummaryItem label="Civil Status" value={formData.civilstatus_} />
                  <SummaryItem label="Nationality" value={formData.nationality_} />
                  <SummaryItem label="Email" value={formData.email_rep || ''} />
                  <SummaryItem label="Outside City" value={formData.outsidecity_} type="boolean" />
                </div>
              </div>
            </SummarySection>

            {/* Requirements Summary */}
            <SummarySection title="Business Requirements" icon={<FileText className="h-5 w-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground mb-3">Registration Numbers</h4>
                  <SummaryItem label="DTI No." value={formData.dtino_ || ''} />
                  <SummaryItem label="SEC No." value={formData.secno_ || ''} />
                  <SummaryItem label="CDA No." value={formData.cdano_ || ''} />
                  <SummaryItem label="SSS No." value={formData.sssno_ || ''} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground mb-3">Other Registrations</h4>
                  <SummaryItem label="Pag-IBIG No." value={formData.pagibigno_ || ''} />
                  <SummaryItem label="PhilHealth No." value={formData.phicno_ || ''} />
                  <SummaryItem label="BIR No." value={formData.boino_ || ''} />
                  <SummaryItem label="PEZA Registered" value={formData.pezaregistered_ || false} type="boolean" />
                </div>
              </div>
            </SummarySection>

            {/* Waiver Information Summary */}
            {agreed && (
              <SummarySection title="Waiver Information" icon={<CheckCircle className="h-5 w-5" />}>
                <div className="space-y-3">
                  <SummaryItem label=" Name" value={formData.waivername_ || ''} />
                  <SummaryItem label=" Type" value={formData.waivertype_ || ''} />
                  {/* <SummaryItem label="Waiver Status" value={formData.waiverstatus_ || false} type="boolean" /> */}
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Waiver:</h4>
                    <p className="text-sm whitespace-pre-line">{formData.content_ || currentWaiverContent}</p>
                  </div>
                </div>
              </SummarySection>
            )}

            {/* Declaration Section */}
            <Card className="bg-secondary/10 border-secondary/20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <CardTitle className="text-lg font-semibold mb-4 text-center">
                    DECLARATION AND AGREEMENT
                  </CardTitle>

                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <div className="whitespace-pre-line bg-background p-4 rounded border">
                      {currentWaiverContent}
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start space-x-3 bg-background p-4 rounded-lg border">
                  <Checkbox
                    id="agreement"
                    checked={agreed}
                    onCheckedChange={handleAgreementChange}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="agreement" className="text-sm font-semibold cursor-pointer block">
                      I AGREE TO THE TERMS AND CONDITIONS STATED ABOVE
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      By checking this box, I certify that I have read, understood, and agree to be bound by all the terms and conditions stated in this declaration. This will automatically generate and sign the waiver agreement and update the waiver status in the database.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Verification */}
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-green-600 h-6 w-6" />
                    <div>
                      <CardTitle className="text-base font-semibold">Ready to {isEditMode ? 'Update' : 'Submit'}</CardTitle>
                      <CardDescription>All sections have been completed and reviewed</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Completion Status</p>
                    <p className="text-lg font-bold text-green-600">100% Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t gap-4">
            <Button
              variant="primary"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto px-8 py-3"
            >
              ← Back to Review
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto px-8 py-3"
                onClick={() => navigate('/business-lists')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!agreed || isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditMode ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Update Business' : 'Submit Application'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>100% Complete</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          {!agreed && (
            <Alert className="mt-4">
              <AlertDescription>
                You must agree to the terms and conditions before {isEditMode ? 'updating' : 'submitting'} your application.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default Summary;