import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
	title: string;
	url?: string;
	icon?: LucideIcon | ReactNode;
	isActive?: boolean;
	badge?: string;
	items?: NavItem[];
	external?: boolean; // Flag to indicate external link
	openInNewTab?: boolean; // Flag to open in new tab
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}
