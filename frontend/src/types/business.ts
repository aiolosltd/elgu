// types/index.ts

/**
 * 🏢 CORE BUSINESS TYPES
 * 📝 Essential types for hooks and services
 */

// Basic Business Interface for listings
// export interface Business {
//   businessid_: string;
//   businessname_: string;
//   tradename_?: string;
//   dateestablished_?: string;
//   ownershiptype_?: string;
//   registeredceo_?: string;
//   status_?: boolean;
// }


// Business-Related Interfaces
export interface Business {
  businessid_: string;
  businessname_: string;
  ownershiptype_: string;
  tradename_?: string;
  email_: string;
  registeredceo_: string;
  status_: boolean;
  datetimestamp: string;
  repname_: string;
  longlat_: string;
  barangay_: string;
  municipality_: string;
  province_: string;
  street_: string;
  houseno_: string;
  dtiexpiry_: string | null;
  secexpiry_: string | null;
  cdaexpiry_: string | null;
  
  // ADD THESE MISSING PROPERTIES:
  dateestablished_: string;
  ismain_: boolean;
  isbranch_: boolean;
  isfranchise_: boolean;
  ismarketstall: boolean;
  iscommercialbuilding: boolean;
  landmark_: string;
  subdivision_: string;
  phaseblock_: string;
  lot_: string;
  telno_: string;
  cellno_: string;
  faxno_: string;
  tin_: string;
  dtino_: string;
  dtiissued_: string;
  secno_: string;
  secissued_: string;
  localclearanceno_: string;
  localclearancedate_: string;
  repposition_: string;
  email_rep: string;
  cellno_rep: string;
  ownershiptype_rep: string;
  buildingspace_: string;
  marketstall_: string;
  businessbuildingid_: string;
}

// export interface BusinessDetails {
//   id: number;
//   businessId: string;
//   businessName: string;
//   street: string;
//   buildingName: string;
//   email: string;
//   contactNumber: string;
//   status: string;
//   registrationDate: string;
// }

// Complete Business Details for modal/detailed view
export interface BusinessDetails {

  id: number;
  businessId: string;
  businessName: string;
  street: string;
  buildingName: string;
  email: string;
  contactNumber: string;
  status: string;
  registrationDate: string;


  // Basic info
  businessid_: string;
  businessname_: string;
  tradename_?: string;
  dateestablished_?: string;
  ownershiptype_?: string;
  registeredceo_?: string;
  status_?: boolean;
  
  // Address info
  province_?: string;
  municipality_?: string;
  barangay_?: string;
  street_?: string;
  houseno_?: string;
  longlat_?: string;
  telno_?: string;
  cellno_?: string;
  email_?: string;
  
  // Representative info
  repname_?: string;
  repposition_?: string;
  cellno_rep?: string;
  email_rep?: string;
  
  // Requirements info
  dtino_?: string;
  dtiexpiry_?: string;
  secno_?: string;
  secexpiry_?: string;
  cdano_?: string;
  cdaexpiry_?: string;
  tin_?: string;
  sssno_?: string;
  pagibigno_?: string;
  phicno_?: string;
}

export interface MapMarker {
  position: { lat: number; lng: number };
  businessId: string;
  businessName: string;
  owner: string;
  address: string;
  compliance: 'compliant' | 'pending' | 'noncompliant';
}

export interface BusinessNameInfo {
  businessid_: string;
  ismain_: boolean;
  businessname_: string;
  dateestablished_: string;
  ownershiptype_: string;
  registeredceo_: string;
  tradename_: string;
  status_: boolean;
}

export interface BusinessAddress {
  province_: string;
  municipality_: string;
  barangay_: string;
  street_: string;
  houseno_: string;
  longlat_: string;
  cellno_: string;
  email_: string;
}

export interface BusinessRepresentative {
  repname_: string;
  repposition_: string;
  cellno_: string;
  email_: string;
}

export interface BusinessRequirements {
  dtino_: string;
  dtiexpiry_: string;
  secno_: string;
  secexpiry_: string;
  cdano_: string;
  cdaexpiry_: string;
}

export interface BusinessDetails {
  businessInfo?: BusinessNameInfo;
  address?: BusinessAddress;
  representative?: BusinessRepresentative;
  requirements?: BusinessRequirements;
}



/**
 * 🗺️ MAP-SPECIFIC TYPES
 * 📝 Optimized for map display performance
 */

export interface BusinessMapDto {
  businessId: string;
  businessName: string;
  representativeName: string;
  longLat: string;
  complianceStatus: "compliant" | "pending" | "noncompliant";
  address: string;
  dtiExpiry?: string;
  secExpiry?: string;
  cdaExpiry?: string;
}

export interface BusinessMapStats {
  total: number;
  compliant: number;
  pending: number;
  nonCompliant: number;
}

export interface MapFilterRequest {
  complianceFilter: string;
  searchQuery?: string;
}

/**
 * 📡 API RESPONSE TYPES
 * 📝 Standardized API responses
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 🎯 HOOK RETURN TYPES
 * 📝 What the hooks actually return
 */

export interface UseBusinessDataReturn {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseMapBusinessesReturn {
  businesses: BusinessMapDto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseBusinessDetailsReturn {
  businessDetails: BusinessDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseBusinessStatsReturn {
  stats: BusinessMapStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseBusinessComplianceReturn {
  compliance: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 🔧 SERVICE TYPES
 * 📝 Types used in business service
 */

export interface BusinessResponse {
  businessId: string;
  businessName: string;
  timestamp: string;
  message: string;
  action: string;
  success: boolean;
}

// Export only what's needed
