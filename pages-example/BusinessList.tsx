// src/components/pages/BusinessManagementPage.tsx
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/ard';
import { Typography } from '@/components/atoms/typography';
import { Icon } from '@/components/atoms/icon';

interface Business {
  id: number;
  name: string;
  owner: string;
  type: string;
  status: 'active' | 'pending' | 'inactive' | 'expired';
  registrationDate: string;
  revenue: number;
  employees: number;
  location: string;
}

const BusinessManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Business; direction: 'asc' | 'desc' } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Sample data
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      owner: 'John Smith',
      type: 'Technology',
      status: 'active',
      registrationDate: '2023-01-15',
      revenue: 150000,
      employees: 25,
      location: 'New York'
    },
    {
      id: 2,
      name: 'Green Cafe & Restaurant',
      owner: 'Maria Garcia',
      type: 'Food & Beverage',
      status: 'active',
      registrationDate: '2023-02-20',
      revenue: 75000,
      employees: 12,
      location: 'Los Angeles'
    },
    {
      id: 3,
      name: 'BuildRight Construction Co.',
      owner: 'Robert Johnson',
      type: 'Construction',
      status: 'pending',
      registrationDate: '2023-03-10',
      revenue: 200000,
      employees: 45,
      location: 'Chicago'
    },
    {
      id: 4,
      name: 'Fashion Trends Boutique',
      owner: 'Sarah Chen',
      type: 'Retail',
      status: 'inactive',
      registrationDate: '2023-01-05',
      revenue: 50000,
      employees: 8,
      location: 'Miami'
    },
    {
      id: 5,
      name: 'HealthPlus Pharmacy',
      owner: 'Dr. Michael Brown',
      type: 'Healthcare',
      status: 'active',
      registrationDate: '2023-04-15',
      revenue: 300000,
      employees: 18,
      location: 'Houston'
    },
    {
      id: 6,
      name: 'QuickFix Auto Repair',
      owner: 'James Wilson',
      type: 'Automotive',
      status: 'expired',
      registrationDate: '2022-11-30',
      revenue: 120000,
      employees: 10,
      location: 'Phoenix'
    },
    {
      id: 7,
      name: 'Creative Design Studio',
      owner: 'Emily Davis',
      type: 'Creative Services',
      status: 'active',
      registrationDate: '2023-05-22',
      revenue: 180000,
      employees: 15,
      location: 'Seattle'
    },
    {
      id: 8,
      name: 'FreshMart Groceries',
      owner: 'David Thompson',
      type: 'Retail',
      status: 'pending',
      registrationDate: '2023-06-10',
      revenue: 90000,
      employees: 20,
      location: 'Denver'
    },
    {
      id: 9,
      name: 'ProLegal Consultancy',
      owner: 'Jennifer Martinez',
      type: 'Professional Services',
      status: 'active',
      registrationDate: '2023-03-18',
      revenue: 250000,
      employees: 12,
      location: 'Boston'
    },
    {
      id: 10,
      name: 'EcoClean Services',
      owner: 'Kevin Anderson',
      type: 'Cleaning',
      status: 'inactive',
      registrationDate: '2023-02-28',
      revenue: 60000,
      employees: 6,
      location: 'Atlanta'
    },
    {
      id: 11,
      name: 'SmartTech Solutions',
      owner: 'Lisa Rodriguez',
      type: 'Technology',
      status: 'active',
      registrationDate: '2023-07-05',
      revenue: 220000,
      employees: 28,
      location: 'Austin'
    },
    {
      id: 12,
      name: 'Urban Fitness Center',
      owner: 'Brian Clark',
      type: 'Fitness',
      status: 'pending',
      registrationDate: '2023-08-12',
      revenue: 150000,
      employees: 14,
      location: 'San Diego'
    }
  ]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = businesses;

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(business => business.status === selectedStatus);
    }

    // Search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(business =>
        business.name.toLowerCase().includes(lowerSearch) ||
        business.owner.toLowerCase().includes(lowerSearch) ||
        business.type.toLowerCase().includes(lowerSearch) ||
        business.location.toLowerCase().includes(lowerSearch)
      );
    }

    // Sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [businesses, searchTerm, selectedStatus, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Handle sort
  const handleSort = (key: keyof Business) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle download
  const handleDownload = () => {
    const headers = ['ID', 'Business Name', 'Owner', 'Type', 'Status', 'Registration Date', 'Revenue', 'Employees', 'Location'];
    const csvData = filteredData.map(business => [
      business.id,
      business.name,
      business.owner,
      business.type,
      business.status,
      business.registrationDate,
      business.revenue,
      business.employees,
      business.location
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `businesses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // In a real app, you would fetch new data here
    }, 1500);
  };

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'expired', label: 'Expired' },
  ];

  // Get status badge color
  const getStatusColor = (status: Business['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  bg-gray-50 p-6">
        <div className=" mx-auto">
          <Card variant="default" padding="lg" className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <Typography variant="h3" className="text-gray-600">
              Loading Business Data...
            </Typography>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-9xl mx-auto space-y-6">
        {/* Header Section */}
        <Card variant="default" padding="lg">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <Typography variant="h1" as="h1" weight="bold" className="text-3xl text-gray-900 mb-2">
                Business Management
              </Typography>
              <Typography variant="p" className="text-gray-600">
                Manage and monitor all registered businesses in the system
              </Typography>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="flex items-center space-x-2"
              >
                <Icon icon="🔄" size="sm" />
                <span>Refresh</span>
              </Button>
              <Button
                variant="default"
                onClick={handleDownload}
                disabled={filteredData.length === 0}
                className="flex items-center space-x-2"
              >
                <Icon icon="📥" size="sm" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="p" className="text-gray-600 mb-1">
                  Total Businesses
                </Typography>
                <Typography variant="h2" className="text-3xl font-bold text-gray-900">
                  {businesses.length}
                </Typography>
              </div>
              <Icon icon="🏢" size="xl" variant="primary" />
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="p" className="text-gray-600 mb-1">
                  Active Businesses
                </Typography>
                <Typography variant="h2" className="text-3xl font-bold text-green-600">
                  {businesses.filter(b => b.status === 'active').length}
                </Typography>
              </div>
              <Icon icon="✅" size="xl" variant="primary" />
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="p" className="text-gray-600 mb-1">
                  Pending Review
                </Typography>
                <Typography variant="h2" className="text-3xl font-bold text-yellow-600">
                  {businesses.filter(b => b.status === 'pending').length}
                </Typography>
              </div>
              <Icon icon="⏳" size="xl" variant="primary" />
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="p" className="text-gray-600 mb-1">
                  Total Revenue
                </Typography>
                <Typography variant="h2" className="text-3xl font-bold text-blue-600">
                  ${businesses.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}
                </Typography>
              </div>
              <Icon icon="💰" size="xl" variant="primary" />
            </div>
          </Card>
        </div>

        {/* Filters and Search Section */}
        <Card variant="default" padding="lg">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Typography variant="p" className="text-gray-700 whitespace-nowrap">
                  Filter by:
                </Typography>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="🔍" size="sm" variant="muted" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search businesses, owners, types..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <Typography variant="p" className="text-gray-600">
              Showing {filteredData.length} of {businesses.length} businesses
            </Typography>
          </div>
        </Card>

        {/* Data Table Section */}
        <Card variant="default" padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      {sortConfig?.key === 'id' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Business Name</span>
                      {sortConfig?.key === 'name' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('owner')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Owner</span>
                      {sortConfig?.key === 'owner' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Type</span>
                      {sortConfig?.key === 'type' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortConfig?.key === 'status' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Revenue</span>
                      {sortConfig?.key === 'revenue' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('employees')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Employees</span>
                      {sortConfig?.key === 'employees' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Location</span>
                      {sortConfig?.key === 'location' && (
                        <Icon icon={sortConfig.direction === 'asc' ? '↑' : '↓'} size="sm" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((business) => (
                    <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{business.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <Icon icon="🏢" size="sm" />
                          <span className="font-medium">{business.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {business.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {business.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(business.status)}`}>
                          {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${business.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {business.employees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {business.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Icon icon="👁️" size="sm" className="mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Icon icon="✏️" size="sm" className="mr-1" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Icon icon="📊" size="2xl" className="mb-4" />
                        <Typography variant="h3" className="mb-2">
                          No businesses found
                        </Typography>
                        <Typography variant="p" className="text-gray-400">
                          {searchTerm || selectedStatus !== 'all' 
                            ? 'Try adjusting your search or filters' 
                            : 'No businesses registered yet'}
                        </Typography>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Typography variant="small" className="text-gray-700">
                  Show
                </Typography>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[5, 10, 25, 50].map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <Typography variant="small" className="text-gray-700">
                  entries per page
                </Typography>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <Icon icon="←" size="sm" className="mr-1" />
                  Previous
                </Button>
                
                <Typography variant="small" className="text-gray-700 mx-4">
                  Page {currentPage} of {totalPages}
                </Typography>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <Icon icon="→" size="sm" className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BusinessManagementPage;