import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import Swal from 'sweetalert2';
import api from '@/services/api';

// Document Interface
interface Document {
  id: string;
  type_: string;
  desc_: string;
  businessId_: string;
  userid_: string;
  path_: string;
  filename_: string;
  status_: number; // 0 = pending, 1 = uploaded, 2 = failed
  datetimestamp_: string;
  file?: File;
}

interface Requirement {
  id: string;
  type: string;
  description: string;
  status: string;
  fileName?: string;
  file?: File;
}

interface FormData {
  // ========== MAIN BUSINESS INFO ==========
  businessname_: string;
  ismain_: boolean;
  isforeign_: boolean;
  isbranch_: boolean;
  dateestablished_: string;
  ownershiptype_: string;
  registeredceo_: string;
  tradename_: string;
  isfranchise_: boolean;
  ismarketstall: boolean;
  iscommercialbuilding: boolean;
  marketstall_: string;
  businessbuildingid_: string;
  buildingspace_: string;
  waiveragreement_: boolean;

  // ========== BUSINESS ADDRESS INFO ==========
  province_: string;
  municipality_: string;
  barangay_: string;
  subdivision_: string;
  street_: string;
  buildingname_: string;
  houseno_: string;
  phaseblock_: string;
  lot_: string;
  landmark_: string;
  longlat_: string;
  telno_: string;
  cellno_: string;
  faxno_: string;
  email_: string;
  tin_: string;

  // ========== BUSINESS REPRESENTATIVE INFO ==========
  repid: string;
  repname_: string;
  repposition_: string;
  ownershiptype_rep: string;
  firstname_: string;
  middlename_: string;
  lastname_: string;
  suffixname_: string;
  birthdate_: string;
  gender_: string;
  civilstatus_: string;
  nationality_: string;
  telno_rep: string;
  cellno_rep: string;
  faxno_rep: string;
  email_rep: string;
  tin_rep: string;
  outsidecity_: boolean;
  province_rep: string;
  municipality_rep: string;
  barangay_rep: string;
  subdivision_rep: string;
  street_rep: string;
  buildingname_rep: string;
  houseno_rep: string;
  block_: string;
  lot_rep: string;
  landmark_rep: string;

  // ========== BUSINESS REQUIREMENT INFO ==========
  dtino_: string;
  dtiissued_: string;
  dtiexpiry_: string;
  secno_: string;
  secissued_: string;
  secexpiry_: string;
  cdano_: string;
  cdaissued_: string;
  cdaexpiry_: string;
  localclearanceno_: string;
  localclearancedate_: string;
  cedulano_: string;
  cedulaplaceissued_: string;
  cedulaissued_: string;
  cedulaamount_: number;
  boino_: string;
  boiissued_: string;
  boiexpiry_: string;
  sssno_: string;
  sssdatereg_: string;
  pagibigno_: string;
  pagibigreg_: string;
  phicno_: string;
  phicreg_: string;
  pezaregistered_: boolean;
  pezaregno_: string;
  pezaissued_: string;
  pezaexpiry_: string;
  verification_: boolean;

  // ========== BUSINESS Waiver INFO ==========
  waivername_: string;
  waivertype_: string;
  content_: string;
  waiverstatus_: boolean;

  // ========== DOCUMENT MANAGEMENT ==========
  documents: Document[];
  requirements: Requirement[];

  // ========== FORM STATE ==========
  agreedToTerms: boolean;
  currentStep: number;
}

interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateField: (field: string, value: unknown) => void;
  submitForm: () => Promise<boolean>;
  updateForm: (businessId: string) => Promise<boolean>;
  resetForm: () => void;
  isLoading: boolean;
  validateStep: (step: number) => boolean;
  errors: Record<string, string>;
  clearErrors: () => void;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  loadBusinessData: (businessId: string) => Promise<void>;
  // Document Management Functions
  uploadDocument: (file: File, type: string, description: string) => Promise<boolean>;
  deleteDocument: (documentId: string) => void;
  viewDocument: (document: Document) => void;
  addRequirement: (requirement: Requirement) => void;
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  deleteRequirement: (id: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Initial form data
const initialFormData: FormData = {
  // Main Business Info
  businessname_: '',
  ismain_: true,
  isforeign_: false,
  isbranch_: false,
  dateestablished_: '',
  ownershiptype_: '',
  registeredceo_: '',
  tradename_: '',
  isfranchise_: false,
  ismarketstall: false,
  iscommercialbuilding: false,
  marketstall_: '',
  businessbuildingid_: '',
  buildingspace_: '',
  waiveragreement_: true,

  // Business Address
  province_: '',
  municipality_: '',
  barangay_: '',
  subdivision_: '',
  street_: '',
  buildingname_: '',
  houseno_: '',
  phaseblock_: '',
  lot_: '',
  landmark_: '',
  longlat_: '',
  telno_: '',
  cellno_: '',
  faxno_: '',
  email_: '',
  tin_: '',

  // Representative Info
  repid: '',
  repname_: '',
  repposition_: '',
  ownershiptype_rep: '',
  firstname_: '',
  middlename_: '',
  lastname_: '',
  suffixname_: '',
  birthdate_: '',
  gender_: '',
  civilstatus_: '',
  nationality_: '',
  telno_rep: '',
  cellno_rep: '',
  faxno_rep: '',
  email_rep: '',
  tin_rep: '',
  outsidecity_: false,
  province_rep: '',
  municipality_rep: '',
  barangay_rep: '',
  subdivision_rep: '',
  street_rep: '',
  buildingname_rep: '',
  houseno_rep: '',
  block_: '',
  lot_rep: '',
  landmark_rep: '',

  // Requirements
  dtino_: '',
  dtiissued_: '',
  dtiexpiry_: '',
  secno_: '',
  secissued_: '',
  secexpiry_: '',
  cdano_: '',
  cdaissued_: '',
  cdaexpiry_: '',
  localclearanceno_: '',
  localclearancedate_: '',
  cedulano_: '',
  cedulaplaceissued_: '',
  cedulaissued_: '',
  cedulaamount_: 0,
  boino_: '',
  boiissued_: '',
  boiexpiry_: '',
  sssno_: '',
  sssdatereg_: '',
  pagibigno_: '',
  pagibigreg_: '',
  phicno_: '',
  phicreg_: '',
  pezaregistered_: false,
  pezaregno_: '',
  pezaissued_: '',
  pezaexpiry_: '',
  verification_: false,

  // Waiver Info
  waivername_: '',
  waivertype_: '',
  content_: '',
  waiverstatus_: false,

  // Document Management
  documents: [],
  requirements: [
    { id: '1', type: 'Business Terms', description: 'Business Terms', status: 'Pending Upload' },
    { id: '2', type: 'Community Tax Certification', description: 'Community Tax Certification', status: 'Pending Upload' },
    { id: '3', type: 'DTI', description: 'DTI', status: 'Pending Upload' }
  ],

  // Form State
  agreedToTerms: false,
  currentStep: 1,
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Update field function
  const updateField = (field: string, value: unknown) => {
    console.log(`🔄 Updating field: ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Document Management Functions
  const uploadDocument = async (file: File, type: string, description: string): Promise<boolean> => {
    try {
      // Instead of uploading immediately, just store the file information
      const newDocument: Document = {
        id: `temp-${Date.now()}`,
        type_: type,
        desc_: description,
        businessId_: formData.businessname_ || 'temp',
        userid_: 'current-user',
        path_: '', // Will be set when actually uploaded
        filename_: file.name,
        status_: 0, // 0 = pending upload
        datetimestamp_: new Date().toISOString(),
        file: file
      };

      // Update documents in form data (store locally for now)
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }));

      console.log('📁 Document stored for later upload:', {
        filename: file.name,
        type: type,
        description: description
      });

      return true;
    } catch (error: any) {
      console.error('Document storage error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Storage Failed',
        text: 'Failed to store document information',
        confirmButtonColor: '#ef4444',
      });
      return false;
    }
  };

  const deleteDocument = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  const viewDocument = (document: Document) => {
    if (document.file) {
      const fileUrl = URL.createObjectURL(document.file);
      window.open(fileUrl, '_blank');
    } else if (document.path_) {
      window.open(document.path_, '_blank');
    } else {
      alert('No file available for this document');
    }
  };

  const addRequirement = (requirement: Requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, requirement]
    }));
  };

  const updateRequirement = (id: string, updates: Partial<Requirement>) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map(req =>
        req.id === id ? { ...req, ...updates } : req
      )
    }));
  };

  const deleteRequirement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req.id !== id)
    }));
  };

  // Reset form function
  const resetForm = () => {
    console.log('🔄 Resetting form to initial state');
    setFormData(initialFormData);
    clearErrors();
    setIsEditMode(false);
  };

  // Clear errors function
  const clearErrors = () => {
    setErrors({});
  };

  // Load business data for editing
  const loadBusinessData = async (businessId: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading business data for:', businessId);
      
      const response = await api.get(`/Business/${businessId}/details`);
      const businessData = response.data.data;
      
      console.log('📥 FULL API RESPONSE:', businessData);

      if (businessData) {
        console.log('🎯 ACTUAL VALUES FROM API:');
        console.log('  - businessname_:', businessData.businessname_);
        console.log('  - repname_:', businessData.repname_);
        console.log('  - repposition_:', businessData.repposition_);
        console.log('  - firstname_:', businessData.firstname_);
        console.log('  - lastname_:', businessData.lastname_);
        console.log('  - email_:', businessData.email_);

        const transformedData: FormData = {
          // ========== MAIN BUSINESS INFO ==========
          businessname_: businessData.businessname_ || '',
          ismain_: businessData.ismain_ ?? true,
          isforeign_: businessData.isforeign_ ?? false,
          isbranch_: businessData.isbranch_ ?? false,
          dateestablished_: businessData.dateestablished_ ? 
            new Date(businessData.dateestablished_).toISOString().split('T')[0] : '',
          ownershiptype_: businessData.ownershiptype_ || '',
          registeredceo_: businessData.registeredceo_ || '',
          tradename_: businessData.tradename_ || '',
          isfranchise_: businessData.isfranchise_ ?? false,
          ismarketstall: businessData.ismarketstall ?? false,
          iscommercialbuilding: businessData.iscommercialbuilding ?? false,
          marketstall_: businessData.marketstall_ || '',
          businessbuildingid_: businessData.businessbuildingid_ || '',
          buildingspace_: businessData.buildingspace_ || '',
          waiveragreement_: businessData.waiveragreement_ ?? true,

          // ========== BUSINESS ADDRESS INFO ==========
          province_: businessData.province_ || '',
          municipality_: businessData.municipality_ || '',
          barangay_: businessData.barangay_ || '',
          subdivision_: businessData.subdivision_ || '',
          street_: businessData.street_ || '',
          buildingname_: businessData.buildingname_ || '',
          houseno_: businessData.houseno_ || '',
          phaseblock_: businessData.phaseblock_ || '',
          lot_: businessData.lot_ || '',
          landmark_: businessData.landmark_ || '',
          longlat_: businessData.longlat_ || '',
          telno_: businessData.telno_ || '',
          cellno_: businessData.cellno_ || '',
          faxno_: businessData.faxno_ || '',
          email_: businessData.email_ || '',
          tin_: businessData.tin_ || '',

          // ========== BUSINESS REPRESENTATIVE INFO ==========
          repid: businessData.repid || '',
          repname_: businessData.repname_ || '',
          repposition_: businessData.repposition_ || '',
          ownershiptype_rep: businessData.ownershiptype_rep || '',
          firstname_: businessData.firstname_ || '',
          middlename_: businessData.middlename_ || '',
          lastname_: businessData.lastname_ || '',
          suffixname_: businessData.suffixname_ || '',
          birthdate_: businessData.birthdate_ ? 
            new Date(businessData.birthdate_).toISOString().split('T')[0] : '',
          gender_: businessData.gender_ || '',
          civilstatus_: businessData.civilstatus_ || '',
          nationality_: businessData.nationality_ || '',
          telno_rep: businessData.telno_rep || '',
          cellno_rep: businessData.cellno_rep || '',
          faxno_rep: businessData.faxno_rep || '',
          email_rep: businessData.email_rep || '',
          tin_rep: businessData.tin_rep || '',
          outsidecity_: businessData.outsidecity_ ?? false,
          province_rep: businessData.province_rep || '',
          municipality_rep: businessData.municipality_rep || '',
          barangay_rep: businessData.barangay_rep || '',
          subdivision_rep: businessData.subdivision_rep || '',
          street_rep: businessData.street_rep || '',
          buildingname_rep: businessData.buildingname_rep || '',
          houseno_rep: businessData.houseno_rep || '',
          block_: businessData.block_ || '',
          lot_rep: businessData.lot_rep || '',
          landmark_rep: businessData.landmark_rep || '',

          // ========== BUSINESS REQUIREMENT INFO ==========
          dtino_: businessData.dtino_ || '',
          dtiissued_: businessData.dtiissued_ ? 
            new Date(businessData.dtiissued_).toISOString().split('T')[0] : '',
          dtiexpiry_: businessData.dtiexpiry_ ? 
            new Date(businessData.dtiexpiry_).toISOString().split('T')[0] : '',
          secno_: businessData.secno_ || '',
          secissued_: businessData.secissued_ ? 
            new Date(businessData.secissued_).toISOString().split('T')[0] : '',
          secexpiry_: businessData.secexpiry_ ? 
            new Date(businessData.secexpiry_).toISOString().split('T')[0] : '',
          cdano_: businessData.cdano_ || '',
          cdaissued_: businessData.cdaissued_ ? 
            new Date(businessData.cdaissued_).toISOString().split('T')[0] : '',
          cdaexpiry_: businessData.cdaexpiry_ ? 
            new Date(businessData.cdaexpiry_).toISOString().split('T')[0] : '',
          localclearanceno_: businessData.localclearanceno_ || '',
          localclearancedate_: businessData.localclearancedate_ ? 
            new Date(businessData.localclearancedate_).toISOString().split('T')[0] : '',
          cedulano_: businessData.cedulano_ || '',
          cedulaplaceissued_: businessData.cedulaplaceissued_ || '',
          cedulaissued_: businessData.cedulaissued_ ? 
            new Date(businessData.cedulaissued_).toISOString().split('T')[0] : '',
          cedulaamount_: businessData.cedulaamount_ || 0,
          boino_: businessData.boino_ || '',
          boiissued_: businessData.boiissued_ ? 
            new Date(businessData.boiissued_).toISOString().split('T')[0] : '',
          boiexpiry_: businessData.boiexpiry_ ? 
            new Date(businessData.boiexpiry_).toISOString().split('T')[0] : '',
          sssno_: businessData.sssno_ || '',
          sssdatereg_: businessData.sssdatereg_ ? 
            new Date(businessData.sssdatereg_).toISOString().split('T')[0] : '',
          pagibigno_: businessData.pagibigno_ || '',
          pagibigreg_: businessData.pagibigreg_ ? 
            new Date(businessData.pagibigreg_).toISOString().split('T')[0] : '',
          phicno_: businessData.phicno_ || '',
          phicreg_: businessData.phicreg_ ? 
            new Date(businessData.phicreg_).toISOString().split('T')[0] : '',
          pezaregistered_: businessData.pezaregistered_ ?? false,
          pezaregno_: businessData.pezaregno_ || '',
          pezaissued_: businessData.pezaissued_ ? 
            new Date(businessData.pezaissued_).toISOString().split('T')[0] : '',
          pezaexpiry_: businessData.pezaexpiry_ ? 
            new Date(businessData.pezaexpiry_).toISOString().split('T')[0] : '',
          verification_: businessData.verification_ ?? false,

          // ========== BUSINESS Waiver INFO ==========
          waivername_: businessData.waivername_ || '',
          waivertype_: businessData.waivertype_ || '',
          content_: businessData.content_ || '',
          waiverstatus_: businessData.waiverstatus_ || false,

          // ========== DOCUMENT MANAGEMENT ==========
          documents: businessData.documents || [],
          requirements: businessData.requirements || initialFormData.requirements,

          // ========== FORM STATE ==========
          agreedToTerms: false,
          currentStep: 1,
        };

        console.log('🔄 FINAL TRANSFORMED DATA:', transformedData);
        setFormData(transformedData);
        setIsEditMode(true);
      }
    } catch (error: any) {
      console.error('❌ Error loading business data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Business Data',
        text: error.response?.data?.message || 'Failed to load business data',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation function
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Taxpayer Info Step
        if (!formData.repname_?.trim()) newErrors.repname_ = 'Registrant Name is required';
        if (!formData.ownershiptype_rep?.trim()) newErrors.ownershiptype_rep = 'Ownership Type is required';
        if (!formData.firstname_?.trim()) newErrors.firstname_ = 'First Name is required';
        if (!formData.lastname_?.trim()) newErrors.lastname_ = 'Last Name is required';
        if (!formData.birthdate_?.trim()) newErrors.birthdate_ = 'Birth Date is required';
        if (!formData.gender_?.trim()) newErrors.gender_ = 'Gender is required';
        if (!formData.civilstatus_?.trim()) newErrors.civilstatus_ = 'Civil Status is required';
        if (!formData.nationality_?.trim()) newErrors.nationality_ = 'Nationality is required';
        if (!formData.email_rep?.trim()) newErrors.email_rep = 'Email is required';
        if (!formData.province_rep?.trim()) newErrors.province_rep = 'Province is required';
        if (!formData.municipality_rep?.trim()) newErrors.municipality_rep = 'City/Municipality is required';
        if (!formData.landmark_rep?.trim()) newErrors.landmark_rep = 'Landmark is required';
        break;

      case 2: // Business Info Step
        if (!formData.businessname_?.trim()) newErrors.businessname_ = 'Business Name is required';
        if (!formData.ownershiptype_?.trim()) newErrors.ownershiptype_ = 'Ownership Type is required';
        if (!formData.province_?.trim()) newErrors.province_ = 'Province is required';
        if (!formData.municipality_?.trim()) newErrors.municipality_ = 'City/Municipality is required';
        if (!formData.barangay_?.trim()) newErrors.barangay_ = 'Barangay is required';
        if (!formData.landmark_?.trim()) newErrors.landmark_ = 'Landmark is required';
        if (!formData.email_?.trim()) newErrors.email_ = 'Email is required';
        if (!formData.tin_?.trim()) newErrors.tin_ = 'TIN is required';
        break;

      case 3: // Requirements Step
        // Optional validation for requirements
        break;

      case 4: // Summary Step
        if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms and conditions';
        break;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const missingFields = Object.keys(newErrors).length;
      Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        html: `
          <div class="text-left">
            <p class="mb-3">Please fill in the following required fields before proceeding:</p>
            <ul class="list-disc pl-4 space-y-1 max-h-40 overflow-y-auto">
              ${Object.values(newErrors).map(error => `<li class="text-sm">${error}</li>`).join('')}
            </ul>
            <p class="mt-3 text-sm font-semibold">Total missing fields: ${missingFields}</p>
          </div>
        `,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Okay, I\'ll fix them',
        width: 500
      });
      return false;
    }

    return true;
  };

  // Upload all pending documents
  const uploadAllDocuments = async (): Promise<boolean> => {
    const pendingDocuments = formData.documents.filter(doc => doc.status_ === 0 && doc.file);
    
    if (pendingDocuments.length === 0) {
      return true; // No documents to upload
    }

    console.log(`📤 Uploading ${pendingDocuments.length} documents...`);
    
    const uploadPromises = pendingDocuments.map(async (doc) => {
      if (doc.file) {
        try {
          // Create FormData for file upload
          const formDataToSend = new FormData();
          formDataToSend.append('file', doc.file);
          formDataToSend.append('type_', doc.type_);
          formDataToSend.append('desc_', doc.desc_);
          formDataToSend.append('businessId_', formData.businessname_);
          formDataToSend.append('userid_', 'current-user');

          // Use your actual document upload endpoint
          const response = await api.post('/Business/upload-document', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data.success) {
            return {
              ...doc,
              id: response.data.data.id_ || doc.id,
              path_: response.data.data.path_ || doc.filename_,
              status_: 1 // Mark as uploaded
            };
          }
        } catch (error) {
          console.error(`Failed to upload ${doc.filename_}:`, error);
          return {
            ...doc,
            status_: 2 // Failed
          };
        }
      }
      return doc;
    });

    // Wait for all uploads to complete
    const updatedDocuments = await Promise.all(uploadPromises);
    
    // Update form data with uploaded document info
    setFormData(prev => ({
      ...prev,
      documents: updatedDocuments
    }));

    // Check if any uploads failed
    const failedUploads = updatedDocuments.filter(doc => doc.status_ === 2);
    if (failedUploads.length > 0) {
      console.warn(`❌ ${failedUploads.length} document(s) failed to upload`);
      return false;
    }

    console.log('✅ All documents uploaded successfully');
    return true;
  };

  // Create new business
  const submitForm = async (): Promise<boolean> => {
    if (!formData.agreedToTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Agreement Required',
        text: 'You must agree to the terms and conditions before submitting your application.',
        confirmButtonColor: '#3b82f6',
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Show loading for document upload
      Swal.fire({
        title: 'Uploading Documents...',
        text: 'Please wait while we upload your documents',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Upload all pending documents first
      const uploadSuccess = await uploadAllDocuments();
      
      if (!uploadSuccess) {
        Swal.fire({
          icon: 'warning',
          title: 'Some Uploads Failed',
          text: 'Some documents failed to upload. You can try again later.',
          confirmButtonColor: '#f59e0b',
        });
        // Continue with submission anyway
      }

      // Close the upload loading dialog
      Swal.close();

      // Show submission loading
      Swal.fire({
        title: 'Submitting Application...',
        text: 'Please wait while we process your application',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Prepare the payload
      const payload = {
        // ========== MAIN BUSINESS INFO ==========
        businessname_: formData.businessname_,
        ismain_: formData.ismain_,
        isforeign_: formData.isforeign_,
        isbranch_: formData.isbranch_,
        dateestablished_: formData.dateestablished_,
        ownershiptype_: formData.ownershiptype_,
        registeredceo_: formData.registeredceo_,
        tradename_: formData.tradename_ || null,
        isfranchise_: formData.isfranchise_,
        ismarketstall: formData.ismarketstall,
        iscommercialbuilding: formData.iscommercialbuilding,
        marketstall_: formData.marketstall_ || null,
        businessbuildingid_: formData.businessbuildingid_ || null,
        buildingspace_: formData.buildingspace_,
        waiveragreement_: formData.waiveragreement_,

        // ========== BUSINESS ADDRESS INFO ==========
        province_: formData.province_,
        municipality_: formData.municipality_,
        barangay_: formData.barangay_,
        subdivision_: formData.subdivision_ || null,
        street_: formData.street_ || null,
        buildingname_: formData.buildingname_ || null,
        houseno_: formData.houseno_ || null,
        phaseblock_: formData.phaseblock_ || null,
        lot_: formData.lot_ || null,
        landmark_: formData.landmark_,
        longlat_: formData.longlat_,
        telno_: formData.telno_ || null,
        cellno_: formData.cellno_ || null,
        faxno_: formData.faxno_ || null,
        email_: formData.email_,
        tin_: formData.tin_ || null,

        // ========== BUSINESS REPRESENTATIVE INFO ==========
        repid: formData.repid || null,
        repname_: formData.repname_,
        repposition_: formData.repposition_,
        ownershiptype_rep: formData.ownershiptype_rep,
        firstname_: formData.firstname_,
        middlename_: formData.middlename_ || null,
        lastname_: formData.lastname_,
        suffixname_: formData.suffixname_ || null,
        birthdate_: formData.birthdate_,
        gender_: formData.gender_,
        civilstatus_: formData.civilstatus_,
        nationality_: formData.nationality_,
        telno_rep: formData.telno_rep || null,
        cellno_rep: formData.cellno_rep || null,
        faxno_rep: formData.faxno_rep || null,
        email_rep: formData.email_rep || null,
        tin_rep: formData.tin_rep || null,
        outsidecity_: formData.outsidecity_,
        province_rep: formData.province_rep,
        municipality_rep: formData.municipality_rep,
        barangay_rep: formData.barangay_rep || null,
        subdivision_rep: formData.subdivision_rep || null,
        street_rep: formData.street_rep || null,
        buildingname_rep: formData.buildingname_rep || null,
        houseno_rep: formData.houseno_rep || null,
        block_: formData.block_ || null,
        lot_rep: formData.lot_rep || null,
        landmark_rep: formData.landmark_rep,

        // ========== BUSINESS REQUIREMENT INFO ==========
        dtino_: formData.dtino_ || null,
        dtiissued_: formData.dtiissued_ || null,
        dtiexpiry_: formData.dtiexpiry_ || null,
        secno_: formData.secno_ || null,
        secissued_: formData.secissued_ || null,
        secexpiry_: formData.secexpiry_ || null,
        cdano_: formData.cdano_ || null,
        cdaissued_: formData.cdaissued_ || null,
        cdaexpiry_: formData.cdaexpiry_ || null,
        localclearanceno_: formData.localclearanceno_ || null,
        localclearancedate_: formData.localclearancedate_ || null,
        cedulano_: formData.cedulano_ || null,
        cedulaplaceissued_: formData.cedulaplaceissued_ || null,
        cedulaissued_: formData.cedulaissued_ || null,
        cedulaamount_: formData.cedulaamount_ || 0,
        boino_: formData.boino_ || null,
        boiissued_: formData.boiissued_ || null,
        boiexpiry_: formData.boiexpiry_ || null,
        sssno_: formData.sssno_ || null,
        sssdatereg_: formData.sssdatereg_ || null,
        pagibigno_: formData.pagibigno_ || null,
        pagibigreg_: formData.pagibigreg_ || null,
        phicno_: formData.phicno_ || null,
        phicreg_: formData.phicreg_ || null,
        pezaregistered_: formData.pezaregistered_ || false,
        pezaregno_: formData.pezaregno_ || null,
        pezaissued_: formData.pezaissued_ || null,
        pezaexpiry_: formData.pezaexpiry_ || null,
        verification_: formData.verification_ || false,

        // ========== BUSINESS Waiver INFO ==========
        waivername_: formData.waivername_ || null,
        waivertype_: formData.waivertype_ || null,
        content_: formData.content_ || null,
        waiverstatus_: formData.waiverstatus_ || false,

        // ========== DOCUMENTS INFO ==========
        documents: formData.documents.filter(doc => doc.status_ === 1),
        requirements: formData.requirements,
      };

      console.log('📤 Sending business data to API:', payload);

      const response = await api.post('/Business', payload);

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted Successfully!',
        text: `Business ${response.data.data?.businessName || formData.businessname_} has been created successfully.`,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'View Business List',
      });

      resetForm();
      return true;
    } catch (error: any) {
      Swal.close();
      
      console.group('🚨 API Error Details');
      console.error('Status:', error?.response?.status);
      console.error('Status Text:', error?.response?.statusText);
      console.error('URL:', error?.config?.url);
      console.error('Request Payload:', error?.config?.data);
      console.error('Response Data:', error?.response?.data);
      console.groupEnd();

      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error processing your request. Please try again.',
        confirmButtonColor: '#ef4444',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing business
  const updateForm = async (businessId: string): Promise<boolean> => {
    if (!formData.agreedToTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Agreement Required',
        text: 'You must agree to the terms and conditions before updating your business.',
        confirmButtonColor: '#3b82f6',
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Upload all pending documents first
      const uploadSuccess = await uploadAllDocuments();

      if (!uploadSuccess) {
        Swal.fire({
          icon: 'warning',
          title: 'Some Uploads Failed',
          text: 'Some documents failed to upload. You can try again later.',
          confirmButtonColor: '#f59e0b',
        });
        // Continue with update anyway
      }

      // Prepare update payload (similar to submitForm payload)
      const payload = {
        // ... include all the same fields as submitForm
        businessname_: formData.businessname_,
        ismain_: formData.ismain_,
        isforeign_: formData.isforeign_,
        // ... include all other fields
        documents: formData.documents.filter(doc => doc.status_ === 1),
        requirements: formData.requirements,
      };

      console.log('📤 Sending update payload to API:', payload);

      const response = await api.put(`/Business/${businessId}`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Business Updated Successfully!',
        text: `Business ${response.data.data?.businessName || formData.businessname_} has been updated successfully.`,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'View Business List',
      });

      resetForm();
      return true;
    } catch (error: any) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error processing your request. Please try again.',
        confirmButtonColor: '#ef4444',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        updateField,
        submitForm,
        updateForm,
        resetForm,
        isLoading,
        validateStep,
        errors,
        clearErrors,
        isEditMode,
        setIsEditMode,
        loadBusinessData,
        // Document Management Functions
        uploadDocument,
        deleteDocument,
        viewDocument,
        addRequirement,
        updateRequirement,
        deleteRequirement,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};