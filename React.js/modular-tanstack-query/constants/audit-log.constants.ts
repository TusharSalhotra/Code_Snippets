import { Calendar } from "lucide-react";
import type { AuditLogFilterOption } from "../types/audit-log.types";

export const TIME_FILTER_OPTIONS: AuditLogFilterOption[] = [
	{ value: "today", label: "Today" },
	{ value: "7d", label: "7d" },
	{ value: "30d", label: "30d" },
	{ value: "90d", label: "90d" },
	{ value: "custom", label: "Custom", icon: Calendar },
];

export const CATEGORY_FILTER_OPTIONS: AuditLogFilterOption[] = [];

export const ACTION_LABELS: Record<string, string> = {
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
	login: "User Login",
	logout: "User Logout",
};

// Map actual API actions to display labels
export const API_ACTION_LABELS: Record<string, string> = {
	"View Transactions": "Viewed Transactions",
	"Check Balance": "Checked Balance",
	"View Products": "Viewed Products",
	Login: "Logged In",
	Logout: "Logged Out",
};

export const EMPTY_STATE_MESSAGES = {
	title: "No Activity Yet",
	description: "Activities in your organization will appear here",
};
