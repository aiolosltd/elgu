// BusinessManagementPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable, DownloadControls } from '@/components/molecules/tables/datatables';
import { StatCard } from '@/components/molecules/card/statCard';
import { SearchSelect } from '@/components/atoms/input/search-select';
import { LabeledInput } from '@/components/molecules/labeledInput';
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  RefreshCw, 
  Eye, 
  Edit,
} from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';
import type { Business } from '@/types';
import type { ColumnDef } from "@tanstack/react-table";

// Define the business type for the table
type BusinessTable = {
  id: string;
  name: string;
  type: string;
  tradeName: string;
  email: string;
  owner: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  location: string;
};

const BusinessManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { businesses, loading, refetch } = useBusiness();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Status options for the dropdown
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const handleView = (businessId: string) => {
    navigate(`/business/${businessId}/view`);
  };

  const handleEdit = (businessId: string) => {
    navigate(`/business-form/${businessId}`);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleAddBusiness = () => navigate('/business-form');

  // Transform backend data
  const transformedBusinesses = useMemo((): BusinessTable[] => {
    return (businesses || []).map((business: Business, index: number) => ({
      id: business.businessid_ || `biz-${index}`,
      name: business.businessname_ || 'Unnamed Business',
      type: business.ownershiptype_ || 'N/A',
      tradeName: business.tradename_ || 'N/A',
      email: business.email_ || 'No email',
      status: business.status_ ? 'active' : 'inactive',
      registrationDate: business.datetimestamp ? new Date(business.datetimestamp).toISOString().split('T')[0] : 'N/A',
      location: [business.province_, business.municipality_, business.barangay_].filter(Boolean).join(', ') || 'N/A',
      owner: business.registeredceo_ || 'N/A',
    }));
  }, [businesses]);

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    let filtered = transformedBusinesses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(business => business.status === selectedStatus);
    }

    return filtered;
  }, [transformedBusinesses, searchTerm, selectedStatus]);

  // Stats calculation
  const stats = useMemo(() => ({
    total: transformedBusinesses.length,
    active: transformedBusinesses.filter(b => b.status === 'active').length,
    inactive: transformedBusinesses.filter(b => b.status === 'inactive').length,
  }), [transformedBusinesses]);

  // Define columns for shadcn DataTable
  const columns: ColumnDef<BusinessTable>[] = [
    {
      accessorKey: "name",
      header: "Business Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "tradeName",
      header: "Tradename",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "owner",
      header: "Owner",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={status === 'active' ? 'default' : 'secondary'}
            className={`
              ${status === 'active' 
                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                : 'bg-red-100 text-red-800 hover:bg-red-100'
              }
            `}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "registrationDate",
      header: "Registration Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const business = row.original;
        
        return (
          <div className="flex space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleView(business.id)}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(business.id)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  // Handle download
  const handleDownload = (format: 'csv' | 'excel' | 'pdf', data: BusinessTable[]) => {
    // You can customize the download logic here if needed
    console.log(`Downloading ${format} with ${data.length} records`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div>
                <CardTitle>Business Management</CardTitle>
                <CardDescription>
                  Manage and monitor all registered businesses.
                </CardDescription>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={refetch} disabled={loading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <Button variant="primary" onClick={handleAddBusiness}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Business
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Businesses"
            value={String(stats.total)}
            icon={MapPin}
            color="blue"
            description="All registered"
          />
          <StatCard
            title="Active"
            value={String(stats.active)}
            icon={CheckCircle}
            color="green"
            description="Currently operational"
          />
          <StatCard
            title="Inactive"
            value={String(stats.inactive)}
            icon={XCircle}
            color="red"
            description="No longer active"
          />
        </div>

        {/* Filters Card - WITH SEARCH, STATUS, AND DOWNLOAD BUTTON */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center flex-1">
                {/* Search Input */}
                <div className="w-full lg:w-[400px]">
                  <LabeledInput
                   label=""
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search businesses..."
                  />
                </div>

                {/* Status Filter */}
                <div className="w-full lg:w-[200px]">
                  <SearchSelect
                    label=""
                    id="status-filter"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    options={statusOptions}
                    placeholder="Filter by status"
                  />
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredData.length} of {transformedBusinesses.length} businesses
                  {selectedStatus !== 'all' && ` (Filtered by: ${statusOptions.find(opt => opt.value === selectedStatus)?.label})`}
                </div>
              </div>

              {/* Download Button - Now properly working */}
              <div className="w-full lg:w-auto">
               <DownloadControls 
                data={filteredData}
                columns={columns}
                downloadFileName="businesses"
                downloadFormats={['csv', 'excel', 'pdf']}
                onDownload={handleDownload}
              />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table - WITH ENABLED DOWNLOAD */}
        <Card>
          <CardContent className="pt-6">
             <DataTable 
            columns={columns} 
            data={filteredData}
            searchKey="name"
            searchPosition="external"
            externalSearchValue={searchTerm}
            onExternalSearchChange={setSearchTerm}
            enableStatusFilter={true}
            statusFilterPosition="external"
            externalStatusValue={selectedStatus}
            onExternalStatusChange={setSelectedStatus}
            // enableDownload={true} // ENABLED DOWNLOAD HERE
            downloadFileName="businesses"
            downloadFormats={['csv', 'excel', 'pdf']}
            onDownload={handleDownload}
            showPagination={true}
            pageSize={10}
          />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessManagementPage;