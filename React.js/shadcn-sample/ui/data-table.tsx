import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Download,
	Loader2,
	Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { getRandomLoadingMessage } from "@/shared/utils/loading-messages";

import type { DataTableProps, SortDirection } from "./data-table.types";
import { LoadingSpinner } from "./loading-spinner";

const SortIcon = <T,>({
	field,
	sortField,
	sortDirection,
}: {
	field: keyof T;
	sortField: keyof T | null;
	sortDirection: SortDirection;
}) => {
	if (sortField !== field) return null;
	return sortDirection === "asc" ? (
		<ChevronUp className="h-4 w-4 inline ml-1" />
	) : (
		<ChevronDown className="h-4 w-4 inline ml-1" />
	);
};

export function DataTable<T extends object>(props: DataTableProps<T>) {
	const {
		data,
		columns,
		title,
		subtitle,
		isLoading = false,
		searchable = true,
		exportable = false,
		pageSize = 10,
		searchFields,
		footer,
		className = "",
		onExport,
		emptyMessage = "No data found",
		virtualizeRows = false,
		onSortChange,
		onSearchChange,
		headerActions,
	} = props;

	// Extract server pagination props conditionally
	const serverPagination = "serverPagination" in props ? props.serverPagination : false;
	const totalCount = "totalCount" in props ? props.totalCount : undefined;
	const externalCurrentPage = "currentPage" in props ? props.currentPage : undefined;
	const externalOnPageChange = "onPageChange" in props ? props.onPageChange : undefined;

	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<keyof T | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [internalCurrentPage, setInternalCurrentPage] = useState(1);
	const [currentPageSize, setPageSize] = useState(pageSize);
	const [loadingMessage, setLoadingMessage] = useState(() =>
		getRandomLoadingMessage("transactions"),
	);

	// Use external page state if provided, otherwise use internal state
	const currentPage = externalCurrentPage ?? internalCurrentPage;
	const setCurrentPage = externalOnPageChange ?? setInternalCurrentPage;

	// Rotate loading message each time loading starts
	useEffect(() => {
		if (isLoading) {
			setLoadingMessage(getRandomLoadingMessage("transactions"));
		}
	}, [isLoading]);

	// Sync external pageSize prop with internal state
	useEffect(() => {
		setPageSize(pageSize);
	}, [pageSize]);

	// Filter and sort data (only for client-side mode)
	const filteredAndSortedData = useMemo(() => {
		if (serverPagination) {
			// For server pagination, return data as-is since filtering/sorting happens on server
			return data;
		}

		let filtered = data;

		// Apply search filter
		if (searchTerm && searchable) {
			filtered = data.filter((item) => {
				const fieldsToSearch = searchFields || (Object.keys(item) as (keyof T)[]);
				return fieldsToSearch.some((field) => {
					const value = item[field];
					if (value === null || value === undefined) return false;
					return String(value).toLowerCase().includes(searchTerm.toLowerCase());
				});
			});
		}

		// Apply sorting
		if (sortField) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortField];
				const bValue = b[sortField];

				if ((aValue === null || aValue === undefined) && (bValue === null || bValue === undefined))
					return 0;
				if (aValue === null || aValue === undefined) return 1;
				if (bValue === null || bValue === undefined) return -1;
				if (aValue === bValue) return 0;

				const comparison = aValue > bValue ? 1 : -1;
				return sortDirection === "asc" ? comparison : -comparison;
			});
		}

		return filtered;
	}, [data, searchTerm, sortField, sortDirection, searchFields, searchable, serverPagination]);

	// Pagination
	const totalPages =
		serverPagination && totalCount !== undefined
			? Math.ceil(totalCount / currentPageSize)
			: Math.ceil(filteredAndSortedData.length / currentPageSize);

	const startIndex = (currentPage - 1) * currentPageSize;
	const paginatedData = serverPagination
		? data // When using server pagination, use raw data since filtering/sorting happens on server
		: filteredAndSortedData.slice(startIndex, startIndex + currentPageSize); // Client pagination uses filtered data

	// Determine total count based on pagination mode
	const actualTotalCount =
		serverPagination && totalCount !== undefined ? totalCount : filteredAndSortedData.length;

	const handleSort = (field: keyof T) => {
		if (serverPagination && onSortChange) {
			// Server-side sorting
			const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
			setSortField(field);
			setSortDirection(newDirection);
			onSortChange(field, newDirection);
		} else if (!serverPagination) {
			// Client-side sorting
			if (sortField === field) {
				setSortDirection(sortDirection === "asc" ? "desc" : "asc");
			} else {
				setSortField(field);
				setSortDirection("asc");
			}
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		if (serverPagination && onSearchChange) {
			onSearchChange(value);
		}
	};

	const defaultCellRenderer = (value: unknown): string => {
		if (value === null || value === undefined) return "-";
		if (typeof value === "boolean") return value ? "Yes" : "No";
		if (typeof value === "number") return value.toLocaleString();
		return String(value);
	};

	// Determine if sorting is enabled
	const sortingEnabled = serverPagination ? !!onSortChange : true;
	// Determine if search is enabled
	const searchEnabled = searchable && (serverPagination ? !!onSearchChange : true);

	// Show full loading state only when there's no data (initial load)
	if (isLoading && data.length === 0) {
		return (
			<Card className={`flex-1 ${className}`}>
				{(title || subtitle) && (
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							{title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
							{subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
						</div>
					</CardHeader>
				)}
				<CardContent>
					<div className="flex items-center justify-center h-64">
						<div className="flex flex-col items-center gap-4">
							<div className="text-gray-600 text-lg font-medium">{loadingMessage}</div>
							<div className="w-64 relative">
								<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
									<div className="h-full bg-[var(--color-brand-primary)] rounded-full animate-progress-fill"></div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={`flex-1 ${className} relative`}>
			{/* Loading overlay when refreshing with existing data */}
			{isLoading && data.length > 0 && (
				<div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
					<div className="flex flex-col items-center gap-4">
						<div className="text-gray-600 text-lg font-medium">{loadingMessage}</div>
						<div className="w-64 relative">
							<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
								<div className="h-full bg-[var(--color-brand-primary)] rounded-full animate-progress-fill"></div>
							</div>
						</div>
					</div>
				</div>
			)}

			{(title || subtitle || searchEnabled || exportable || headerActions) && (
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						{title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
						{subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
					</div>
					<div className="flex items-center gap-2">
						{searchEnabled && (
							<div className="relative">
								<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
								<Input
									placeholder="Search..."
									value={searchTerm}
									onChange={(e) => handleSearchChange(e.target.value)}
									className="pl-9 w-64"
								/>
							</div>
						)}
						{headerActions}
						{exportable && (
							<Button
								variant="outline"
								size="sm"
								onClick={onExport}
								className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
							>
								<Download className="h-4 w-4 mr-2" />
								Export
							</Button>
						)}
					</div>
				</CardHeader>
			)}

			<CardContent>
				<div className="space-y-4">
					{virtualizeRows && filteredAndSortedData.length > 0 ? (
						// Use virtualization for large datasets
						<div className="h-[500px] w-full border border-gray-200 rounded-md">
							<TableVirtuoso
								data={paginatedData}
								components={{
									Table: Table,
									TableHead: TableHeader,
									TableRow: (props) => (
										<TableRow {...props} className="hover:bg-gray-100 transition-colors" />
									),
									TableBody: TableBody,
								}}
								fixedHeaderContent={() => (
									<TableRow>
										{columns.map((column) => (
											<TableHead
												key={String(column.key)}
												className={`min-w-[120px] sticky top-0 bg-gray-50 ${
													column.sortable && sortingEnabled
														? "cursor-pointer hover:bg-gray-100"
														: ""
												} ${column.className || ""}`}
												onClick={() => column.sortable && sortingEnabled && handleSort(column.key)}
											>
												<div className="flex items-center">
													{column.label}
													{column.sortable && sortingEnabled && (
														<SortIcon
															field={column.key}
															sortField={sortField}
															sortDirection={sortDirection}
														/>
													)}
												</div>
											</TableHead>
										))}
									</TableRow>
								)}
								itemContent={(_index: number, item: T) => (
									<>
										{columns.map((column) => (
											<TableCell
												key={String(column.key)}
												className={`min-w-[120px] ${column.className || ""}`}
											>
												{column.render
													? column.render(item[column.key], item)
													: defaultCellRenderer(item[column.key])}
											</TableCell>
										))}
									</>
								)}
								overscan={200}
							/>
						</div>
					) : (
						// Use regular table for normal pagination
						<div className="w-full border border-gray-100 rounded-md overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow>
										{columns.map((column) => (
											<TableHead
												key={String(column.key)}
												className={`min-w-[120px] sticky top-0 bg-gray-50 ${
													column.sortable && sortingEnabled
														? "cursor-pointer hover:bg-gray-100"
														: ""
												} ${column.className || ""}`}
												onClick={() => column.sortable && sortingEnabled && handleSort(column.key)}
											>
												<div className="flex items-center">
													{column.label}
													{column.sortable && sortingEnabled && (
														<SortIcon
															field={column.key}
															sortField={sortField}
															sortDirection={sortDirection}
														/>
													)}
												</div>
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredAndSortedData.length === 0 ? (
										<TableRow>
											<TableCell colSpan={columns.length} className="text-center py-8">
												<p className="text-gray-500">
													{searchTerm ? `No items found matching your search` : emptyMessage}
												</p>
											</TableCell>
										</TableRow>
									) : (
										paginatedData.map((item, index) => (
											<TableRow
												key={
													typeof item === "object" && item && "id" in item && item.id != null
														? String(item.id)
														: index
												}
												className={`${index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-50 hover:bg-gray-100"} transition-colors`}
											>
												{columns.map((column) => (
													<TableCell
														key={String(column.key)}
														className={`min-w-[120px] ${column.className || ""}`}
													>
														{column.render
															? column.render(item[column.key], item)
															: defaultCellRenderer(item[column.key])}
													</TableCell>
												))}
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					)}

					{/* Footer with Pagination */}
					<div className="flex items-center justify-between px-2 py-4 border-t border-gray-50">
						{/* Show entries dropdown */}
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span>Show</span>
							<Select
								value={String(currentPageSize)}
								onValueChange={(value) => {
									const newPageSize = Number(value);
									setPageSize(newPageSize);
									// Call the external handler if provided (for server pagination)
									if (serverPagination && "onPageSizeChange" in props && props.onPageSizeChange) {
										props.onPageSizeChange(newPageSize);
									}
								}}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="25">25</SelectItem>
									<SelectItem value="50">50</SelectItem>
									<SelectItem value="100">100</SelectItem>
								</SelectContent>
							</Select>
							<span>entries</span>
						</div>

						{/* Results info */}
						<div className="text-sm text-gray-600">
							Results: {startIndex + 1} - {Math.min(startIndex + currentPageSize, actualTotalCount)}{" "}
							of {actualTotalCount}
						</div>

						{/* Pagination controls */}
						{totalPages > 1 && (
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 focus:outline-none focus:ring-0"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>

								{/* Page numbers */}
								{(() => {
									const pages: (number | string)[] = [];
									const showEllipsis = totalPages > 7;

									if (!showEllipsis) {
										// Show all pages if 7 or less
										for (let i = 1; i <= totalPages; i++) {
											pages.push(i);
										}
									} else {
										// Always show first page
										pages.push(1);

										if (currentPage <= 3) {
											// Near start
											pages.push(2, 3, 4);
											pages.push("...", totalPages);
										} else if (currentPage >= totalPages - 2) {
											// Near end
											pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
										} else {
											// Middle
											pages.push("...");
											pages.push(currentPage - 1, currentPage, currentPage + 1);
											pages.push("...", totalPages);
										}
									}

									return pages.map((page, idx) => {
										if (page === "...") {
											return (
												<span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
													...
												</span>
											);
										}

										return (
											<Button
												key={page}
												variant={currentPage === page ? "default" : "ghost"}
												size="sm"
												className={`h-8 w-8 p-0 focus:outline-none focus:ring-0 ${
													currentPage === page
														? "bg-[#0891B2] text-white hover:bg-[#0891B2]/90 font-medium"
														: "hover:bg-gray-100 text-gray-600"
												}`}
												onClick={() => handlePageChange(page as number)}
											>
												{page}
											</Button>
										);
									});
								})()}

								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 focus:outline-none focus:ring-0"
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				{footer && <div className="mt-6 border-t pt-4">{footer}</div>}
			</CardContent>
		</Card>
	);
}

// Re-export types for convenience
export type {
	DataTableProps,
	SortDirection,
	TableColumn,
} from "./data-table.types";
