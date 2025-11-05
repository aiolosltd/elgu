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
  uploadMultipleDocuments: (files: File[], type: string, description: string) => Promise<boolean>;
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

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Helper to update document status
  const updateDocumentStatus = (documentId: string, status: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === documentId ? { ...doc, status_ } : doc
      )
    }));
  };

  // Document Management Functions
  const uploadDocument = async (file: File, type: string, description: string): Promise<boolean> => {
    try {
      // Convert file to base64 for sending to backend
      const base64File = await fileToBase64(file);

      const newDocument: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type_: type,
        desc_: description,
        businessId_: formData.businessname_ || 'temp',
        userid_: 'current-user',
        path_: '', // Will be set by backend
        filename_: file.name,
        status_: 0, // 0 = pending upload
        datetimestamp_: new Date().toISOString(),
        file: file
      };

      // Update documents in form data
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }));

      console.log('📁 Document stored for upload:', {
        filename: file.name,
        type: type,
        description: description,
        size: file.size
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

  // Upload multiple documents at once
  const uploadMultipleDocuments = async (files: File[], type: string, description: string): Promise<boolean> => {
    try {
      const uploadPromises = files.map(file => uploadDocument(file, type, description));
      const results = await Promise.all(uploadPromises);
      return results.every(result => result);
    } catch (error: any) {
      console.error('Multiple document upload error:', error);
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
        // ... [Keep your existing loadBusinessData implementation]
        // Make sure to handle documents loading if needed
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

  // Prepare documents for upload
  const prepareDocumentsForUpload = async (): Promise<any[]> => {
    const documentPromises = formData.documents.map(async (doc) => {
      let fileData = null;
      let fileType = null;

      if (doc.file) {
        fileData = await fileToBase64(doc.file);
        fileType = doc.file.type;
      }

      return {
        id_: doc.id,
        type_: doc.type_,
        desc_: doc.desc_,
        businessId_: formData.businessname_, // temporary, will be replaced by backend
        userid_: 'current-user',
        path_: doc.path_,
        filename_: doc.filename_,
        status_: doc.status_,
        datetimestamp_: doc.datetimestamp_,
        fileData: fileData,
        fileType: fileType
      };
    });

    return await Promise.all(documentPromises);
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
      // Show loading for submission
      Swal.fire({
        title: 'Submitting Application...',
        text: 'Please wait while we process your business registration and documents',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Prepare documents for upload
      const documentsForUpload = await prepareDocumentsForUpload();
      console.log(`📤 Preparing ${documentsForUpload.length} documents for upload`);

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
        documents: documentsForUpload,
      };

      console.log('📤 Sending business data with documents to API:', {
        businessName: payload.businessname_,
        documentCount: documentsForUpload.length,
        totalPayloadSize: JSON.stringify(payload).length
      });

      const response = await api.post('/Business', payload);

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted Successfully!',
        html: `
          <div class="text-center">
            <p class="mb-2">Business <strong>${response.data.data?.BusinessName || formData.businessname_}</strong> has been created successfully!</p>
            <p class="text-sm text-gray-600">${documentsForUpload.length} document(s) uploaded</p>
          </div>
        `,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'View Business List',
      });

      resetForm();
      return true;
    } catch (error: any) {
      Swal.close();
      
      console.error('Submission error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'There was an error processing your request. Please try again.',
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
      // Show loading for submission
      Swal.fire({
        title: 'Updating Business...',
        text: 'Please wait while we update your business information and documents',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Prepare documents for upload
      const documentsForUpload = await prepareDocumentsForUpload();

      // Prepare update payload
      const payload = {
        // ... include all the same fields as submitForm
        businessname_: formData.businessname_,
        ismain_: formData.ismain_,
        isforeign_: formData.isforeign_,
        // ... include all other fields
        documents: documentsForUpload,
      };

      console.log('📤 Sending update payload to API:', {
        businessId: businessId,
        documentCount: documentsForUpload.length
      });

      const response = await api.put(`/Business/${businessId}`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Business Updated Successfully!',
        html: `
          <div class="text-center">
            <p class="mb-2">Business <strong>${response.data.data?.BusinessName || formData.businessname_}</strong> has been updated successfully!</p>
            <p class="text-sm text-gray-600">${documentsForUpload.length} document(s) processed</p>
          </div>
        `,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'View Business List',
      });

      resetForm();
      return true;
    } catch (error: any) {
      Swal.close();
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'There was an error processing your request. Please try again.',
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
        uploadMultipleDocuments,
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