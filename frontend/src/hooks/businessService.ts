import type {
  Business,
  BusinessDetails,
} from '@/types/index';

// Shorter dummy data
const dummyBusinesses: Business[] = [
  {
    businessid_: 'BIZ001',
    businessname_: 'Leganes General Store',
    repname_: 'Juan Dela Cruz',
    longlat_: '10.7868,122.5894',
    barangay_: 'Poblacion',
    municipality_: 'Leganes',
    province_: 'Iloilo',
    street_: 'Rizal Street',
    houseno_: '123',
    dtiexpiry_: '2024-12-31',
    secexpiry_: '2025-12-31',
    cdaexpiry_: '2024-12-31'
  },
  {
    businessid_: 'BIZ002',
    businessname_: 'Napnud Agri Supply',
    repname_: 'Maria Santos',
    longlat_: '10.7912,122.5921',
    barangay_: 'Napnud',
    municipality_: 'Leganes',
    province_: 'Iloilo',
    street_: 'Luna Street',
    houseno_: '456',
    dtiexpiry_: '2026-01-15',
    secexpiry_: '2026-12-31',
    cdaexpiry_: '2026-12-31'
  },
  {
    businessid_: 'BIZ003',
    businessname_: 'Cagamutan Hardware',
    repname_: 'Pedro Reyes',
    longlat_: '10.7945,122.5956',
    barangay_: 'Cagamutan Sur',
    municipality_: 'Leganes',
    province_: 'Iloilo',
    street_: 'Burgos Street',
    houseno_: '789',
    dtiexpiry_: '2023-12-01',
    secexpiry_: '2023-12-01',
    cdaexpiry_: '2023-12-01'
  }
];

const dummyBusinessDetails: { [key: string]: BusinessDetails } = {
  'BIZ001': {
    businessInfo: {
      businessid_: 'BIZ001',
      ismain_: true,
      businessname_: 'Leganes General Store',
      dateestablished_: '2010-05-15',
      ownershiptype_: 'Single Proprietorship',
      registeredceo_: 'Juan Dela Cruz',
      tradename_: 'LGS',
      status_: true
    },
    address: {
      province_: 'Iloilo',
      municipality_: 'Leganes',
      barangay_: 'Poblacion',
      street_: 'Rizal Street',
      houseno_: '123',
      longlat_: '10.7868,122.5894',
      cellno_: '09171234567',
      email_: 'lgs@email.com'
    },
    representative: {
      repname_: 'Juan Dela Cruz',
      repposition_: 'Owner',
      cellno_: '09171234567',
      email_: 'juan@email.com'
    },
    requirements: {
      dtino_: 'DTI123456',
      dtiexpiry_: '2024-12-31',
      secno_: 'SEC789012',
      secexpiry_: '2025-12-31',
      cdano_: 'CDA345678',
      cdaexpiry_: '2024-12-31'
    }
  },
  'BIZ002': {
    businessInfo: {
      businessid_: 'BIZ002',
      ismain_: true,
      businessname_: 'Napnud Agri Supply',
      dateestablished_: '2018-03-20',
      ownershiptype_: 'Single Proprietorship',
      registeredceo_: 'Maria Santos',
      tradename_: 'NAS',
      status_: true
    },
    address: {
      province_: 'Iloilo',
      municipality_: 'Leganes',
      barangay_: 'Napnud',
      street_: 'Luna Street',
      houseno_: '456',
      longlat_: '10.7912,122.5921',
      cellno_: '09176543210',
      email_: 'nas@email.com'
    }
  }
};

// Business Service
export class BusinessService {
  static async getAllBusinesses(): Promise<Business[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(dummyBusinesses), 500);
    });
  }

  static async getBusinessDetails(businessId: string): Promise<BusinessDetails> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const details = dummyBusinessDetails[businessId];
        if (details) {
          resolve(details);
        } else {
          reject(new Error('Business not found'));
        }
      }, 500);
    });
  }

  static async getFilteredBusinesses(complianceFilter: string): Promise<Business[]> {
    const allBusinesses = await this.getAllBusinesses();
    const today = new Date();

    switch (complianceFilter.toLowerCase()) {
      case 'all':
        // Show everything: compliant, noncompliant, and pending
        return allBusinesses;

      case 'compliant':
        return allBusinesses.filter(business => {
          const dtiExpiry = business.dtiexpiry_ ? new Date(business.dtiexpiry_) : today;
          const secExpiry = business.secexpiry_ ? new Date(business.secexpiry_) : today;
          const cdaExpiry = business.cdaexpiry_ ? new Date(business.cdaexpiry_) : today;
          const pendingThreshold = new Date(today);
          pendingThreshold.setDate(pendingThreshold.getDate() + 30);

          // All expiry dates are beyond the pending threshold → compliant
          return dtiExpiry >= pendingThreshold && secExpiry >= pendingThreshold && cdaExpiry >= pendingThreshold;
        });

      case 'noncompliant':
        return allBusinesses.filter(business => {
          const dtiExpiry = business.dtiexpiry_ ? new Date(business.dtiexpiry_) : today;
          const secExpiry = business.secexpiry_ ? new Date(business.secexpiry_) : today;
          const cdaExpiry = business.cdaexpiry_ ? new Date(business.cdaexpiry_) : today;

          // Any expiry date is already past → noncompliant
          return dtiExpiry < today || secExpiry < today || cdaExpiry < today;
        });

      case 'pending':
        return allBusinesses.filter(business => {
          const dtiExpiry = business.dtiexpiry_ ? new Date(business.dtiexpiry_) : today;
          const secExpiry = business.secexpiry_ ? new Date(business.secexpiry_) : today;
          const cdaExpiry = business.cdaexpiry_ ? new Date(business.cdaexpiry_) : today;
          const pendingThreshold = new Date(today);
          pendingThreshold.setDate(pendingThreshold.getDate() + 30);

          // Within next 30 days (not yet expired but close) → pending
          return !(dtiExpiry >= pendingThreshold && secExpiry >= pendingThreshold && cdaExpiry >= pendingThreshold) &&
            (dtiExpiry >= today || secExpiry >= today || cdaExpiry >= today);
        });

      default:
        return allBusinesses;
    }

  }
}