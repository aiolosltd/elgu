import React from "react";
import { Building, User, Map, X, Mail, Phone, Calendar, FileText } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import type { BusinessDetails, BusinessNameInfo, BusinessRequirements } from "@/types";

interface BusinessDetailsPanelProps {
  selectedBusiness: any; // Changed to any to handle different data structures
  onClose: () => void;
}

interface AddressData {
  houseno_?: string;
  street_?: string;
  barangay_?: string;
  municipality_?: string;
  province_?: string;
  cellno_?: string;
  email_?: string;
  telno_?: string;
}

interface RepresentativeData {
  repname_?: string;
  repposition_?: string;
  cellno_?: string;
  email_?: string;
}

type InfoData = Record<string, string | boolean | number | null | undefined>;

export const BusinessDetailsPanel: React.FC<BusinessDetailsPanelProps> = ({
  selectedBusiness,
  onClose,
}) => {
  console.log("📊 BusinessDetailsPanel received data:", selectedBusiness);

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Check if data has the new structure (flat object) or old structure (nested)
  const isFlatStructure = selectedBusiness && selectedBusiness.businessid_;

  // Extract data based on structure
  const businessInfo = isFlatStructure ? selectedBusiness : selectedBusiness?.businessInfo;
  const addressInfo = isFlatStructure ? {
    houseno_: selectedBusiness.houseno_,
    street_: selectedBusiness.street_,
    barangay_: selectedBusiness.barangay_,
    municipality_: selectedBusiness.municipality_,
    province_: selectedBusiness.province_,
    cellno_: selectedBusiness.cellno_,
    email_: selectedBusiness.email_,
    telno_: selectedBusiness.telno_
  } : selectedBusiness?.address;

  const representativeInfo = isFlatStructure ? {
    repname_: selectedBusiness.repname_,
    repposition_: selectedBusiness.repposition_,
    cellno_: selectedBusiness.cellno_rep || selectedBusiness.cellno_,
    email_: selectedBusiness.email_rep || selectedBusiness.email_
  } : selectedBusiness?.representative;

  const requirementsInfo = isFlatStructure ? {
    dtino_: selectedBusiness.dtino_,
    dtiexpiry_: selectedBusiness.dtiexpiry_,
    secno_: selectedBusiness.secno_,
    secexpiry_: selectedBusiness.secexpiry_,
    cdano_: selectedBusiness.cdano_,
    cdaexpiry_: selectedBusiness.cdaexpiry_,
    tin_: selectedBusiness.tin_,
    sssno_: selectedBusiness.sssno_,
    pagibigno_: selectedBusiness.pagibigno_,
    phicno_: selectedBusiness.phicno_
  } : selectedBusiness?.requirements;

  const renderInfoSection = (
    title: string,
    icon: React.ReactNode,
    data: InfoData | null,
    fields: { key: string; label: string; format?: (value: any) => string }[]
  ) => {
    if (!data) return null;

    const hasData = fields.some(field => {
      const value = data[field.key];
      return value !== null && value !== undefined && value !== '';
    });

    if (!hasData) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <Typography
          as="h3"
          variant="large"
          weight="semibold"
          className="flex items-center gap-2 mb-3 text-gray-800"
        >
          {icon}
          {title}
        </Typography>
        <div className="space-y-3">
          {fields.map((field) => {
            const value = data[field.key];
            if (value === null || value === undefined || value === '') return null;

            const displayValue = field.format ? field.format(value) : String(value);

            return (
              <div key={field.key} className="flex justify-between items-start">
                <Typography as="span" weight="medium" className="text-gray-600 text-sm flex-shrink-0 w-1/3">
                  {field.label}:
                </Typography>
                <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                  {displayValue}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAddressSection = (address: AddressData | null | undefined) => {
    if (!address) return null;

    const hasAddressData = address.houseno_ || address.street_ || address.barangay_ || 
                          address.municipality_ || address.province_;

    if (!hasAddressData) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <Typography
          as="h3"
          variant="large"
          weight="semibold"
          className="flex items-center gap-2 mb-3 text-gray-800"
        >
          <Map size={18} />
          Address Information
        </Typography>
        <div className="space-y-3">
          {(address.houseno_ || address.street_ || address.barangay_) && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Complete Address:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                {`${address.houseno_ || ''} ${address.street_ || ''}, ${address.barangay_ || ''}`.trim()}
              </Typography>
            </div>
          )}
          
          {address.municipality_ && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Municipality:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                {address.municipality_}
              </Typography>
            </div>
          )}
          
          {address.province_ && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Province:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                {address.province_}
              </Typography>
            </div>
          )}

          {(address.cellno_ || address.telno_) && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Contact:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                <div className="flex items-center gap-1 justify-end">
                  <Phone size={14} />
                  {address.cellno_ || address.telno_}
                </div>
              </Typography>
            </div>
          )}

          {address.email_ && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Email:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                <div className="flex items-center gap-1 justify-end">
                  <Mail size={14} />
                  {address.email_}
                </div>
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRepresentativeSection = (representative: RepresentativeData | null | undefined) => {
    if (!representative) return null;

    const hasRepData = representative.repname_ || representative.repposition_;

    if (!hasRepData) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <Typography
          as="h3"
          variant="large"
          weight="semibold"
          className="flex items-center gap-2 mb-3 text-gray-800"
        >
          <User size={18} />
          Representative Information
        </Typography>
        <div className="space-y-3">
          {representative.repname_ && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Name:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                {representative.repname_}
              </Typography>
            </div>
          )}
          
          {representative.repposition_ && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Position:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                {representative.repposition_}
              </Typography>
            </div>
          )}

          {representative.cellno_ && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Contact:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                <div className="flex items-center gap-1 justify-end">
                  <Phone size={14} />
                  {representative.cellno_}
                </div>
              </Typography>
            </div>
          )}

          {representative.email_ && (
            <div className="flex justify-between items-start">
              <Typography as="span" weight="medium" className="text-gray-600 text-sm w-1/3">
                Email:
              </Typography>
              <Typography as="span" className="text-gray-800 text-sm text-right w-2/3">
                <div className="flex items-center gap-1 justify-end">
                  <Mail size={14} />
                  {representative.email_}
                </div>
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (!selectedBusiness) {
    return null;
  }

  const businessName = isFlatStructure 
    ? selectedBusiness.businessname_ 
    : selectedBusiness.businessInfo?.businessname_;

  return (
    <>
      {/* Backdrop with high z-index */}
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  as="h2"
                  variant="h4"
                  weight="semibold"
                  className="text-gray-800"
                >
                  Business Details
                </Typography>
                {businessName && (
                  <Typography
                    as="p"
                    variant="small"
                    className="text-gray-600 mt-1"
                  >
                    {businessName}
                  </Typography>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close panel"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Business Information */}
            {renderInfoSection(
              "Business Information",
              <Building size={18} />,
              businessInfo,
              [
                { key: 'businessid_', label: 'Business ID' },
                { key: 'businessname_', label: 'Business Name' },
                { key: 'tradename_', label: 'Trade Name' },
                { key: 'dateestablished_', label: 'Date Established', format: formatDate },
                { key: 'ownershiptype_', label: 'Ownership Type' }
              ]
            )}

            {/* Address Information */}
            {renderAddressSection(addressInfo)}

            {/* Representative Information */}
            {renderRepresentativeSection(representativeInfo)}

            {/* Business Requirements */}
            {renderInfoSection(
              "Business Requirements",
              <FileText size={18} />,
              requirementsInfo,
              [
                { key: 'dtino_', label: 'DTI Number' },
                { key: 'dtiexpiry_', label: 'DTI Expiry', format: formatDate },
                { key: 'secno_', label: 'SEC Number' },
                { key: 'secexpiry_', label: 'SEC Expiry', format: formatDate },
                { key: 'cdano_', label: 'CDA Number' },
                { key: 'cdaexpiry_', label: 'CDA Expiry', format: formatDate },
                { key: 'tin_', label: 'TIN' },
                { key: 'sssno_', label: 'SSS Number' },
                { key: 'pagibigno_', label: 'Pag-IBIG Number' },
                { key: 'phicno_', label: 'PhilHealth Number' }
              ]
            )}

            {/* Additional Information */}
            {renderInfoSection(
              "Additional Information",
              <Calendar size={18} />,
              isFlatStructure ? selectedBusiness : null,
              [
                { key: 'longlat_', label: 'Coordinates' },
                { key: 'status_', label: 'Status', format: (value) => value ? 'Active' : 'Inactive' },
                { key: 'verification_', label: 'Verification', format: (value) => value ? 'Verified' : 'Not Verified' }
              ]
            )}
          </div>
        </div>
      </div>
    </>
  );
};