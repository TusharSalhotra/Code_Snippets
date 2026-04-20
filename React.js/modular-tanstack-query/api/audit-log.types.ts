// API Request Types
export interface AuditLogApiRequest {
	page?: number;
	limit?: number;
	start_date?: string; // ISO date string
	end_date?: string; // ISO date string
	timezone?: string;
	category?: string;
	search?: string;
}

// API Response Types
export interface AuditLogApiResponse {
	data: AuditLogApiItem[];
	links: {
		first: string;
		last: string;
		prev: string | null;
		next: string | null;
	};
	meta: {
		current_page: number;
		from: number;
		last_page: number;
		path: string;
		per_page: number;
		to: number;
		total: number;
	};
}

export interface AuditLogApiItem {
	event_id: string;
	user_name: string;
	phone_number: string;
	ip_address: string;
	action_type: string; // "Transaction", "Account", "Product", etc.
	action: string; // "View Transactions", "Check Balance", etc.
	action_result: string; // "Success", "Failed"
	description: string;
	timestamp: string; // "2025-09-30 12:58:58 +08" format
	is_from_cognito: boolean;
	user_device: string;
	is_from_dashboard: boolean;
}

// Error response type
export interface AuditLogApiError {
	success: false;
	error: {
		code: string;
		message: string;
		details?: any;
	};
}
