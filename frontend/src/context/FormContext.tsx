// src/context/FormContext.tsx
import React, { createContext, useState, useContext} from 'react';
import type { ReactNode } from 'react';

// Define the shape of your form data
interface FormData {
  // Taxpayer Information
  taxpayerType: string;
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  newsletter: boolean;
  
  // Registrant Information
  registrantName: string;
  registrantPosition: string;
  ownershipType: string;
  
  // Personal Name
  firstName: string;
  middleName: string;
  lastName: string;
  swissName: string;
  
  // Personal Details
  birthDate: string;
  gender: string;
  civilStatus: string;
  notReady: boolean;
  
  // Address Information
  provinceName: string;
  cityMunicipality: string;
  telephoneNumbers: string;
  barangayName: string;
  subAddress: string;
  caribbeanNumbers: string;
  street: string;
  buildingName: string;
  farNumbers: string;
  houseNumber: string;
  block: string;
  iid: string;
  landmark: string;
  googleMapAddress: string;
  tin: string;
  privateBlock: string;

  // Business Information
  businessType: string;
  registrationNumber: string;
  sameAsBusinessName: boolean;
  
  // Main Office (Checkboxes)
  branch: boolean;
  foreignCompany: boolean;
  
  // End of Ownership (Input fields)
  businessName: string;
  dateEstablished: string;
  presidentName: string;
  buildingSpace: string;
  
  // Market Stall (Checkboxes)
  commercialBuilding: boolean;
  tradeName: boolean;
  
  // Market Stall Home/Number (Input fields)
  franchiseBoard: string;
  marketBuildingName: string;
  
  // Address Information (Input fields)
  subdivision: string;
  l4i: string;
  
  // Contact Information (Input fields)
  telephoneNo: string;
  cellphoneNo: string;
  faxNo: string;
  emailAddress: string;

  // DTI and SEC
  dtiNo: string;
  secRegistrationNo: string;
  dtiIssuedDate: string;
  dtiExpirationDate: string;
  
  // CDA
  cdaNo: string;
  cdaIssuedDate: string;
  cdaExpirationDate: string;
  
  // Local Clearance
  localClearance: string;
  localClearanceDate: string;
  
  // Community Tax Certificate
  communityTaxCertNo: string;
  communityTaxPlace: string;
  communityTaxIssuedDate: string;
  communityTaxAmount: string;
  hasCommunityTaxCert: string;
  
  // Requirements
  requirements: Array<{
    id: string;
    type: string;
    description: string;
    status: string;
    fileName?: string;
    file?: File;
  }>;
  
  // Additional Registrations
  bd1No: string;
  sssNo: string;
  pagRogNo: string;
  phcpNo: string;
  ctk2xNo: string;
  
  // Dates
  bd1IssuedDate: string;
  sssDateRegistered: string;
  pagRogDateRegistered: string;
  phcpDateRegistered: string;
  ctk2xDateRegistered: string;
  bd1ExpirationDate: string;
  sssExpirationDate: string;

  // Agreement
  agreedToTerms: boolean;

  // Business Activity Fields
  primaryActivity: string;
  secondaryActivity: string;
  productsServices: string;

  // Other Info Fields
  emergencyName: string;
  emergencyContact: string;
  insuranceProvider: string;
  policyNumber: string;
  additionalComments: string;
  termsAndConditions: boolean;
}

// Define the context shape
interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateField: (field: string, value: unknown) => void;
}

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create the provider component
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    // Taxpayer Info defaults
    taxpayerType: 'individual',
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    terms: false,
    newsletter: false,
    
    // Registrant Information defaults
    registrantName: '',
    registrantPosition: '',
    ownershipType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    swissName: '',
    birthDate: '',
    gender: '',
    civilStatus: '',
    notReady: false,
    provinceName: '',
    cityMunicipality: '',
    telephoneNumbers: '',
    barangayName: '',
    subAddress: '',
    caribbeanNumbers: '',
    street: '',
    buildingName: '',
    farNumbers: '',
    houseNumber: '',
    block: '',
    iid: '',
    landmark: '',
    googleMapAddress: '',
    tin: '',
    privateBlock: '',

    // Business Info defaults
    businessType: 'sole',
    registrationNumber: '',
    sameAsBusinessName: false,
    branch: false,
    foreignCompany: false,
    businessName: '',
    dateEstablished: '',
    presidentName: '',
    buildingSpace: '',
    commercialBuilding: false,
    tradeName: false,
    franchiseBoard: '',
    marketBuildingName: '',
    subdivision: '',
    l4i: '',
    telephoneNo: '',
    cellphoneNo: '',
    faxNo: '',
    emailAddress: '',

    // Business Operation defaults
    dtiNo: '',
    secRegistrationNo: '',
    dtiIssuedDate: '',
    dtiExpirationDate: '',
    cdaNo: '',
    cdaIssuedDate: '',
    cdaExpirationDate: '',
    localClearance: '',
    localClearanceDate: '',
    communityTaxCertNo: '',
    communityTaxPlace: '',
    communityTaxIssuedDate: '',
    communityTaxAmount: '',
    hasCommunityTaxCert: '',
    requirements: [],
    bd1No: '',
    sssNo: '',
    pagRogNo: '',
    phcpNo: '',
    ctk2xNo: '',
    bd1IssuedDate: '',
    sssDateRegistered: '',
    pagRogDateRegistered: '',
    phcpDateRegistered: '',
    ctk2xDateRegistered: '',
    bd1ExpirationDate: '',
    sssExpirationDate: '',

    // Agreement
    agreedToTerms: false,

    // Business Activity defaults
    primaryActivity: '',
    secondaryActivity: '',
    productsServices: '',

    // Other Info defaults
    emergencyName: '',
    emergencyContact: '',
    insuranceProvider: '',
    policyNumber: '',
    additionalComments: '',
    termsAndConditions: false,
  });

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, updateField }}>
      {children}
    </FormContext.Provider>
  );
};

// Create a custom hook to use the form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};