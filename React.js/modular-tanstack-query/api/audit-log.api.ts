import apiClient from "@/shared/lib/api-client";
import type { AuditLogApiRequest, AuditLogApiResponse } from "./audit-log.types";

// API Endpoints
const AUDIT_LOG_ENDPOINTS = {
	LIST: "/v2/audit-logs",
	DETAIL: "/v2/audit-logs/{id}",
} as const;

/**
 * Audit Log API Service
 */
export const auditLogApi = {
	/**
	 * Fetch audit logs with filters
	 */
	async getAuditLogs(params: AuditLogApiRequest = {}): Promise<AuditLogApiResponse> {
		const queryParams = new URLSearchParams();

		// Add pagination params
		if (params.page) queryParams.append("page", params.page.toString());
		if (params.limit) queryParams.append("limit", params.limit.toString());

		// Add date filters
		if (params.start_date) queryParams.append("start_date", params.start_date);
		if (params.end_date) queryParams.append("end_date", params.end_date);

		// Add timezone (default to Asia/Kuala_Lumpur for Malaysia)
		queryParams.append("timezone", params.timezone || "Asia/Kuala_Lumpur");

		// Add category filter if present
		if (params.category) queryParams.append("category", params.category);

		// Add search query if present
		if (params.search) queryParams.append("search", params.search);

		const url = `${AUDIT_LOG_ENDPOINTS.LIST}?${queryParams.toString()}`;

		try {
			const response = await apiClient.get<AuditLogApiResponse>(url);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch audit logs:", error);
			throw error;
		}
	},

	/**
	 * Get single audit log detail
	 */
	async getAuditLogById(id: string): Promise<AuditLogApiResponse> {
		const url = AUDIT_LOG_ENDPOINTS.DETAIL.replace("{id}", id);

		try {
			const response = await apiClient.get<AuditLogApiResponse>(url);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch audit log detail:", error);
			throw error;
		}
	},
};
