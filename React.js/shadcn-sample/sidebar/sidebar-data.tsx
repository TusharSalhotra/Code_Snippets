import {
	AlertTriangle,
	BarChart3,
	Bell,
	BookOpen,
	ChartBar,
	ClipboardList,
	CreditCard,
	DollarSign,
	FileText,
	History,
	Home,
	Package,
	PlusCircle,
	Receipt,
	Settings,
	ShoppingBag,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react";
import { type NavigationItem, PERMISSIONS } from "@/shared/auth";
import { AppRoutes } from "@/shared/utils/app-routes";

export const navigationConfig: NavigationItem[] = [
	{
		title: "Dashboard",
		icon: <Home className="h-4 w-4" />,
		href: AppRoutes.dashboard,
		permission: PERMISSIONS.DASHBOARD.VIEW,
	},
	{
		title: "Business Insights",
		icon: <TrendingUp className="h-4 w-4" />,
		href: AppRoutes.businessInsights,
		permission: PERMISSIONS.DASHBOARD.VIEW,
		featureFlag: "businessInsights.module",
	},
	{
		title: "Digital Marketplace",
		icon: <ShoppingBag className="h-4 w-4" />,
		href: AppRoutes.services,
		permission: PERMISSIONS.SERVICES.VIEW,
	},
	{
		title: "Batch Payment",
		icon: <Upload className="h-4 w-4" />,
		href: AppRoutes.batchPayment,
		permission: PERMISSIONS.BATCH_PAYMENT.VIEW,
	},
	{
		title: "Members",
		icon: <Users className="h-4 w-4" />,
		href: AppRoutes.members,
		permission: PERMISSIONS.MEMBERS.VIEW,
		featureFlag: "members.module",
	},
	{
		title: "Alerts & Notifications",
		icon: <Bell className="h-4 w-4" />,
		href: AppRoutes.alerts,
		permission: PERMISSIONS.DASHBOARD.VIEW, // Using existing permission for Phase 1
	},
	{
		title: "Transactions",
		icon: <CreditCard className="h-4 w-4" />,
		href: AppRoutes.transactions,
		permission: PERMISSIONS.TRANSACTIONS.VIEW,
	},
	{
		title: "E-Invoice",
		icon: <Receipt className="h-4 w-4" />,
		href: AppRoutes.eInvoice,
		permission: PERMISSIONS.E_INVOICE.VIEW,
	},
	{
		title: "Reports",
		icon: <BarChart3 className="h-4 w-4" />,
		href: AppRoutes.transactionSummary, // Parent item, no direct navigation
		permissions: [
			PERMISSIONS.REPORTS.TRANSACTION_SUMMARY_VIEW,
			PERMISSIONS.REPORTS.BALANCE_STATEMENTS_VIEW,
		],
		requireAll: false, // Show if user has any of these permissions
		children: [
			{
				title: "Transaction Summary",
				icon: <FileText className="h-4 w-4" />,
				href: AppRoutes.transactionSummary,
				permission: PERMISSIONS.REPORTS.TRANSACTION_SUMMARY_VIEW,
			},
			{
				title: "Balance Statements",
				icon: <ChartBar className="h-4 w-4" />,
				href: AppRoutes.accountStatement,
				permission: PERMISSIONS.REPORTS.BALANCE_STATEMENTS_VIEW,
			},
		],
	},
	{
		title: "Products",
		icon: <Package className="h-4 w-4" />,
		href: AppRoutes.priceList, // Default to price list when clicked
		permissions: [
			PERMISSIONS.PRODUCTS.PRICE_LIST_VIEW,
			PERMISSIONS.PRODUCTS.SERVICE_INTERRUPTION_VIEW,
		],
		requireAll: false, // Show if user has any of these permissions
		children: [
			{
				title: "Price List",
				icon: <DollarSign className="h-4 w-4" />,
				href: AppRoutes.priceList,
				permission: PERMISSIONS.PRODUCTS.PRICE_LIST_VIEW,
			},
			{
				title: "Service Status",
				icon: <AlertTriangle className="h-4 w-4" />,
				href: AppRoutes.serviceInterruption,
				permission: PERMISSIONS.PRODUCTS.SERVICE_INTERRUPTION_VIEW,
			},
		],
	},
	{
		title: "Developer",
		icon: <Settings className="h-4 w-4" />,
		href: AppRoutes.apiSettings, // Default to API settings when clicked
		permissions: [PERMISSIONS.API.SETTINGS_VIEW, PERMISSIONS.API.DOCS_VIEW],
		requireAll: false, // Show if user has any of these permissions
		children: [
			{
				title: "API Settings",
				icon: <Settings className="h-4 w-4" />,
				href: AppRoutes.apiSettings,
				permission: PERMISSIONS.API.SETTINGS_VIEW,
			},
			{
				title: "API Documentation",
				icon: <BookOpen className="h-4 w-4" />,
				href: AppRoutes.apiDocs,
				permission: PERMISSIONS.API.DOCS_VIEW,
			},
		],
	},
	{
		title: "Case History",
		icon: <History className="h-4 w-4" />,
		href: "https://support.iimmpact.com/en/tickets-portal",
		external: true,
		openInNewTab: true,
		// No permission required for now - support functionality
	},
	{
		title: "Audit Log",
		icon: <ClipboardList className="h-4 w-4" />,
		href: AppRoutes.auditLog,
		permission: PERMISSIONS.AUDIT.VIEW,
	},
];

export const navGroups = [
	{
		title: "", // Removed "Main Navigation" as requested
		items: navigationConfig.map((item) => ({
			title: item.title,
			url: item.href,
			icon: item.icon,
			external: item.external,
			openInNewTab: item.openInNewTab,
			items: item.children?.map((child) => ({
				title: child.title,
				url: child.href,
				icon: child.icon,
				external: child.external,
				openInNewTab: child.openInNewTab,
			})),
		})),
	},
];
