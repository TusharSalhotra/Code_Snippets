import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { config } from "@/shared";
import { auditLogApi } from "../api/audit-log.api";
import { createSummaryFromResponse, mapApiResponseToActivities } from "../api/audit-log.mappers";
import type { AuditLogFilter } from "../types/audit-log.types";

/**
 * Query key factory for audit logs
 */
export const auditLogQueryKeys = {
	all: ["audit-logs"] as const,
	lists: () => [...auditLogQueryKeys.all, "list"] as const,
	list: (filters: AuditLogFilter, page: number, limit: number) =>
		[...auditLogQueryKeys.lists(), filters, page, limit] as const,
	detail: (id: string) => [...auditLogQueryKeys.all, "detail", id] as const,
};

/**
 * Hook to fetch audit logs with filters
 */
export function useAuditLogQuery(filters: AuditLogFilter, page = 1, limit = 10) {
	// Convert filter to API request params
	const getDateRange = () => {
		const endDate = new Date();
		const startDate = new Date();

		switch (filters.timeFilter) {
			case "today":
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(23, 59, 59, 999);
				break;
			case "7d":
				startDate.setDate(endDate.getDate() - 7);
				break;
			case "30d":
				startDate.setDate(endDate.getDate() - 30);
				break;
			case "90d":
				startDate.setDate(endDate.getDate() - 90);
				break;
			case "custom":
				if (filters.startDate) startDate.setTime(filters.startDate.getTime());
				if (filters.endDate) endDate.setTime(filters.endDate.getTime());
				break;
		}

		return {
			start_date: format(startDate, "yyyy-MM-dd"),
			end_date: format(endDate, "yyyy-MM-dd"),
		};
	};

	const dateRange = getDateRange();

	return useQuery({
		queryKey: auditLogQueryKeys.list(filters, page, limit),
		queryFn: async () => {
			// Check environment - if dev/staging, throw error immediately without API call
			const isDevOrStaging = config.isDevelopment || config.isStaging;
			if (isDevOrStaging) {
				throw new Error("Audit log feature is not available in development/staging environment");
			}

			const response = await auditLogApi.getAuditLogs({
				page,
				limit,
				start_date: dateRange.start_date,
				end_date: dateRange.end_date,
				category: filters.category !== "all" ? filters.category : undefined,
				search: filters.searchQuery,
			});

			const activities = mapApiResponseToActivities(response);
			const summary = createSummaryFromResponse(response, activities);

			return {
				activities,
				summary,
				pagination: response.meta
					? {
							current_page: response.meta.current_page,
							total_pages: response.meta.last_page,
							total_items: response.meta.total,
							items_per_page: response.meta.per_page,
						}
					: undefined,
				raw: response,
			};
		},
		staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
		gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
		retry: false, // No retry needed - instant error in dev/staging
		refetchOnMount: false, // Don't refetch on component mount if data exists
		refetchOnWindowFocus: false, // Don't refetch when window regains focus
	});
}

/**
 * Hook to fetch single audit log detail
 */
export function useAuditLogDetailQuery(id: string) {
	return useQuery({
		queryKey: auditLogQueryKeys.detail(id),
		queryFn: async () => {
			const response = await auditLogApi.getAuditLogById(id);
			const activities = mapApiResponseToActivities(response);
			return activities[0] || null;
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
	});
}
