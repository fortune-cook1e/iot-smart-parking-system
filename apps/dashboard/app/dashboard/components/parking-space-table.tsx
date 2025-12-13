'use client';

import { useState, useEffect } from 'react';

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconLayoutColumns,
  IconPlus,
} from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parkingSpaceApi } from '@/services/parking-space';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';
import { ParkingSpaceActions } from './parking-space-actions';
import { ParkingSpaceDialog } from './parking-space-dialog';
import { ParkingSpaceDetailDialog } from './parking-space-detail-dialog';

const createColumns = (
  onEdit: (parkingSpace: ParkingSpace) => void,
  onView: (parkingSpace: ParkingSpace) => void,
  onDeleted: () => void
): ColumnDef<ParkingSpace>[] => [
  {
    accessorKey: 'name',
    header: () => <div className="font-semibold">Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <span className="text-primary text-sm font-bold">
            {row.original.name?.[0]?.toUpperCase() || 'P'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name || 'Unnamed'}</span>
          <span className="text-muted-foreground text-xs">ID: {row.original.sensorId}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'isOccupied',
    header: () => <div className="font-semibold">Status</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.isOccupied ? (
          <Badge className="gap-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400">
            <IconCircleCheckFilled className="size-3" />
            Occupied
          </Badge>
        ) : (
          <Badge className="gap-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400">
            <IconCircleCheckFilled className="size-3" />
            Available
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: () => <div className="font-semibold">Description</div>,
    cell: ({ row }) => (
      <div className="max-w-md">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {row.original.description || 'No description available'}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'address',
    header: () => <div className="font-semibold">Address</div>,
    cell: ({ row }) => (
      <div className="flex items-start gap-2 max-w-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground mt-0.5 size-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm leading-relaxed">{row.original.address}</span>
      </div>
    ),
  },
  {
    accessorKey: 'currentPrice',
    header: () => <div className="text-right font-semibold">Price / Hour</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <div className="inline-flex items-baseline gap-0.5 rounded-md bg-primary/5 px-2.5 py-1">
            <span className="text-muted-foreground text-xs">$</span>
            <span className="text-lg font-semibold">{row.original.currentPrice.toFixed(2)}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right font-semibold">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ParkingSpaceActions
          parkingSpace={row.original}
          onEdit={onEdit}
          onView={onView}
          onDeleted={onDeleted}
        />
      </div>
    ),
  },
];

export function ParkingSpaceTable() {
  const [data, setData] = useState<ParkingSpace[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedParkingSpace, setSelectedParkingSpace] = useState<ParkingSpace | null>(null);

  const loadData = async () => {
    const { parkingSpaces, page, pageSize } = await parkingSpaceApi.getAllParkingSpaces();
    setData(parkingSpaces);
    setPagination({
      pageIndex: page,
      pageSize,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (parkingSpace: ParkingSpace) => {
    setSelectedParkingSpace(parkingSpace);
    setIsDialogOpen(true);
  };

  const handleView = (parkingSpace: ParkingSpace) => {
    setSelectedParkingSpace(parkingSpace);
    setIsDetailDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedParkingSpace(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    loadData();
  };

  const handleDeleted = () => {
    loadData();
  };

  const columns = createColumns(handleEdit, handleView, handleDeleted);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: row => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <ParkingSpaceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedParkingSpace}
        onSuccess={handleSuccess}
      />
      <ParkingSpaceDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        parkingSpace={selectedParkingSpace}
      />
      <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="outline">
            <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="past-performance">
              Past Performance <Badge variant="secondary">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="key-personnel">
              Key Personnel <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                  .map(column => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={value => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleCreate}>
              <IconPlus />
              <span className="hidden lg:inline">Add Parking Space</span>
              <span className="lg:hidden">Add</span>
            </Button>
          </div>
        </div>

        <TabsContent
          value="outline"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <div className="overflow-hidden rounded-xl border shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan} className="h-12">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-12 opacity-20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-sm font-medium">No parking spaces found</p>
                        <p className="text-xs">Add a new parking space to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={value => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
      </Tabs>
    </>
  );
}
