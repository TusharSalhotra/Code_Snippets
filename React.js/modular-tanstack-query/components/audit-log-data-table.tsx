import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Download,
	FileText,
	Globe,
	Info,
	Monitor,
	RefreshCw,
	Search,
	Shield,
	Smartphone,
	Tablet,
	User,
	XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { LoadingSpinner } from "@/shared/components/ui/loading-spinner";
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
import { cn } from "@/shared/utils/cn-utils";
import { formatDateTime } from "@/shared/utils/formatters";
import type { AuditLogActivity, AuditLogFilter } from "../types/audit-log.types";
import { TimePeriodSelector } from "./time-period-selector";

interface AuditLogDataTableProps {
	activities: AuditLogActivity[];
	isLoading?: boolean;
	filters: AuditLogFilter;
	onFiltersChange: (filters: AuditLogFilter) => void;
	totalCount?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	pageSize?: number;
	onPageSizeChange?: (size: number) => void;
	onRefresh?: () => void;
}

export function AuditLogDataTable({
	activities,
	isLoading = false,
	filters,
	onFiltersChange,
	totalCount,
	currentPage,
	onPageChange,
	pageSize = 10,
	onPageSizeChange,
	onRefresh,
}: AuditLogDataTableProps) {
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [searchTerm, setSearchTerm] = useState("");

	const toggleRowExpansion = (id: string) => {
		setExpandedRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	// Filter activities based on search
	const filteredActivities = useMemo(() => {
		if (!searchTerm) return activities;

		const term = searchTerm.toLowerCase();
		return activities.filter(
			(activity) =>
				activity.user.name.toLowerCase().includes(term) ||
				activity.details.toLowerCase().includes(term) ||
				(activity.metadata?.action_type || "").toLowerCase().includes(term),
		);
	}, [activities, searchTerm]);

	// Export handler
	const handleExport = () => {
		// Convert activities to CSV format
		const headers = ["User", "Action", "Details", "Status", "Timestamp", "IP Address", "Device"];
		const rows = activities.map((activity) => [
			activity.user.name,
			activity.metadata?.action_type || "Unknown",
			activity.details,
			activity.metadata?.action_result || "-",
			formatDateTime(activity.timestamp),
			activity.ipAddress || "-",
			getDeviceType(activity.userAgent),
		]);

		// Create CSV content
		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
		].join("\n");

		// Create blob and download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `audit-log-${new Date().toISOString().split("T")[0]}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	// Render the custom table
	return (
		<div className="space-y-4">
			{/* Header with filters */}
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center gap-4 flex-1">
					<div className="relative max-w-sm">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							type="text"
							placeholder="Search activities..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 h-9"
						/>
					</div>
					<TimePeriodSelector filters={filters} onFiltersChange={onFiltersChange} />
				</div>
				<div className="flex items-center gap-2">
					{onRefresh && (
						<Button
							variant="outline"
							size="sm"
							onClick={onRefresh}
							disabled={isLoading}
							className="h-8"
						>
							<RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
						</Button>
					)}
					<Button variant="outline" size="sm" onClick={handleExport} className="h-8">
						<Download className="h-4 w-4 mr-1" />
						Export
					</Button>
				</div>
			</div>

			{/* Table */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-gray-600" />
						<h3 className="text-lg font-semibold">Audit Log Activity</h3>
					</div>
					<p className="text-sm text-gray-500">Track all activities and changes in the system</p>

					{/* Update Delay Notice */}
					<div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 mt-3">
						<Info className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
						<p className="text-xs text-blue-800">
							Audit logs are updated every 5-10 minutes. Recent activities may not appear
							immediately.
						</p>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<LoadingSpinner />
						</div>
					) : filteredActivities.length === 0 ? (
						<div className="text-center py-12 text-gray-500">No audit log activities found</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="border-b">
										<TableHead className="w-[180px] px-6 font-semibold text-gray-700 bg-gray-50">
											Time
										</TableHead>
										<TableHead className="w-[200px] px-6 font-semibold text-gray-700 bg-gray-50">
											Performed By
										</TableHead>
										<TableHead className="w-[120px] px-6 font-semibold text-gray-700 bg-gray-50">
											Type
										</TableHead>
										<TableHead className="px-6 font-semibold text-gray-700 bg-gray-50">
											Action
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredActivities.map((activity, index) => (
										<React.Fragment key={activity.id}>
											<TableRow
												className={cn(
													"cursor-pointer transition-colors",
													index % 2 === 0
														? "bg-white hover:bg-gray-50"
														: "bg-gray-50/50 hover:bg-gray-100",
												)}
												onClick={() => toggleRowExpansion(activity.id)}
											>
												<TableCell className="px-6 py-3">
													<div className="flex items-center gap-2">
														<Button
															variant="ghost"
															size="sm"
															className="h-5 w-5 p-0"
															onClick={(e) => {
																e.stopPropagation();
																toggleRowExpansion(activity.id);
															}}
														>
															{expandedRows.has(activity.id) ? (
																<ChevronDown className="h-3.5 w-3.5" />
															) : (
																<ChevronRight className="h-3.5 w-3.5" />
															)}
														</Button>
														<span className="text-sm text-gray-700">
															{formatDateTime(activity.timestamp)}
														</span>
													</div>
												</TableCell>
												<TableCell className="px-6 py-3">
													<div className="flex items-center gap-2">
														<div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
															<User className="h-3.5 w-3.5 text-gray-600" />
														</div>
														<span className="text-sm font-medium text-gray-900">
															{activity.user.name}
														</span>
													</div>
												</TableCell>
												<TableCell className="px-6 py-3">
													<span
														className={cn(
															"inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
															getActionTypeColor(activity.metadata?.action_type || ""),
														)}
													>
														{activity.metadata?.action_type || "Unknown"}
													</span>
												</TableCell>
												<TableCell className="px-6 py-3">
													<div className="flex items-center gap-2">
														<span className="text-sm text-gray-700">{activity.details}</span>
														{activity.metadata?.action_result === "Failed" && (
															<XCircle className="h-4 w-4 text-red-500" />
														)}
													</div>
												</TableCell>
											</TableRow>
											{expandedRows.has(activity.id) && (
												<TableRow className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
													<TableCell colSpan={4} className="px-8 py-5 border-b bg-gray-50/30">
														{/* Information Grid - Clean 2-column layout */}
														<div className="space-y-4">
															<div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
																{/* IP Address */}
																<div>
																	<div className="text-xs font-medium text-gray-500 mb-1">
																		IP Address
																	</div>
																	<p className="text-sm font-mono text-gray-900">
																		{activity.ipAddress || "N/A"}
																	</p>
																</div>

																{/* Device */}
																<div>
																	<div className="text-xs font-medium text-gray-500 mb-1">
																		Device
																	</div>
																	<p className="text-sm text-gray-900">
																		{getDeviceType(activity.userAgent)}
																	</p>
																</div>

																{/* Phone Number (if available) */}
																{activity.metadata?.phone_number && (
																	<div>
																		<div className="text-xs font-medium text-gray-500 mb-1">
																			Phone Number
																		</div>
																		<p className="text-sm font-mono text-gray-900">
																			{activity.metadata.phone_number}
																		</p>
																	</div>
																)}
															</div>

															{/* User Agent (if available) */}
															{activity.userAgent && (
																<div className="pt-3 border-t border-gray-200">
																	<div className="text-xs font-medium text-gray-500 mb-1">
																		User Agent
																	</div>
																	<p className="text-xs text-gray-600 font-mono break-all">
																		{activity.userAgent}
																	</p>
																</div>
															)}
														</div>
													</TableCell>
												</TableRow>
											)}
										</React.Fragment>
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{/* Footer with Pagination */}
					{!isLoading &&
						totalCount &&
						currentPage &&
						(() => {
							const totalPages = Math.ceil(totalCount / pageSize);

							return (
								<div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
									{/* Show entries dropdown */}
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span>Show</span>
										<Select
											value={String(pageSize)}
											onValueChange={(value) => {
												const newPageSize = Number(value);
												onPageSizeChange?.(newPageSize);
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
										Results: {(currentPage - 1) * pageSize + 1} -{" "}
										{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
									</div>

									{/* Pagination controls */}
									{totalPages > 1 && (
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 focus:outline-none focus:ring-0"
												onClick={() => onPageChange?.(currentPage - 1)}
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
														pages.push(
															"...",
															totalPages - 3,
															totalPages - 2,
															totalPages - 1,
															totalPages,
														);
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
																	? "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-hover)] font-medium"
																	: "hover:bg-gray-100 text-gray-600"
															}`}
															onClick={() => onPageChange?.(page as number)}
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
												onClick={() => onPageChange?.(currentPage + 1)}
												disabled={currentPage === totalPages}
											>
												<ChevronRight className="h-4 w-4" />
											</Button>
										</div>
									)}
								</div>
							);
						})()}
				</CardContent>
			</Card>
		</div>
	);
}

// Helper functions
function getActionTypeColor(_action: string): string {
	// All badges use white background with primary color text and border
	const primaryStyle =
		"bg-white text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]";
	return primaryStyle;
}

function getDeviceIcon(userAgent?: string): React.ReactNode {
	if (!userAgent) return <Monitor className="h-3.5 w-3.5 text-gray-400" />;
	const ua = userAgent.toLowerCase();
	if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
		return <Smartphone className="h-3.5 w-3.5 text-gray-400" />;
	}
	if (ua.includes("tablet") || ua.includes("ipad")) {
		return <Tablet className="h-3.5 w-3.5 text-gray-400" />;
	}
	return <Monitor className="h-3.5 w-3.5 text-gray-400" />;
}

function getDeviceType(userAgent?: string): string {
	if (!userAgent) return "Desktop";
	const ua = userAgent.toLowerCase();
	if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
		return "Mobile";
	}
	if (ua.includes("tablet") || ua.includes("ipad")) {
		return "Tablet";
	}
	return "Desktop";
}
