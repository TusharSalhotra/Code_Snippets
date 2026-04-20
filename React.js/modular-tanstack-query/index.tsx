import { Info } from "lucide-react";
import { useState } from "react";
import { config } from "@/shared";
import { AuditLogDataTable } from "./components/audit-log-data-table";
import { AuditSummaryCards } from "./components/audit-summary-cards";
import { useAuditLogQuery } from "./hooks/useAuditLogQuery";
import type { AuditLogFilter, AuditLogSummary } from "./types/audit-log.types";

export default function AuditLogPage() {
	const [filters, setFilters] = useState<AuditLogFilter>({
		timeFilter: "7d",
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Fetch audit logs using React Query
	const { data, isLoading, error, refetch } = useAuditLogQuery(filters, currentPage, pageSize);

	// Use real data if available, otherwise show mock/empty state
	const activities = data?.activities || [];

	// Use real summary if available, otherwise show empty data
	const summary: AuditLogSummary = data?.summary || {
		totalActivities: 0,
		lastUserAction: null,
		lastActivity: null,
	};

	// Handle filter changes
	const handleFiltersChange = (newFilters: AuditLogFilter) => {
		setFilters(newFilters);
		setCurrentPage(1); // Reset to first page when filters change
	};

	// Handle page size changes
	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setCurrentPage(1); // Reset to first page when page size changes
	};

	// Show appropriate message based on environment if API fails
	if (error) {
		const isDevOrStaging = config.isDevelopment || config.isStaging;

		return (
			<div className="p-6 h-full overflow-y-auto space-y-6">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 tracking-tight">Audit Log</h1>
						<p className="text-sm text-gray-500 mt-1">Track all activities and changes in Every</p>
					</div>
				</div>

				{isDevOrStaging ? (
					<div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
						<div className="flex items-start gap-3">
							<Info className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
							<div className="flex-1">
								<h3 className="text-sm font-semibold text-gray-900 mb-2">
									Audit Log Not Available
								</h3>
								<p className="text-sm text-gray-600 leading-relaxed">
									The audit log feature is not enabled in the development/staging environment. This
									feature is only available in the production environment.
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)] rounded-lg p-4">
						<p className="text-sm text-[var(--color-status-error-text)]">
							Failed to load audit logs. Please try again later.
						</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="p-6 h-full overflow-y-auto space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 tracking-tight">Audit Log</h1>
					<p className="text-sm text-gray-500 mt-1">Track all activities and changes in Every</p>
				</div>
			</div>

			{/* Summary Cards */}
			<AuditSummaryCards summary={summary} isLoading={isLoading} />

			{/* Activity Table with Filters */}
			<AuditLogDataTable
				activities={activities}
				isLoading={isLoading}
				filters={filters}
				onFiltersChange={handleFiltersChange}
				totalCount={data?.pagination?.total_items || activities.length}
				currentPage={currentPage}
				onPageChange={setCurrentPage}
				pageSize={pageSize}
				onPageSizeChange={handlePageSizeChange}
				onRefresh={() => refetch()}
			/>
		</div>
	);
}
