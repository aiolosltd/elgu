// src/pages/business/BusinessViewPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/atoms/typography';
import { ArrowLeft, Edit, MapPin, Mail, Phone, Calendar, User, Building, FileText, CheckCircle, XCircle } from 'lucide-react';
import api from '@/services/api';
import type { Business } from '@/types';

interface BusinessDetails extends Business {
    address?: {
        province_: string;
        municipality_: string;
        barangay_: string;
        street_: string;
        landmark_: string;
    };
    representative?: {
        repname_: string;
        repposition_: string;
        email_rep: string;
        cellno_rep: string;
    };
    requirements?: {
        dtino_: string;
        secno_: string;
        localclearanceno_: string;
    };
}

const BusinessViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [business, setBusiness] = useState<BusinessDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusinessDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await api.get(`/Business/${id}/details`);
                setBusiness(response.data.data);
            } catch (err: any) {
                console.error('Error fetching business details:', err);
                setError(err.response?.data?.message || 'Failed to load business details');
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessDetails();
    }, [id]);

    const handleEdit = () => {
        if (id) {
            navigate(`/business-form/${id}`);
        }
    };

    const handleBack = () => {
        navigate('/business-lists');
    };

    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <Typography variant="p" className="mt-4 text-muted-foreground">Loading business details...</Typography>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <Card className="text-center max-w-md">
                    <CardContent className="pt-6">
                        <XCircle size={48} className="text-destructive mx-auto mb-4" />
                        <Typography variant="h2" className="text-destructive mb-2">Error</Typography>
                        <Typography variant="p" className="text-muted-foreground mb-4">
                            {error || 'Business not found'}
                        </Typography>
                        <Button onClick={handleBack} variant="default">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Business List
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const InfoSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
        title,
        icon,
        children
    }) => (
        <Card className="mb-6">
            <CardHeader className="pb-3">
                <div className="flex items-center">
                    <div className="flex items-center text-primary">
                        {icon}
                    </div>
                    <CardTitle className="ml-2 text-lg font-semibold">
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );

    const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; colSpan?: number }> = ({
        label,
        value,
        colSpan = 1
    }) => (
        <div className={`grid grid-cols-1 md:grid-cols-${colSpan * 2} gap-4 py-3 border-b border-border last:border-b-0`}>
            <div className="md:col-span-1">
                <Typography variant="small" className="font-medium text-muted-foreground">
                    {label}
                </Typography>
            </div>
            <div className="md:col-span-1">
                {typeof value === 'string' ? (
                    <Typography variant="p" className="text-foreground">
                        {value || 'N/A'}
                    </Typography>
                ) : (
                    value
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-6 ">
            {/* Header */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div>
                            <CardTitle className="text-xl md:text-2xl mb-2">
                                Business Details
                            </CardTitle>
                            <CardDescription className="text-sm">
                                View complete information for {business.businessname_}
                            </CardDescription>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                                <ArrowLeft size={16} className="mr-2" />
                                Back to List
                            </Button>
                            <Button variant="default" onClick={handleEdit} className="w-full sm:w-auto">
                                <Edit size={16} className="mr-2" />
                                Edit Business
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="max-w-7xl mx-auto">
                {/* Status Badge */}
                <div className="mb-6">
                    <Badge
                        variant={business.status_ ? 'success' : 'destructive'}
                        className="text-sm px-4 py-2 flex items-center w-fit"
                    >
                        {business.status_ ? (
                            <CheckCircle size={14} className="mr-1" />
                        ) : (
                            <XCircle size={14} className="mr-1" />
                        )}
                        {business.status_ ? 'Active' : 'Inactive'}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Basic Business Information */}
                        <InfoSection title="Basic Business Information" icon={<Building size={20} />}>
                            <div className="space-y-1">
                                <InfoRow label="Business Name" value={business.businessname_} />
                                <InfoRow label="Trade Name" value={business.tradename_} />
                                <InfoRow label="Ownership Type" value={business.ownershiptype_} />
                                <InfoRow label="Date Established" value={
                                    business.dateestablished_
                                        ? new Date(business.dateestablished_).toLocaleDateString()
                                        : 'N/A'
                                } />
                                <InfoRow label="Registered CEO" value={business.registeredceo_} />
                                <InfoRow label="Business Type" value={
                                    <div className="flex flex-wrap gap-2">
                                        {business.ismain_ && (
                                            <Badge variant="secondary" className="w-fit">Main</Badge>
                                        )}
                                        {business.isbranch_ && (
                                            <Badge variant="secondary" className="w-fit">Branch</Badge>
                                        )}
                                        {business.isfranchise_ && (
                                            <Badge variant="secondary" className="w-fit">Franchise</Badge>
                                        )}
                                        {business.ismarketstall && (
                                            <Badge variant="secondary" className="w-fit">Market Stall</Badge>
                                        )}
                                        {business.iscommercialbuilding && (
                                            <Badge variant="secondary" className="w-fit">Commercial Building</Badge>
                                        )}
                                    </div>
                                } />
                            </div>
                        </InfoSection>

                        {/* Business Address */}
                        <InfoSection title="Business Address" icon={<MapPin size={20} />}>
                            <div className="space-y-1">
                                <InfoRow label="Province" value={business.province_} />
                                <InfoRow label="City/Municipality" value={business.municipality_} />
                                <InfoRow label="Barangay" value={business.barangay_} />
                                <InfoRow label="Street" value={business.street_} />
                                <InfoRow label="Landmark" value={business.landmark_} />
                                <InfoRow label="Building/House No." value={business.houseno_} />
                                <InfoRow label="Subdivision" value={business.subdivision_} />
                                <InfoRow label="Phase/Block" value={business.phaseblock_} />
                                <InfoRow label="Lot" value={business.lot_} />
                            </div>
                        </InfoSection>

                        {/* Contact Information */}
                        <InfoSection title="Contact Information" icon={<Mail size={20} />}>
                            <div className="space-y-1">
                                <InfoRow label="Email" value={
                                    <div className="flex items-center">
                                        <Mail size={16} className="mr-2 text-muted-foreground" />
                                        <span className="text-foreground">{business.email_}</span>
                                    </div>
                                } />
                                <InfoRow label="Telephone" value={
                                    business.telno_ && (
                                        <div className="flex items-center">
                                            <Phone size={16} className="mr-2 text-muted-foreground" />
                                            <span className="text-foreground">{business.telno_}</span>
                                        </div>
                                    )
                                } />
                                <InfoRow label="Cellphone" value={
                                    business.cellno_ && (
                                        <div className="flex items-center">
                                            <Phone size={16} className="mr-2 text-muted-foreground" />
                                            <span className="text-foreground">{business.cellno_}</span>
                                        </div>
                                    )
                                } />
                                <InfoRow label="Fax" value={business.faxno_} />
                                <InfoRow label="TIN" value={business.tin_} />
                            </div>
                        </InfoSection>

                        {/* Business Requirements */}
                        <InfoSection title="Business Requirements" icon={<FileText size={20} />}>
                            <div className="space-y-1">
                                <InfoRow label="DTI Registration No." value={business.dtino_} />
                                <InfoRow label="DTI Date Issued" value={
                                    business.dtiissued_
                                        ? new Date(business.dtiissued_).toLocaleDateString()
                                        : 'N/A'
                                } />
                                <InfoRow label="DTI Expiry Date" value={
                                    business.dtiexpiry_
                                        ? new Date(business.dtiexpiry_).toLocaleDateString()
                                        : 'N/A'
                                } />
                                <InfoRow label="SEC Registration No." value={business.secno_} />
                                <InfoRow label="SEC Date Issued" value={
                                    business.secissued_
                                        ? new Date(business.secissued_).toLocaleDateString()
                                        : 'N/A'
                                } />
                                <InfoRow label="SEC Expiry Date" value={
                                    business.secexpiry_
                                        ? new Date(business.secexpiry_).toLocaleDateString()
                                        : 'N/A'
                                } />
                                <InfoRow label="Local Clearance No." value={business.localclearanceno_} />
                                <InfoRow label="Local Clearance Date" value={
                                    business.localclearancedate_
                                        ? new Date(business.localclearancedate_).toLocaleDateString()
                                        : 'N/A'
                                } />
                            </div>
                        </InfoSection>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Representative Information */}
                        <InfoSection title="Representative Information" icon={<User size={20} />}>
                            <div className="space-y-3">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <User size={24} className="text-primary" />
                                    </div>
                                    <Typography variant="h4" className="font-semibold text-foreground">
                                        {business.repname_ || 'N/A'}
                                    </Typography>
                                    <Typography variant="small" className="text-muted-foreground">
                                        {business.repposition_ || 'N/A'}
                                    </Typography>
                                </div>

                                <div className="space-y-1">
                                    <InfoRow label="Email" value={business.email_rep} />
                                    <InfoRow label="Cellphone" value={business.cellno_rep} />
                                    <InfoRow label="Ownership Type" value={business.ownershiptype_rep} />
                                </div>
                            </div>
                        </InfoSection>

                        {/* Additional Information */}
                        <InfoSection title="Additional Information" icon={<Calendar size={20} />}>
                            <div className="space-y-1">
                                <InfoRow label="Registration Date" value={
                                    business.datetimestamp
                                        ? new Date(business.datetimestamp).toLocaleDateString()
                                        : 'N/A'
                                } />
                                <InfoRow label="Building Space" value={
                                    business.buildingspace_ ? `${business.buildingspace_} sqm` : 'N/A'
                                } />
                                <InfoRow label="Market Stall" value={business.marketstall_} />
                                <InfoRow label="Business Building ID" value={business.businessbuildingid_} />
                                <InfoRow label="Coordinates" value={business.longlat_} />
                            </div>
                        </InfoSection>

                        {/* System Information */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-primary text-base">
                                    System Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-primary font-medium">Business ID:</span>
                                        <span className="font-mono text-foreground">{business.businessid_}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-primary font-medium">Last Updated:</span>
                                        <span className="text-foreground">
                                            {business.datetimestamp
                                                ? new Date(business.datetimestamp).toLocaleString()
                                                : 'N/A'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessViewPage;