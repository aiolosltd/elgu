import React, { createContext, useState, useContext} from 'react';
import type { ReactNode } from 'react';
// Define the shape of your form data
interface FormData {
  // Taxpayer Info
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
  
  // Business Info
  businessType: string;
  registrationNumber: string;
  tin: string;
  businessName: string;
  tradeName: string;
  sameAsBusinessName: boolean;
  
  [key: string]: any;
  
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
    
    // Business Info defaults
    businessType: 'sole',
    registrationNumber: '',
    tin: '',
    businessName: '',
    tradeName: '',
    sameAsBusinessName: false,
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