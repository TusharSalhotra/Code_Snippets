import type { AuditLogActivity, AuditLogSummary } from "../types/audit-log.types";
import type { AuditLogApiItem, AuditLogApiResponse } from "./audit-log.types";

/**
 * Maps API response item to domain model
 */
export function mapApiItemToActivity(apiItem: AuditLogApiItem, index?: number): AuditLogActivity {
	// Parse timestamp - format: "2025-09-30 12:58:58 +08"
	const parsedDate = new Date(apiItem.timestamp.replace(" +08", "+08:00"));

	// Create a unique ID by combining event_id with timestamp and index
	// This handles cases where event_id might not be unique
	const uniqueId = `${apiItem.event_id}_${apiItem.timestamp}_${index ?? Math.random()}`;

	return {
		id: uniqueId,
		timestamp: parsedDate,
		user: {
			id: apiItem.user_name, // Using username as ID since no user_id in response
			name: apiItem.user_name,
			email: undefined, // Email not provided in response
		},
		action: mapActionType(apiItem.action_type, apiItem.action),
		details: apiItem.description,
		metadata: {
			phone_number: apiItem.phone_number,
			action_result: apiItem.action_result,
			action_type: apiItem.action_type,
			action: apiItem.action,
			is_from_cognito: apiItem.is_from_cognito,
			is_from_dashboard: apiItem.is_from_dashboard,
		},
		ipAddress: apiItem.ip_address,
		userAgent: apiItem.user_device,
	};
}

/**
 * Maps API action type to domain action type
 */
function mapActionType(actionType: string, action: string): any {
	// Map based on action_type and action combination
	if (actionType === "Transaction") {
		if (action.includes("View")) return "payment_created";
		return "payment_created";
	} else if (actionType === "Account") {
		if (action.includes("Balance")) return "payment_updated";
		return "settings_updated";
	} else if (actionType === "Product") {
		if (action.includes("View")) return "payment_created";
		return "payment_created";
	} else if (actionType === "Auth") {
		if (action.includes("Login")) return "login";
		if (action.includes("Logout")) return "logout";
		return "login";
	}

	// Default mapping
	return "settings_updated";
}

/**
 * Maps API response to audit log activities
 */
export function mapApiResponseToActivities(response: AuditLogApiResponse): AuditLogActivity[] {
	if (!response.data || !Array.isArray(response.data)) {
		return [];
	}

	return response.data.map((item, index) => mapApiItemToActivity(item, index));
}

/**
 * Creates summary from API response
 */
export function createSummaryFromResponse(
	response: AuditLogApiResponse,
	activities: AuditLogActivity[],
): AuditLogSummary {
	const lastActivity = activities[0];
	const lastUserAction = activities.find((a) => a.user.name && a.action);

	return {
		totalActivities: response.meta?.total || activities.length,
		lastUserAction: lastUserAction
			? {
					userName: lastUserAction.user.name,
					action: formatActionDisplay(lastUserAction.action),
					timestamp: lastUserAction.timestamp,
				}
			: null,
		lastActivity: lastActivity
			? {
					date: lastActivity.timestamp,
					description: lastActivity.details,
					amount: extractAmountFromDetails(lastActivity.details),
				}
			: null,
	};
}

/**
 * Formats action for display
 */
function formatActionDisplay(action: string): string {
	const displayMap: Record<string, string> = {
		payment_created: "Payment Created",
		payment_updated: "Payment Updated",
		payment_deleted: "Payment Deleted",
		member_invited: "Member Invited",
		member_removed: "Member Removed",
		member_updated: "Member Updated",
		rewards_earned: "Rewards Earned",
		rewards_redeemed: "Rewards Redeemed",
		credits_added: "Credits Added",
		credits_used: "Credits Used",
		settings_updated: "Settings Updated",
		login: "Logged In",
		logout: "Logged Out",
	};

	return displayMap[action] || action;
}

/**
 * Extracts amount from activity details if present
 */
function extractAmountFromDetails(details: string): number | undefined {
	// Try to extract amount from strings like "Created payment of RM 505.94"
	const match = details.match(/RM\s*([\d,]+\.?\d*)/);
	if (match) {
		return parseFloat(match[1].replace(",", ""));
	}
	return undefined;
}
