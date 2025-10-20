import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { Typography } from '@/components/atoms/typography';
// import { Icon } from '@/components/atoms/icon';
import { StatCard } from '@/components/molecules/card/statCard';
import { DataTable } from '@/components/molecules/tables/datatables'
import { Download, Plus, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import * as XLSX from 'xlsx';

export interface Business {
  id: number;
  name: string;
  type: string;
  tradeName: string;
  email: string;
  status: 'active' | 'pending' | 'inactive' | 'expired';
  registrationDate: string;
  revenue: number;
  employees: number;
  location: string;
  owner: string;
}

const BusinessManagementPage: React.FC = () => {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedStatus] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  // Dummy data
  const [businesses] = useState<Business[]>(
    Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      name: `Business ${i + 1}`,
      type: 'Retail',
      tradeName: `Trade ${i + 1}`,
      email: `biz${i + 1}@example.com`,
      status: i % 2 === 0 ? 'active' : 'pending',
      registrationDate: '2024-01-15',
      revenue: 150000 + i * 500,
      employees: 10 + i,
      location: 'Iloilo',
      owner: `Owner ${i + 1}`,
    }))
  );

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredData = useMemo(() => {
    let result = businesses;

    if (selectedStatus !== 'all') {
      result = result.filter(b => b.status === selectedStatus);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(b =>
        Object.values(b).some(val =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Business];
        const bValue = b[sortConfig.key as keyof Business];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [businesses, searchTerm, selectedStatus, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 📥 DOWNLOAD FUNCTIONS
  const handleDownload = (type: string) => {
    setShowDropdown(false);

    if (type === 'CSV') {
      const headers = Object.keys(businesses[0]);
      const csv = [
        headers.join(','),
        ...filteredData.map(obj =>
          headers.map(h => JSON.stringify(obj[h as keyof Business] ?? '')).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `businesses_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }

    if (type === 'Excel') {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Businesses');
      XLSX.writeFile(workbook, 'businesses.xlsx');
    }


  };

  // TABLE COLUMNS
  const tableColumns = [
    { key: 'name', label: 'Business Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'tradeName', label: 'Tradename', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
  ];

  // 📋 TABLE DATA
  const tableData = paginatedData.map(b => ({
    id: b.id,
    name: b.name,
    type: b.type,
    tradeName: b.tradeName,
    email: b.email,
    owner: b.owner,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto space-y-6">

        {/* 🔹 Header */}
        <Card variant="default" padding="lg" className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <Typography variant="h1" as="h1" weight="bold" className="text-2xl text-gray-900 mb-1">
              Business Management
            </Typography>
            <Typography variant="p" className="text-gray-600">
              Manage and monitor all registered businesses.
            </Typography>
          </div>
          <div className="flex items-center space-x-3">
            {/* Download Dropdown */}
            <div className="relative">
              <Button variant="outline" onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
                <Download size={16} /> Download
              </Button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {['CSV', 'Excel'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleDownload(type)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Button */}
            <Button
              onClick={() => navigate('/business-form')}
              variant="default" className="flex items-center gap-2">
              <Plus size={16} /> Add
            </Button>
          </div>
        </Card>


        {/* 🔹 Stat Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Businesses"
            value="100"
            icon={MapPin}
            color="blue"
            description="All registered"
          />
          <StatCard
            title="Active"
            value="100"
            icon={CheckCircle}
            color="green"
            description="Currently operational"
          />
          <StatCard
            title="Pending"
            value="100"
            // value={stats.pending}
            icon={Clock}
            color="yellow"
            description="Awaiting approval"
          />
          <StatCard
            title="Inactive"
            value="100"
            // value={stats.inactive}
            icon={XCircle}
            color="red"
            description="No longer active"
          />
        </div>




        {/* 🔹 Search */}
        <Card variant="default" padding="md">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
            <input
              type="text"
              placeholder="Search businesses..."
              className="w-full lg:w-[300px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Typography variant="p" className="text-gray-600">
              Showing {paginatedData.length} of {filteredData.length} results
            </Typography>
          </div>
        </Card>

        {/* 🔹 Table */}
        <DataTable
          columns={tableColumns}
          data={tableData}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
};

export default BusinessManagementPage;
