// src/components/molecules/table/DataTable.tsx
import React from 'react';
import { Card } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Typography } from '@/components/atoms/typography';
import { Icon } from '@/components/atoms/icon';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface DataTableProps<T extends Record<string, React.ReactNode> = Record<string, React.ReactNode>> {
  columns: Column[];
  data: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSort: (key: string) => void;
  sortConfig: SortConfig | null;
  emptyState?: React.ReactNode;
}

export const DataTable = <T extends Record<string, React.ReactNode> = Record<string, React.ReactNode>>({
  columns,
  data,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  sortConfig,
  emptyState
}: DataTableProps<T>) => {
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3 " />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="h-3 " /> : <ArrowDown className="h-3 " />;
  };

  return (
    <Card variant="default" padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                  onClick={() => column.sortable && onSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-xs">{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, index) => {
                const id = (row as unknown as { id: React.Key }).id;
                const rowKey: React.Key = typeof id === 'string' || typeof id === 'number' ? id : index;
                return (
                  <tr key={rowKey} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <td
                        key={`${id}-${column.key}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-24 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      {/* <Icon icon="📊" size="xl" className="mb-4" /> */}
                      <Typography variant="h3" className="mb-2">
                        No data found
                      </Typography>
                      <Typography variant="p" className="text-gray-400">
                        No records to display
                      </Typography>
                    </div>
                  )}
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
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <Icon icon="→" size="sm" className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};