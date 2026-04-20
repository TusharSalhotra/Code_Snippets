export interface AuditLogActivity {
	id: string;
	timestamp: Date;
	user: {
		id: string;
		name: string;
		email?: string;
		avatar?: string;
	};
	action: AuditLogAction;
	details: string;
	metadata?: Record<string, any>;
	ipAddress?: string;
	userAgent?: string;
}

export type AuditLogAction =
	| "payment_created"
	| "payment_updated"
	| "payment_deleted"
	| "member_invited"
	| "member_removed"
	| "member_updated"
	| "rewards_earned"
	| "rewards_redeemed"
	| "credits_added"
	| "credits_used"
	| "settings_updated"
	| "login"
	| "logout";

export type AuditLogCategory = "payment" | "membership" | "rewards" | "credits" | "all";

export type AuditLogTimeFilter = "today" | "7d" | "30d" | "90d" | "custom";

export interface AuditLogFilter {
	timeFilter: AuditLogTimeFilter;
	category?: AuditLogCategory;
	startDate?: Date;
	endDate?: Date;
	searchQuery?: string;
}

export interface AuditLogSummary {
	totalActivities: number;
	lastUserAction: {
		userName: string;
		action: string;
		timestamp: Date;
	} | null;
	lastActivity: {
		date: Date;
		description: string;
		amount?: number;
	} | null;
}

export interface AuditLogFilterOption {
	value: AuditLogTimeFilter | AuditLogCategory;
	label: string;
	icon?: React.ComponentType<{ className?: string }>;
}
