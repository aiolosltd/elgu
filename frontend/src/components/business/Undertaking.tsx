// src/components/forms/Summary.tsx
import React from 'react';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/atoms/input/checkbox';
import { useForm } from '@/context/FormContext';
import { FileText, Building, Users, MapPin, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

interface SummaryProps {
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  onSubmit: () => void;
}

// Section wrapper for better organization
const SummarySection: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
    <div className="flex items-center mb-4">
      {icon && <div className="mr-3 text-blue-600">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

// Summary Item Component
const SummaryItem: React.FC<{
  label: string;
  value: string | number | boolean;
  type?: 'text' | 'date' | 'boolean';
}> = ({ label, value, type = 'text' }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">
      {type === 'boolean' ? (value ? 'Yes' : 'No') : 
       type === 'date' ? (value ? new Date(value as string).toLocaleDateString() : 'Not provided') :
       value || 'Not provided'}
    </span>
  </div>
);

const Summary: React.FC<SummaryProps> = ({ prevStep, currentStep, totalSteps, onSubmit }) => {
  const { formData, updateField } = useForm();
  const [agreed, setAgreed] = React.useState(false);
  const navigate = useNavigate();

  const handleAgreementChange = (checked: boolean) => {
    setAgreed(checked);
    updateField('agreedToTerms', checked);
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
      // Show loading state
      Swal.fire({
        title: 'Submitting Application...',
        text: 'Please wait while we process your application.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulate API call - replace with actual submission logic
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Application Submitted Successfully!',
        text: 'Your business registration application has been submitted and is now under review.',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'View Business List',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to business lists page
          navigate('/business-lists');
        }
      });

      // Call the parent onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      }

    } catch (error) {
      // Log error for debugging/telemetry and continue with user-facing error handling
      console.error(error);
      // Error handling
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error submitting your application. Please try again.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Application Summary
        </h2>
        <p className="text-gray-600">
          Review your information before submitting the application
        </p>
      </div>

      <div className="space-y-8">
        {/* Taxpayer Information Summary */}
        <SummarySection 
          title="Taxpayer Information" 
          icon={<Users size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <SummaryItem label="Registrant Name" value={formData.registrantName} />
              <SummaryItem label="First Name" value={formData.firstName} />
              <SummaryItem label="Last Name" value={formData.lastName} />
              <SummaryItem label="Birth Date" value={formData.birthDate} type="date" />
              <SummaryItem label="Gender" value={formData.gender} />
            </div>
            <div className="space-y-3">
              <SummaryItem label="Email" value={formData.email} />
              <SummaryItem label="Phone" value={formData.phone} />
              <SummaryItem label="TIN" value={formData.tin} />
              <SummaryItem label="Civil Status" value={formData.civilStatus} />
            </div>
          </div>
        </SummarySection>

        {/* Business Information Summary */}
        <SummarySection 
          title="Business Information" 
          icon={<Building size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <SummaryItem label="Business Name" value={formData.businessName} />
              <SummaryItem label="Business Type" value={formData.businessType} />
              <SummaryItem label="DTI No." value={formData.dtiNo} />
              <SummaryItem label="SEC Registration No." value={formData.secRegistrationNo} />
              <SummaryItem label="Branch" value={formData.branch} type="boolean" />
            </div>
            <div className="space-y-3">
              <SummaryItem label="President Name" value={formData.presidentName} />
              <SummaryItem label="Date Established" value={formData.dateEstablished} type="date" />
              <SummaryItem label="Commercial Building" value={formData.commercialBuilding} type="boolean" />
              <SummaryItem label="Trade Name" value={formData.tradeName} type="boolean" />
            </div>
          </div>
        </SummarySection>

        {/* Address Information Summary */}
        <SummarySection 
          title="Address Information" 
          icon={<MapPin size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <SummaryItem label="Province" value={formData.provinceName} />
              <SummaryItem label="City/Municipality" value={formData.cityMunicipality} />
              <SummaryItem label="Barangay" value={formData.barangayName} />
              <SummaryItem label="Street" value={formData.street} />
              <SummaryItem label="House Number" value={formData.houseNumber} />
            </div>
            <div className="space-y-3">
              <SummaryItem label="Subdivision" value={formData.subdivision} />
              <SummaryItem label="Building Name" value={formData.buildingName} />
              <SummaryItem label="Landmark" value={formData.landmark} />
              <SummaryItem label="Google Map Address" value={formData.googleMapAddress} />
            </div>
          </div>
        </SummarySection>

        {/* Registration Details Summary */}
        <SummarySection 
          title="Registration Details" 
          icon={<FileText size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">Registration Numbers</h4>
              <SummaryItem label="CDA No." value={formData.cdaNo} />
              <SummaryItem label="SSS No." value={formData.sssNo} />
              <SummaryItem label="Pag-Rog No." value={formData.pagRogNo} />
              <SummaryItem label="PHCP No." value={formData.phcpNo} />
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">Community Tax Certificate</h4>
              <SummaryItem label="Certificate No." value={formData.communityTaxCertNo} />
              <SummaryItem label="Place of Issue" value={formData.communityTaxPlace} />
              <SummaryItem label="Issued Date" value={formData.communityTaxIssuedDate} type="date" />
              <SummaryItem label="Amount" value={formData.communityTaxAmount} />
            </div>
          </div>
        </SummarySection>

        {/* Requirements Summary */}
        {formData.requirements && formData.requirements.length > 0 && (
          <SummarySection 
            title="Uploaded Requirements" 
            icon={<FileText size={20} />}
          >
            <div className="space-y-3">
              {formData.requirements.map((req) => (
                <div key={req.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium text-gray-700">{req.type}</span>
                    <p className="text-sm text-gray-600">{req.description}</p>
                    {req.fileName && (
                      <p className="text-xs text-green-600">File: {req.fileName}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'Uploaded' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </SummarySection>
        )}

        {/* Declaration Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              DECLARATION AND AGREEMENT
            </h3>
            
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Liability of legal age, and business registered of Arlopolo City,</strong> undertake to comply with all statutory and regulatory requirements necessary to my former/grant application both on prerequisite and post inspection bases. I hereby authorise access to the premises of my establishment for city inspectors to conduct the incidental/translation/ ocular inspection pursuant to law/ordinance.
                </span>
              </p>
              
              <p className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Likewise, I declare under penalty of perjury, that all information declared in this application are true and correct to the best of my personal knowledge and hereby state to the authenticity of all the attached documents. I also acknowledge that all personal data and account transactions information records with the City of Arlopolo may be processed, profited or shared to requesting parties or for the purpose of any court, legal process examination/notary/investigation of any legal authority consistent and within the limits of the provisions of Data Privacy Act of 2012 and its Implementing Rules and Regulations.
                </span>
              </p>
              
              <p className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Accordingly, I hereby recognize the right of the City of Arlopolo to issue suspension or revocation of my permit/demare or execute foreclosure after due process in case of non-compliance on my part of any requirement, refusal to be inspected, and violation of pertinent law or any of the terms and conditions of my permit/demare.
                </span>
              </p>
              
              <div className="text-center mt-6 pt-4 border-t border-blue-200">
                <p className="font-semibold text-gray-800">
                  IN WITNESS WHEREOF, I have hereunto set my hand into 16th day of October, 2023 as City of Arlopolo, Philippines.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-200">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={handleAgreementChange}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="agreement" className="text-sm font-semibold text-gray-800 cursor-pointer block">
                I AGREE TO THE TERMS AND CONDITIONS STATED ABOVE
              </label>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, I certify that I have read, understood, and agree to be bound by all the terms and conditions stated in this declaration.
              </p>
            </div>
          </div>
        </div>

        {/* Final Verification */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-800">Ready to Submit</h4>
                <p className="text-sm text-gray-600">All sections have been completed and reviewed</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Completion Status</p>
              <p className="text-lg font-bold text-green-600">100% Complete</p>
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
          ← Back to Review
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto px-8 py-3"
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!agreed}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <CheckCircle size={18} className="mr-2" />
            Submit Application
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>100% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>

      {/* Warning Message */}
      {!agreed && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 flex items-center">
            ⚠️ You must agree to the terms and conditions before submitting your application.
          </p>
        </div>
      )}
    </section>
  );
};

export default Summary;