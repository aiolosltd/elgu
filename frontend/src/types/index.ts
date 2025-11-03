
// Weather Data Interface
export interface WeatherData {
  city: string;
  temperature: string;
  description: string;
  fullDescription?: string;
}

export interface NewsItem {
  title: string;
  link: string;
}

// Lookup Options Interface
export interface LookupOptions {
  [key: string]: string[];
}



// Dashboard Statistics Interface
export interface DashboardStats {
  totalBusinesses: number;
  compliantBusinesses: number;
  pendingBusinesses: number;
  nonCompliantBusinesses: number;
  municipalities: number;
  growthRate: number;
}

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
}

export interface BusinessResponse {
  data: Business[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


 export interface MapsProps {
  complianceFilter?: string;
}
export interface TableColumn {
   field: string;
  header: string;
  sortable?: boolean;
  // ... other properties
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

export interface DashboardStats {
  totalBusinesses: number;
  compliantBusinesses: number;
  pendingBusinesses: number;
  nonCompliantBusinesses: number;
  municipalities: number;
  growthRate: number;
}
