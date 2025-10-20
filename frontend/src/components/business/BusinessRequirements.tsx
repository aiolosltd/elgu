// src/components/forms/BusinessOperation.tsx
import React, { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { RadioGroup } from '@/components/atoms/input/radio';
import { useForm } from '@/context/FormContext';
import { Upload, Search, Trash2, Eye } from 'lucide-react';

interface BusinessOperationProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

interface Requirement {
  id: string;
  type: string;
  description: string;
  status: string;
  fileName?: string;
  file?: File;
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
  type = 'text', 
  required = false 
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
    <div className={cn(
      "grid gap-4",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-3",
      columns === 4 && "grid-cols-1 md:grid-cols-4"
    )}>
      {children}
    </div>
  </div>
);

const BusinessOperation: React.FC<BusinessOperationProps> = ({ 
  nextStep, 
  prevStep, 
  currentStep, 
  totalSteps 
}) => {
  const { formData, updateField } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [requirementType, setRequirementType] = useState('');
  const [requirementDescription, setRequirementDescription] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleRadioChange = (field: string, value: string) => {
    updateField(field, value);
  };

  // Initialize requirements if not exists
  const requirements: Requirement[] = formData.requirements || [
    { id: '1', type: 'Business Terms', description: 'Business Terms', status: 'Pending' },
    { id: '2', type: 'Community Tax Certification', description: 'Community Tax Certification', status: 'Pending' },
    { id: '3', type: 'DTI', description: 'DTI', status: 'Pending' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      
      // Auto-fill requirement type and description based on file name
      const fileName = file.name.toLowerCase();
      if (fileName.includes('business') || fileName.includes('terms')) {
        setRequirementType('Business Terms');
        setRequirementDescription('Business Terms');
      } else if (fileName.includes('tax') || fileName.includes('community')) {
        setRequirementType('Community Tax Certification');
        setRequirementDescription('Community Tax Certification');
      } else if (fileName.includes('dti')) {
        setRequirementType('DTI');
        setRequirementDescription('DTI');
      }
    }
  };

  const handleAddRequirement = () => {
    if (!requirementType || !requirementDescription || !uploadFile) {
      alert('Please fill in requirement type, description, and upload a file');
      return;
    }

    const newRequirement: Requirement = {
      id: Date.now().toString(),
      type: requirementType,
      description: requirementDescription,
      status: 'Uploaded',
      fileName: uploadFile.name,
      file: uploadFile
    };

    const updatedRequirements = [...requirements, newRequirement];
    updateField('requirements', updatedRequirements);
    
    // Reset form
    setRequirementType('');
    setRequirementDescription('');
    setUploadFile(null);
    
    // Reset file input
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDeleteRequirement = (id: string) => {
    const updatedRequirements = requirements.filter(req => req.id !== id);
    updateField('requirements', updatedRequirements);
  };

  const handleViewRequirement = (requirement: Requirement) => {
    if (requirement.file) {
      // Create object URL for viewing the file
      const fileUrl = URL.createObjectURL(requirement.file);
      window.open(fileUrl, '_blank');
    } else {
      alert('No file available for this requirement');
    }
  };

  const filteredRequirements = requirements.filter(req =>
    req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Business Registration Details
        </h2>
        <p className="text-gray-600">
          Provide business registration and document information
        </p>
      </div>

      <div className="space-y-8">
        {/* DTI and SEC Section */}
        <FormSection title="Business Registration" columns={4}>
          <LabeledInput
            label="DTI No."
            id="dtiNo"
            value={formData.dtiNo}
            onChange={handleChange}
            placeholder="Enter DTI number"
          />
          <LabeledInput
            label="SEC Registration No."
            id="secRegistrationNo"
            value={formData.secRegistrationNo}
            onChange={handleChange}
            placeholder="Enter SEC number"
          />
          <LabeledInput
            label="Issued Date"
            id="dtiIssuedDate"
            value={formData.dtiIssuedDate}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Expiration Date"
            id="dtiExpirationDate"
            value={formData.dtiExpirationDate}
            onChange={handleChange}
            type="date"
          />
        </FormSection>

        {/* CDA Section */}
        <FormSection title="CDA Registration" columns={4}>
          <LabeledInput
            label="CDA No."
            id="cdaNo"
            value={formData.cdaNo}
            onChange={handleChange}
            placeholder="Enter CDA number"
          />
          <LabeledInput
            label="Issued Date"
            id="cdaIssuedDate"
            value={formData.cdaIssuedDate}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Expiration Date"
            id="cdaExpirationDate"
            value={formData.cdaExpirationDate}
            onChange={handleChange}
            type="date"
          />
          <div></div> {/* Empty cell for alignment */}
        </FormSection>

        {/* Local Clearance Section */}
        <FormSection title="Local Clearance" columns={2}>
          <LabeledInput
            label="Local Clearance"
            id="localClearance"
            value={formData.localClearance}
            onChange={handleChange}
            placeholder="Enter local clearance"
          />
          <LabeledInput
            label="Date"
            id="localClearanceDate"
            value={formData.localClearanceDate}
            onChange={handleChange}
            type="date"
          />
        </FormSection>

        {/* Community Tax Certificate Section */}
        <FormSection title="Community Tax Certificate" columns={4}>
          <LabeledInput
            label="Community Tax Cert No."
            id="communityTaxCertNo"
            value={formData.communityTaxCertNo}
            onChange={handleChange}
            placeholder="Enter certificate number"
          />
          <LabeledInput
            label="Place of issue"
            id="communityTaxPlace"
            value={formData.communityTaxPlace}
            onChange={handleChange}
            placeholder="Enter place of issue"
          />
          <LabeledInput
            label="Issued Date"
            id="communityTaxIssuedDate"
            value={formData.communityTaxIssuedDate}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Amount"
            id="communityTaxAmount"
            value={formData.communityTaxAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            type="number"
          />
        </FormSection>

        {/* Community Tax Question */}
        <FormSection title="Community Tax Certificate" columns={1}>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="text-sm font-semibold text-gray-800 mb-3 block">
              Do you have an existing Community Tax Certificate?
            </label>
            <RadioGroup
              name="hasCommunityTaxCert"
              options={[
                { label: "Yes", value: "yes" }
              ]}
              selectedValue={formData.hasCommunityTaxCert}
              onChange={(value) => handleRadioChange('hasCommunityTaxCert', value)}
              layout="horizontal"
            />
          </div>
        </FormSection>

        {/* Requirements Search and Upload Section */}
        <FormSection title="Document Management" columns={1}>
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            {/* Search Section */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Search Requirements
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search requirement type or description..."
                    variant="rounded"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <LabeledInput
                  label="Requirement Type"
                  id="requirementType"
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value)}
                  placeholder="e.g., Business Terms"
                />
              </div>
              <div>
                <LabeledInput
                  label="Description"
                  id="requirementDescription"
                  value={requirementDescription}
                  onChange={(e) => setRequirementDescription(e.target.value)}
                  placeholder="e.g., Business Terms"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-800">
                  Upload Document
                </label>
                <div className="flex gap-2">
                  <input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('fileUpload')?.click()}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Upload size={18} />
                    {uploadFile ? uploadFile.name : 'Choose File'}
                  </Button>
                  <Button
                    onClick={handleAddRequirement}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add to List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Requirements Section */}
        <FormSection title="List of Requirements" columns={1}>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-md font-semibold text-gray-800">Document Description</h4>
            </div>
            
            {/* Requirements Table */}
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
                      Action
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      Status
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      File Name
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      Upload Date
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      Details
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequirements.map((req, index) => (
                    <tr key={req.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-3">
                        <Input
                          value={req.type}
                          onChange={(e) => {
                            const updatedRequirements = requirements.map(r => 
                              r.id === req.id ? { ...r, type: e.target.value } : r
                            );
                            updateField('requirements', updatedRequirements);
                          }}
                          variant="underline"
                          className="border-0 focus:ring-0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <Input
                          value={req.description}
                          onChange={(e) => {
                            const updatedRequirements = requirements.map(r => 
                              r.id === req.id ? { ...r, description: e.target.value } : r
                            );
                            updateField('requirements', updatedRequirements);
                          }}
                          variant="underline"
                          className="border-0 focus:ring-0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id={`file-${req.id}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const updatedRequirements = requirements.map(r => 
                                  r.id === req.id ? { 
                                    ...r, 
                                    fileName: file.name, 
                                    file: file,
                                    status: 'Uploaded'
                                  } : r
                                );
                                updateField('requirements', updatedRequirements);
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-${req.id}`)?.click()}
                            className="flex items-center gap-1"
                          >
                            <Upload size={14} />
                            Upload
                          </Button>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === 'Uploaded' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {req.fileName || 'No file'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {req.file ? 'File attached' : 'No file'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRequirement(req)}
                            disabled={!req.file}
                            className="flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRequirement(req.id)}
                            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FormSection>

        {/* Additional Registration Numbers */}
        <FormSection title="Additional Registrations" columns={2}>
          <LabeledInput
            label="B.D1 No."
            id="bd1No"
            value={formData.bd1No}
            onChange={handleChange}
            placeholder="Enter B.D1 number"
          />
          <LabeledInput
            label="SSS No."
            id="sssNo"
            value={formData.sssNo}
            onChange={handleChange}
            placeholder="Enter SSS number"
          />
          <LabeledInput
            label="Pag-Rog No."
            id="pagRogNo"
            value={formData.pagRogNo}
            onChange={handleChange}
            placeholder="Enter Pag-Rog number"
          />
          <LabeledInput
            label="PHCP No."
            id="phcpNo"
            value={formData.phcpNo}
            onChange={handleChange}
            placeholder="Enter PHCP number"
          />
          <LabeledInput
            label="CT-K2x Registration No."
            id="ctk2xNo"
            value={formData.ctk2xNo}
            onChange={handleChange}
            placeholder="Enter CT-K2x number"
          />
        </FormSection>

        {/* Dates Section */}
        <FormSection title="Registration Dates" columns={4}>
          <LabeledInput
            label="Issued Date"
            id="bd1IssuedDate"
            value={formData.bd1IssuedDate}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Date Registered"
            id="sssDateRegistered"
            value={formData.sssDateRegistered}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Date Registered"
            id="pagRogDateRegistered"
            value={formData.pagRogDateRegistered}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Date Registered"
            id="phcpDateRegistered"
            value={formData.phcpDateRegistered}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Date Registered"
            id="ctk2xDateRegistered"
            value={formData.ctk2xDateRegistered}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Expiration Date"
            id="bd1ExpirationDate"
            value={formData.bd1ExpirationDate}
            onChange={handleChange}
            type="date"
          />
          <LabeledInput
            label="Expiration Date"
            id="sssExpirationDate"
            value={formData.sssExpirationDate}
            onChange={handleChange}
            type="date"
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

export default BusinessOperation;