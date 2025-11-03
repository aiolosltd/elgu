import type {
  Business,
  BusinessDetails,
} from '@/types/index';

// Shorter dummy data
const dummyBusinesses: Business[] = [
  {
    businessid_: 'BIZ001',
    businessname_: 'Leganes General Store',
    ownershiptype_: 'Single Proprietorship',
    email_: 'lgs@email.com',
    registeredceo_: 'Juan Dela Cruz',
    status_: true,
    datetimestamp: '2023-01-15T14:30:00Z',
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
    ownershiptype_: 'Partnership',
    email_: 'nas@email.com',
    registeredceo_: 'Maria Santos',
    status_: true,
    datetimestamp: '2022-11-20T10:00:00Z',
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
    ownershiptype_: 'Corporation',
    email_: 'chw@email.com',
    registeredceo_: 'Pedro Reyes',
    status_: false,
    datetimestamp: '2021-08-01T09:45:00Z',
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
    },
    representative: {
      repname_: 'Maria Santos',
      repposition_: 'Owner',
      cellno_: '09176543210',
      email_: 'maria@email.com'
    },
    requirements: {
      dtino_: 'DTI789012',
      dtiexpiry_: '2026-01-15',
      secno_: 'SEC345678',
      secexpiry_: '2026-12-31',
      cdano_: 'CDA901234',
      cdaexpiry_: '2026-12-31'
    }
  },
  'BIZ003': {
    businessInfo: {
      businessid_: 'BIZ003',
      ismain_: true,
      businessname_: 'Cagamutan Hardware',
      dateestablished_: '2015-08-10',
      ownershiptype_: 'Single Proprietorship',
      registeredceo_: 'Pedro Reyes',
      tradename_: 'CHW',
      status_: true
    },
    address: {
      province_: 'Iloilo',
      municipality_: 'Leganes',
      barangay_: 'Cagamutan Sur',
      street_: 'Burgos Street',
      houseno_: '789',
      longlat_: '10.7945,122.5956',
      cellno_: '09179876543',
      email_: 'chw@email.com'
    },
    representative: {
      repname_: 'Pedro Reyes',
      repposition_: 'Owner',
      cellno_: '09179876543',
      email_: 'pedro@email.com'
    },
    requirements: {
      dtino_: 'DTI567890',
      dtiexpiry_: '2023-12-01',
      secno_: 'SEC123456',
      secexpiry_: '2023-12-01',
      cdano_: 'CDA789012',
      cdaexpiry_: '2023-12-01'
    }
  }
};


