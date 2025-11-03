import React, { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/ui/input';
import { LabeledInput } from '@/components/molecules/labeledInput'
import { useForm } from '@/context/FormContext';
import { Upload, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface BusinessOperationProps {
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

const BusinessOperation: React.FC<BusinessOperationProps> = ({
  nextStep,
  prevStep,
  currentStep,
  totalSteps
}) => {
  const {
    formData,
    updateField,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    uploadDocument,
    viewDocument
  } = useForm();

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [requirementType, setRequirementType] = useState('');
  const [requirementDescription, setRequirementDescription] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.id, e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);

      // Auto-fill requirement type and description based on file name
      const fileName = file.name.toLowerCase();

      // Business Registration Documents
      if (fileName.includes('dti') || fileName.includes('business') || fileName.includes('registration')) {
        setRequirementType('DTI Certificate');
        setRequirementDescription('Department of Trade and Industry Business Name Registration');
      }
      else if (fileName.includes('sec') || fileName.includes('corporation') || fileName.includes('articles')) {
        setRequirementType('SEC Registration');
        setRequirementDescription('Securities and Exchange Commission Certificate of Registration');
      }
      else if (fileName.includes('cda') || fileName.includes('cooperative')) {
        setRequirementType('CDA Registration');
        setRequirementDescription('Cooperative Development Authority Certificate of Registration');
      }

      // BIR Documents
      else if (fileName.includes('bir') || fileName.includes('2303') || fileName.includes('certificate of registration')) {
        setRequirementType('BIR Registration');
        setRequirementDescription('BIR Certificate of Registration (Form 2303)');
      }
      else if (fileName.includes('bir') && fileName.includes('permit')) {
        setRequirementType('BIR Permit');
        setRequirementDescription('BIR Authority to Print Receipts/Invoices');
      }

      // Local Government Documents
      else if (fileName.includes('barangay') || fileName.includes('clearance')) {
        setRequirementType('Barangay Clearance');
        setRequirementDescription('Barangay Business Clearance');
      }
      else if (fileName.includes('mayor') || fileName.includes('business permit') || fileName.includes('municipal')) {
        setRequirementType('Mayor\'s Permit');
        setRequirementDescription('Business Permit from Mayor\'s Office');
      }
      else if (fileName.includes('zoning') || fileName.includes('locational')) {
        setRequirementType('Zoning Clearance');
        setRequirementDescription('Zoning/Locational Clearance');
      }

      // Social Security Documents
      else if (fileName.includes('sss')) {
        setRequirementType('SSS Registration');
        setRequirementDescription('Social Security System Certificate of Registration');
      }
      else if (fileName.includes('pagibig') || fileName.includes('hdmf')) {
        setRequirementType('Pag-IBIG Registration');
        setRequirementDescription('Pag-IBIG Fund Certificate of Registration');
      }
      else if (fileName.includes('philhealth') || fileName.includes('phic')) {
        setRequirementType('PhilHealth Registration');
        setRequirementDescription('Philippine Health Insurance Corporation Registration');
      }

      // Other Regulatory Documents
      else if (fileName.includes('fire') || fileName.includes('safety') || fileName.includes('fsic')) {
        setRequirementType('Fire Safety Certificate');
        setRequirementDescription('Fire Safety Inspection Certificate');
      }
      else if (fileName.includes('sanitary') || fileName.includes('health')) {
        setRequirementType('Sanitary Permit');
        setRequirementDescription('Sanitary Permit from Health Office');
      }
      else if (fileName.includes('environment') || fileName.includes('ecc')) {
        setRequirementType('Environmental Compliance');
        setRequirementDescription('Environmental Compliance Certificate');
      }

      // Supporting Documents
      else if (fileName.includes('cedula') || fileName.includes('community tax')) {
        setRequirementType('Community Tax Certificate');
        setRequirementDescription('Community Tax Certificate (Cedula)');
      }
      else if (fileName.includes('lease') || fileName.includes('contract') || fileName.includes('rental')) {
        setRequirementType('Lease Contract');
        setRequirementDescription('Lease Agreement or Contract of the Business Location');
      }
      else if (fileName.includes('id') || fileName.includes('identification') ||
        fileName.includes('passport') || fileName.includes('driver') ||
        fileName.includes('umid') || fileName.includes('postal')) {
        setRequirementType('Valid ID');
        setRequirementDescription('Valid Government-Issued Identification Document');
      }
      else if (fileName.includes('photo') || fileName.includes('picture')) {
        setRequirementType('Business Photo');
        setRequirementDescription('Photo of Business Establishment');
      }

      // Special Economic Zones
      else if (fileName.includes('peza')) {
        setRequirementType('PEZA Registration');
        setRequirementDescription('Philippine Economic Zone Authority Registration');
      }
      else if (fileName.includes('boi') || fileName.includes('board of investment')) {
        setRequirementType('BOI Registration');
        setRequirementDescription('Board of Investments Registration');
      }

      // Default fallback
      else {
        setRequirementType('Business Document');
        setRequirementDescription('Business Registration Document');
      }
    }
  };

  const handleAddRequirement = async () => {
    if (!requirementType || !requirementDescription || !uploadFile) {
      alert('Please fill in requirement type, description, and upload a file');
      return;
    }

    // Just store the requirement and file - no immediate upload
    const newRequirement = {
      id: Date.now().toString(),
      type: requirementType,
      description: requirementDescription,
      status: 'Pending Upload', // Changed from 'Uploaded'
      fileName: uploadFile.name,
      file: uploadFile
    };

    addRequirement(newRequirement);

    // Store the document for later upload
    await uploadDocument(uploadFile, requirementType, requirementDescription);

    // Reset form
    setRequirementType('');
    setRequirementDescription('');
    setUploadFile(null);

    // Reset file input
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDeleteRequirement = (id: string) => {
    if (confirm('Are you sure you want to delete this requirement?')) {
      deleteRequirement(id);
    }
  };

  const handleViewRequirement = (requirement: any) => {
    // Find corresponding document in the documents array
    const document = formData.documents.find(doc =>
      doc.filename_ === requirement.fileName || doc.type_ === requirement.type
    );

    if (document) {
      viewDocument(document);
    } else if (requirement.file) {
      // If file exists locally but not uploaded yet, create object URL
      const fileUrl = URL.createObjectURL(requirement.file);
      window.open(fileUrl, '_blank');
    } else {
      alert('No file available for this requirement');
    }
  };

  const handleRequirementFileUpload = async (requirementId: string, file: File) => {
    const requirement = formData.requirements.find(req => req.id === requirementId);
    if (!requirement) return;

    // Just store the file - no immediate upload
    updateRequirement(requirementId, {
      fileName: file.name,
      file: file,
      status: 'Pending Upload' // Changed from 'Uploaded'
    });

    // Store the document for later upload
    await uploadDocument(file, requirement.type, requirement.description);
  };

  const handleRequirementTypeChange = (requirementId: string, newType: string) => {
    updateRequirement(requirementId, { type: newType });
  };

  const handleRequirementDescriptionChange = (requirementId: string, newDescription: string) => {
    updateRequirement(requirementId, { description: newDescription });
  };

  // Use formData.requirements from context
  const requirements = formData.requirements;

  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <section className="w-full">
      <Card className="w-full">
        <CardContent className="p-4 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
              Business Registration Details
            </CardTitle>
            <CardDescription className="text-base">
              Provide business registration and document information
            </CardDescription>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* DTI and SEC Section */}
            <FormSection title="Business Registration">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LabeledInput
                  label="DTI No."
                  id="dtino_"
                  value={formData.dtino_ || ''}
                  onChange={handleChange}
                  placeholder="Enter DTI number"
                />

                <LabeledInput
                  label="Issued Date"
                  id="dtiissued_"
                  value={formData.dtiissued_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="Expiration Date"
                  id="dtiexpiry_"
                  value={formData.dtiexpiry_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="SEC Registration No."
                  id="secno_"
                  value={formData.secno_ || ''}
                  onChange={handleChange}
                  placeholder="Enter SEC number"
                />

                <LabeledInput
                  label="Issued Date"
                  id="secissued_"
                  value={formData.secissued_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="Expiration Date"
                  id="secexpiry_"
                  value={formData.secexpiry_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="CDA No."
                  id="cdano_"
                  value={formData.cdano_ || ''}
                  onChange={handleChange}
                  placeholder="Enter CDA number"
                />

                <LabeledInput
                  label="Issued Date"
                  id="cdaissued_"
                  value={formData.cdaissued_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="Expiration Date"
                  id="cdaexpiry_"
                  value={formData.cdaexpiry_ || ''}
                  onChange={handleChange}
                  type="date"
                />
              </div>
            </FormSection>

            {/* Local Clearance Section */}
            <FormSection title="Local Clearance" columns={2}>
              <LabeledInput
                label="Local Clearance"
                id="localclearanceno_"
                value={formData.localclearanceno_ || ''}
                onChange={handleChange}
                placeholder="Enter local clearance"
              />

              <LabeledInput
                label="Date"
                id="localclearancedate_"
                value={formData.localclearancedate_ || ''}
                onChange={handleChange}
                type="date"
              />
            </FormSection>

            {/* Community Tax Certificate Section */}
            <FormSection title="Community Tax Certificate">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LabeledInput
                  label="Community Tax Cert No."
                  id="cedulano_"
                  value={formData.cedulano_ || ''}
                  onChange={handleChange}
                  placeholder="Enter certificate number"
                />

                <LabeledInput
                  label="Place of issue"
                  id="cedulaplaceissued_"
                  value={formData.cedulaplaceissued_ || ''}
                  onChange={handleChange}
                  placeholder="Enter place of issue"
                />

                <LabeledInput
                  label="Issued Date"
                  id="cedulaissued_"
                  value={formData.cedulaissued_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="Amount"
                  id="cedulaamount_"
                  value={formData.cedulaamount_ || ''}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  type="number"
                />
              </div>
            </FormSection>

            {/* Additional Registrations Section */}
            <FormSection title="Additional Registrations">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LabeledInput
                  label="B.O.I No."
                  id="boino_"
                  value={formData.boino_ || ''}
                  onChange={handleChange}
                  placeholder="Enter B.O.I number"
                />

                <LabeledInput
                  label="Issued Date"
                  id="boiissued_"
                  value={formData.boiissued_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="Expiration Date"
                  id="boiexpiry_"
                  value={formData.boiexpiry_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="Peza Registration No."
                  id="pezaregno_"
                  value={formData.pezaregno_ || ''}
                  onChange={handleChange}
                  placeholder="Enter Peza number"
                />

                <LabeledInput
                  label="Date Registered"
                  id="pezaissued_"
                  value={formData.pezaissued_ || ''}
                  onChange={handleChange}
                  type="date"
                />

                <LabeledInput
                  label="Expiration Date"
                  id="pezaexpiry_"
                  value={formData.pezaexpiry_ || ''}
                  onChange={handleChange}
                  type="date"
                />
              </div>
            </FormSection>

            {/* Additional Registration Numbers */}
            <FormSection title="Government Numbers" columns={2}>
              <LabeledInput
                label="SSS No."
                id="sssno_"
                value={formData.sssno_ || ''}
                onChange={handleChange}
                placeholder="Enter SSS number"
              />

              <LabeledInput
                label="Date Registered"
                id="sssdatereg_"
                value={formData.sssdatereg_ || ''}
                onChange={handleChange}
                type="date"
              />

              <LabeledInput
                label="Pag Ibig No."
                id="pagibigno_"
                value={formData.pagibigno_ || ''}
                onChange={handleChange}
                placeholder="Enter Pag Ibig number"
              />

              <LabeledInput
                label="Date Registered"
                id="pagibigreg_"
                value={formData.pagibigreg_ || ''}
                onChange={handleChange}
                type="date"
              />

              <LabeledInput
                label="PHCP No."
                id="phicno_"
                value={formData.phicno_ || ''}
                onChange={handleChange}
                placeholder="Enter PHCP number"
              />

              <LabeledInput
                label="Date Registered"
                id="phicreg_"
                value={formData.phicreg_ || ''}
                onChange={handleChange}
                type="date"
              />
            </FormSection>

            {/* Document Management Section */}
            <FormSection title="Document Management">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                    <div>
                      <LabeledInput
                        label="Requirement Type"
                        id="requirementType"
                        value={requirementType}
                        onChange={(e) => setRequirementType(e.target.value)}
                        placeholder="e.g., DTI Certificate, BIR Registration, etc."
                      />
                    </div>

                    <div>
                      <LabeledInput
                        label="Description"
                        id="requirementDescription"
                        value={requirementDescription}
                        onChange={(e) => setRequirementDescription(e.target.value)}
                        placeholder="e.g., DTI Business Name Registration"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold">
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
                          variant="primary"
                          onClick={() => document.getElementById('fileUpload')?.click()}
                          className="flex items-center gap-2 flex-1"
                        >
                          <Upload className="h-4 w-4" />
                          {uploadFile ? uploadFile.name : 'Choose File'}
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleAddRequirement}
                          disabled={!requirementType || !requirementDescription || !uploadFile}
                        >
                          Add to List
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Upload Status */}
                  {formData.documents.length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-blue-800">Documents Ready for Upload</h4>
                          <p className="text-sm text-blue-600">
                            {formData.documents.length} document(s) will be uploaded when you submit the form
                          </p>
                        </div>
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          Ready
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FormSection>

            {/* Requirements Section */}
            <FormSection title="List of Requirements">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-md font-semibold">Document Requirements</CardTitle>
                  <CardDescription>
                    Manage all your business document requirements. Files will be uploaded when you submit the form.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Requirement Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>File Name</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requirements.map((req, index) => (
                          <TableRow key={req.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                            <TableCell>
                              <Input
                                value={req.type}
                                onChange={(e) => handleRequirementTypeChange(req.id, e.target.value)}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Enter requirement type"
                              />
                            </TableCell>

                            <TableCell>
                              <Input
                                value={req.description}
                                onChange={(e) => handleRequirementDescriptionChange(req.id, e.target.value)}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Enter description"
                              />
                            </TableCell>

                            <TableCell>
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  id={`file-${req.id}`}
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleRequirementFileUpload(req.id, file);
                                    }
                                  }}
                                />
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => document.getElementById(`file-${req.id}`)?.click()}
                                  className="flex items-center gap-1"
                                >
                                  <Upload className="h-4 w-4" />
                                  Upload
                                </Button>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant={req.status === 'Uploaded' ? 'default' : 'secondary'}
                                className={
                                  req.status === 'Uploaded'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                }
                              >
                                {req.status}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-sm">
                              {req.fileName || 'No file'}
                            </TableCell>

                            <TableCell className="text-sm">
                              {new Date().toLocaleDateString()}
                            </TableCell>

                            <TableCell className="text-sm">
                              {req.file ? 'File attached' : 'No file'}
                            </TableCell>

                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewRequirement(req)}
                                  disabled={!req.file && !formData.documents.some(doc => doc.type_ === req.type)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteRequirement(req.id)}
                                  className="flex items-center gap-1 text-white"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Empty State */}
                  {requirements.length === 0 && (
                    <div className="text-center py-8">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Requirements Added</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by adding your first document requirement above.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
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

export default BusinessOperation;