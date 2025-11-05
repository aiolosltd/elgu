// components/molecules/tables/datatables.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import React from "react";

// Import everything individually to avoid issues
import { useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import { getPaginationRowModel } from "@tanstack/react-table";
import { getSortedRowModel } from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import type { ColumnFiltersState } from "@tanstack/react-table";

// Import download utilities
import { Download, FileText, Sheet, FileDown } from "lucide-react";

// Download Controls Component (for external use) - EXPORT THIS
export const DownloadControls = <TData,>({ 
  data, 
  columns, 
  downloadFileName = "data",
  downloadFormats = ['csv', 'excel', 'pdf'],
  onDownload 
}: { 
  data: TData[];
  columns: ColumnDef<TData>[];
  downloadFileName?: string;
  downloadFormats?: ('csv' | 'excel' | 'pdf')[];
  onDownload?: (format: 'csv' | 'excel' | 'pdf', data: TData[]) => void;
}) => {
  // Filter out actions column for export
  const exportColumns = columns.filter(col => col.id !== 'actions');

  const downloadCSV = () => {
    if (onDownload) {
      onDownload('csv', data);
      return;
    }

    const headers = exportColumns
      .map(col => {
        if (typeof col.header === 'string') return col.header;
        if ((col as any).id) return (col as any).id;
        return 'Column';
      })
      .join(',');
    
    const rows = data.map(item =>
      exportColumns
        .map(col => {
          const accessorKey = (col as any).accessorKey;
          const value = accessorKey ? (item as any)[accessorKey] : '';
          // Handle values that might contain commas or quotes
          const stringValue = String(value || '');
          return `"${stringValue.replace(/"/g, '""')}"`;
        })
        .join(',')
    ).join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${downloadFileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = async () => {
    if (onDownload) {
      onDownload('excel', data);
      return;
    }

    try {
      // Dynamic import for exceljs to reduce bundle size
      const ExcelJS = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');

      // Add headers
      const headerRow = worksheet.addRow(
        exportColumns.map(col => {
          if (typeof col.header === 'string') return col.header;
          if ((col as any).id) return (col as any).id;
          return 'Column';
        })
      );
      
      // Style headers
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
      };

      // Add data rows
      data.forEach(item => {
        const rowData = exportColumns.map(col => {
          const accessorKey = (col as any).accessorKey;
          return accessorKey ? (item as any)[accessorKey] : '';
        });
        worksheet.addRow(rowData);
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });

      // Generate blob and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${downloadFileName}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  const downloadPDF = async () => {
    if (onDownload) {
      onDownload('pdf', data);
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title
      doc.text(downloadFileName, 14, 15);
      
      // Prepare table data
      const headers = exportColumns.map(col => 
        typeof col.header === 'string' ? col.header : (col as any).id || 'Column'
      );
      
      const tableData = data.map(item => 
        exportColumns.map(col => {
          const accessorKey = (col as any).accessorKey;
          const value = accessorKey ? (item as any)[accessorKey] : '';
          return String(value || '');
        })
      );

      // Add table
      (doc as any).autoTable({
        head: [headers],
        body: tableData,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 66, 66] }
      });

      // Save PDF
      doc.save(`${downloadFileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback to simple PDF generation using browser print
      const tableElement = document.createElement('div');
      tableElement.innerHTML = `
        <h2>${downloadFileName}</h2>
        <table border="1" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              ${exportColumns.map(col => 
                `<th style="padding:8px; background:#f3f4f6; text-align:left;">
                  ${typeof col.header === 'string' ? col.header : (col as any).id || 'Column'}
                </th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${exportColumns.map(col => {
                  const accessorKey = (col as any).accessorKey;
                  const value = accessorKey ? (item as any)[accessorKey] : '';
                  return `<td style="padding:8px;">${value}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top:20px; color:#666;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </p>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${downloadFileName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f3f4f6; font-weight: bold; }
                h2 { color: #333; }
              </style>
            </head>
            <body>
              ${tableElement.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  const handleDownload = (format: 'csv' | 'excel' | 'pdf') => {
    switch (format) {
      case 'csv':
        downloadCSV();
        break;
      case 'excel':
        downloadExcel();
        break;
      case 'pdf':
        downloadPDF();
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {downloadFormats.includes('csv') && (
          <DropdownMenuItem onClick={() => handleDownload('csv')}>
            <FileText className="mr-2 h-4 w-4" />
            Download CSV
          </DropdownMenuItem>
        )}
        {downloadFormats.includes('excel') && (
          <DropdownMenuItem onClick={() => handleDownload('excel')}>
            <Sheet className="mr-2 h-4 w-4" />
            Download Excel
          </DropdownMenuItem>
        )}
        {downloadFormats.includes('pdf') && (
          <DropdownMenuItem onClick={() => handleDownload('pdf')}>
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  
  // Search configuration
  searchKey?: string;
  searchPlaceholder?: string;
  searchPosition?: 'table' | 'external' | 'none';
  
  // Status filter configuration
  enableStatusFilter?: boolean;
  statusFilterKey?: string;
  statusOptions?: { value: string; label: string }[];
  statusFilterPosition?: 'table' | 'external' | 'none';
  
  // External filter values
  externalSearchValue?: string;
  onExternalSearchChange?: (value: string) => void;
  externalStatusValue?: string;
  onExternalStatusChange?: (value: string) => void;
  
  // Download configuration
  enableDownload?: boolean;
  downloadFileName?: string;
  downloadFormats?: ('csv' | 'excel' | 'pdf')[];
  onDownload?: (format: 'csv' | 'excel' | 'pdf', data: TData[]) => void;
  
  // Other props
  showPagination?: boolean;
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  
  // Search props
  searchKey,
  searchPlaceholder = "Search...",
  searchPosition = 'table',
  
  // Status filter props
  enableStatusFilter = false,
  statusFilterKey = "status",
  statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  statusFilterPosition = 'table',
  
  // External filter values
  externalSearchValue = "",
  onExternalSearchChange,
  externalStatusValue = "all",
  onExternalStatusChange,
  
  // Download props
  enableDownload = false,
  downloadFileName = "data",
  downloadFormats = ['csv', 'excel', 'pdf'],
  onDownload,
  
  // Other props
  showPagination = true,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Internal state for table filters
  const [internalSearch, setInternalSearch] = React.useState("");
  const [internalStatus, setInternalStatus] = React.useState("all");

  // Determine which values to use based on position
  const searchValue = searchPosition === 'external' ? externalSearchValue : internalSearch;
  const statusValue = statusFilterPosition === 'external' ? externalStatusValue : internalStatus;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  // Handle search changes
  const handleSearchChange = (value: string) => {
    if (searchPosition === 'external' && onExternalSearchChange) {
      onExternalSearchChange(value);
    } else {
      setInternalSearch(value);
      if (searchKey) {
        table.getColumn(searchKey)?.setFilterValue(value);
      }
    }
  };

  // Handle status filter changes
  const handleStatusFilterChange = (value: string) => {
    if (statusFilterPosition === 'external' && onExternalStatusChange) {
      onExternalStatusChange(value);
    } else {
      setInternalStatus(value);
      if (enableStatusFilter) {
        if (value === "all") {
          table.getColumn(statusFilterKey)?.setFilterValue("");
        } else {
          table.getColumn(statusFilterKey)?.setFilterValue(value);
        }
      }
    }
  };

  // Apply external filters to table
  React.useEffect(() => {
    if (searchPosition === 'external' && searchKey) {
      table.getColumn(searchKey)?.setFilterValue(externalSearchValue);
    }
  }, [externalSearchValue, searchPosition, searchKey, table]);

  React.useEffect(() => {
    if (statusFilterPosition === 'external' && enableStatusFilter) {
      if (externalStatusValue === "all") {
        table.getColumn(statusFilterKey)?.setFilterValue("");
      } else {
        table.getColumn(statusFilterKey)?.setFilterValue(externalStatusValue);
      }
    }
  }, [externalStatusValue, statusFilterPosition, enableStatusFilter, statusFilterKey, table]);

  // Get current status filter value for display
  const getCurrentStatusLabel = () => {
    if (statusFilterPosition === 'external') {
      return statusOptions.find(opt => opt.value === externalStatusValue)?.label || "Filter by status";
    } else {
      return statusOptions.find(opt => opt.value === internalStatus)?.label || "Filter by status";
    }
  };

  // Get filtered data for download
  const getFilteredData = () => {
    return table.getFilteredRowModel().rows.map(row => row.original);
  };

  // Internal download functions for the table's download button
  const downloadCSV = () => {
    const filteredData = getFilteredData();
    
    if (onDownload) {
      onDownload('csv', filteredData);
      return;
    }

    const exportColumns = columns.filter(col => col.id !== 'actions');

    const headers = exportColumns
      .map(col => {
        if (typeof col.header === 'string') return col.header;
        if ((col as any).id) return (col as any).id;
        return 'Column';
      })
      .join(',');
    
    const rows = filteredData.map(item =>
      exportColumns
        .map(col => {
          const accessorKey = (col as any).accessorKey;
          const value = accessorKey ? (item as any)[accessorKey] : '';
          const stringValue = String(value || '');
          return `"${stringValue.replace(/"/g, '""')}"`;
        })
        .join(',')
    ).join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${downloadFileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = async () => {
    const filteredData = getFilteredData();
    
    if (onDownload) {
      onDownload('excel', filteredData);
      return;
    }

    try {
      const ExcelJS = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');

      const exportColumns = columns.filter(col => col.id !== 'actions');

      const headerRow = worksheet.addRow(
        exportColumns.map(col => {
          if (typeof col.header === 'string') return col.header;
          if ((col as any).id) return (col as any).id;
          return 'Column';
        })
      );
      
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
      };

      filteredData.forEach(item => {
        const rowData = exportColumns.map(col => {
          const accessorKey = (col as any).accessorKey;
          return accessorKey ? (item as any)[accessorKey] : '';
        });
        worksheet.addRow(rowData);
      });

      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${downloadFileName}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  const downloadPDF = async () => {
    const filteredData = getFilteredData();
    
    if (onDownload) {
      onDownload('pdf', filteredData);
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const exportColumns = columns.filter(col => col.id !== 'actions');

      doc.text(downloadFileName, 14, 15);
      
      const headers = exportColumns.map(col => 
        typeof col.header === 'string' ? col.header : (col as any).id || 'Column'
      );
      
      const tableData = filteredData.map(item => 
        exportColumns.map(col => {
          const accessorKey = (col as any).accessorKey;
          const value = accessorKey ? (item as any)[accessorKey] : '';
          return String(value || '');
        })
      );

      (doc as any).autoTable({
        head: [headers],
        body: tableData,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 66, 66] }
      });

      doc.save(`${downloadFileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback to simple PDF
      const exportColumns = columns.filter(col => col.id !== 'actions');
      const tableElement = document.createElement('div');
      tableElement.innerHTML = `
        <h2>${downloadFileName}</h2>
        <table border="1" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              ${exportColumns.map(col => 
                `<th style="padding:8px; background:#f3f4f6; text-align:left;">
                  ${typeof col.header === 'string' ? col.header : (col as any).id || 'Column'}
                </th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                ${exportColumns.map(col => {
                  const accessorKey = (col as any).accessorKey;
                  const value = accessorKey ? (item as any)[accessorKey] : '';
                  return `<td style="padding:8px;">${value}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top:20px; color:#666;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </p>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${downloadFileName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f3f4f6; font-weight: bold; }
                h2 { color: #333; }
              </style>
            </head>
            <body>
              ${tableElement.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  const handleDownload = (format: 'csv' | 'excel' | 'pdf') => {
    switch (format) {
      case 'csv':
        downloadCSV();
        break;
      case 'excel':
        downloadExcel();
        break;
      case 'pdf':
        downloadPDF();
        break;
    }
  };

  // Internal Download Controls for the table
  const TableDownloadControls = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {downloadFormats.includes('csv') && (
          <DropdownMenuItem onClick={() => handleDownload('csv')}>
            <FileText className="mr-2 h-4 w-4" />
            Download CSV
          </DropdownMenuItem>
        )}
        {downloadFormats.includes('excel') && (
          <DropdownMenuItem onClick={() => handleDownload('excel')}>
            <Sheet className="mr-2 h-4 w-4" />
            Download Excel
          </DropdownMenuItem>
        )}
        {downloadFormats.includes('pdf') && (
          <DropdownMenuItem onClick={() => handleDownload('pdf')}>
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div>
      {/* Table Controls */}
      {(searchPosition === 'table' || statusFilterPosition === 'table' || enableDownload) && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search Input - Only show when position is 'table' */}
            {searchPosition === 'table' && searchKey && (
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {/* Status Filter Dropdown - Only show when position is 'table' */}
            {statusFilterPosition === 'table' && enableStatusFilter && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-between">
                      {getCurrentStatusLabel()}
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleStatusFilterChange(option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Download Button - Only show when enableDownload is true */}
          {enableDownload && (
            <div className="ml-4">
              <TableDownloadControls />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 w-[70px]">
                    {table.getState().pagination.pageSize}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <DropdownMenuItem
                      key={pageSize}
                      onClick={() => table.setPageSize(Number(pageSize))}
                    >
                      {pageSize}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add missing ChevronDownIcon component
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);