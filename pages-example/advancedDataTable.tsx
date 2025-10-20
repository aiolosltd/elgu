// src/components/molecules/AdvancedDataTable/AdvancedDataTable.tsx
import { useState, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/molecules/tables/datatables'
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { Typography } from '@/components/atoms/typography';
import { Icon } from '@/components/atoms/icon';
import type { TableColumn } from '@/types';

export interface AdvancedDataTableProps<T> {
  title: string;
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  actions?: {
    label: string;
    icon?: string;
    onClick: (selectedRows: T[]) => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: (selectedRows: T[]) => boolean;
  }[];
  bulkActions?: boolean;
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  onFilterChange?: (filters: Record<string, string>) => void;
  onRefresh?: () => void;
  exportOptions?: {
    csv?: boolean;
    excel?: boolean;
    pdf?: boolean;
  };
  rowActions?: (row: T) => {
    label: string;
    onClick: () => void;
    icon?: string;
    variant?: 'default' | 'destructive' | 'outline';
  }[];
}

export function AdvancedDataTable<T>({
  title,
  data,
  columns,
  loading = false,
  actions = [],
  bulkActions = false,
  filters = [],
  onFilterChange,
  onRefresh,
  exportOptions = { csv: true },
  rowActions,
}: AdvancedDataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Record<string, string>>({});

  // Enhanced columns with row actions
  const enhancedColumns = useMemo(() => {
    if (!rowActions) return columns;

    const actionColumn: TableColumn<T> = {
      name: 'Actions',
      cell: (row: T) => {
        const actions = rowActions(row);
        return (
          <div className="flex space-x-1">
            {actions?.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className="text-xs"
              >
                {action.icon && <Icon icon={action.icon} size="sm" className="mr-1" />}
                {action.label}
              </Button>
            ))}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '200px',
    };

    return [...columns, actionColumn];
  }, [columns, rowActions]);

  // Handle row selection
  const handleSelectedRowsChange = useCallback(({ selectedRows }: { selectedRows: T[] }) => {
    setSelectedRows(selectedRows);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((key: string, value: string) => {
    const newFilters = { ...selectedFilter, [key]: value };
    setSelectedFilter(newFilters);
    onFilterChange?.(newFilters);
  }, [selectedFilter, onFilterChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedFilter({});
    onFilterChange?.({});
  }, [onFilterChange]);

  return (
    <div className="space-y-4">
      {/* Header with filters and actions */}
      <Card variant="gradient" padding="sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
          <Typography variant="h2" as="h2" weight="bold">
            {title}
          </Typography>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
            {/* Filters */}
            {filters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <select
                    key={filter.key}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedFilter[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ))}
                {Object.keys(selectedFilter).length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Refresh button */}
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <Icon icon="🔄" size="sm" className="mr-1" />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {bulkActions && selectedRows.length > 0 && (
        <Card variant="gradient" padding="sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <Typography variant="p" className="text-blue-700">
              {selectedRows.length} item(s) selected
            </Typography>
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === 'link' ? 'ghost' : (action.variant as any) || 'default'}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                  disabled={action.disabled?.(selectedRows)}
                >
                  {action.icon && <Icon icon={action.icon} size="sm" className="mr-1" />}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Data Table */}
      <DataTable<T>
        title=""
        data={data}
        columns={enhancedColumns}
        loading={loading}
        searchable={true}
        downloadable={true}
        selectable={bulkActions}
        onSelectedRowsChange={handleSelectedRowsChange}
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#f8fafc',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          },
        }}
      />
    </div>
  );
}

export default AdvancedDataTable;