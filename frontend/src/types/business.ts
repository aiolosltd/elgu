// types/index.ts

/**
 * 🏢 CORE BUSINESS TYPES
 * 📝 Essential types for hooks and services
 */

// Basic Business Interface for listings
export interface Business {
  businessid_: string;
  businessname_: string;
  tradename_?: string;
  dateestablished_?: string;
  ownershiptype_?: string;
  registeredceo_?: string;
  status_?: boolean;
}

// Complete Business Details for modal/detailed view
export interface BusinessDetails {
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
