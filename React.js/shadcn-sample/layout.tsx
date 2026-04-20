import { ChevronDown, ExternalLink, Lock, LogOut, Plus, User, Wallet } from "lucide-react";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccountBalanceQuery } from "@/modules/dashboard/hooks/useAccountBalanceQuery";
import { AppRoutes, customToast, formatCurrency } from "@/shared";
import { getRoleDisplayInfo } from "@/shared/auth";
import { AppSidebar } from "@/shared/components/sidebar/app-sidebar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { useAuth } from "@/shared/contexts/auth-context";
import { config } from "@/shared/lib/config";
import { IntercomProvider } from "@/shared/lib/providers/IntercomProvider";
import { TokenManager } from "@/shared/lib/token-manager";
import { unifiedStorage } from "@/shared/lib/unified-storage";
import { FeatureToggle } from "./feature-toggle";

interface LayoutProps {
	children: React.ReactNode;
}

// Helper function to get user initials
function getUserInitials(name: string | undefined): string {
	if (!name) return "U";

	const parts = name.trim().split(" ");
	if (parts.length === 1) {
		return parts[0].substring(0, 2).toUpperCase();
	}

	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Currency formatting is now handled by shared formatter

// Main layout with header and breadcrumb
export function DashboardLayout({ children }: LayoutProps) {
	const _location = useLocation();
	const navigate = useNavigate();
	const { logout, user } = useAuth();
	const [jwtEmail, setJwtEmail] = React.useState<string | null>(null);

	// Get role display information
	const roleInfo = React.useMemo(() => {
		if (!user?.role) return null;
		return getRoleDisplayInfo(user.role);
	}, [user?.role, user?.access]);

	// Fetch account balance
	const { data: balanceData, isLoading: isBalanceLoading } = useAccountBalanceQuery();

	// Add style to remove focus outline on dropdown trigger
	React.useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
			[data-radix-collection-item]:focus-visible {
				outline: none !important;
				box-shadow: none !important;
			}
			button[data-state="open"]:focus {
				outline: none !important;
				box-shadow: none !important;
			}
			button[data-state="closed"]:focus {
				outline: none !important;
				box-shadow: none !important;
			}
		`;
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	// Get email from JWT token
	React.useEffect(() => {
		try {
			const tokenManager = TokenManager.getInstance();
			const email = tokenManager.getUserEmail();
			setJwtEmail(email);
		} catch {
			// Silently handle error
		}
	}, []); // Re-run when user changes

	// Add style to remove focus outline on dropdown trigger
	React.useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
			[data-radix-collection-item]:focus-visible {
				outline: none !important;
				box-shadow: none !important;
			}
			button[data-state="open"]:focus {
				outline: none !important;
				box-shadow: none !important;
			}
			button[data-state="closed"]:focus {
				outline: none !important;
				box-shadow: none !important;
			}
		`;
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);
	const handleLogout = async () => {
		try {
			// Immediately shutdown Intercom before logout
			try {
				const { intercomService } = await import("@/shared/lib/providers/intercom.service");
				intercomService.shutdown();
			} catch {
				// Silently handle Intercom shutdown error
			}

			await logout();
			customToast.success("Logout Successful", "You have been logged out successfully");
			navigate(AppRoutes.login);
		} catch {
			customToast.error("Logout Failed", "Session has been cleared, redirecting to login");
			// Even if logout fails, clear unified storage and redirect
			unifiedStorage.clearAllAuthData();
			navigate(AppRoutes.login);
		}
	};

	return (
		<IntercomProvider>
			<SidebarProvider defaultOpen={true}>
				<AppSidebar />
				<SidebarInset className="bg-background">
					<header className="fixed top-0 right-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-background supports px-4 transition-[width,height,left] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 left-0 md:left-64 group-data-[collapsible=icon]:md:left-12">
						<div className="flex-1" />
						<div className="ml-auto flex items-center gap-4">
							{/* Dashboard Version Switcher */}
							{/* <DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="flex items-center gap-2 h-9 px-3 text-sm font-medium bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:outline-none data-[state=open]:ring-0"
									>
										<span>Dashboard 2.0</span>
										<span className="px-1 py-0.5 text-[10px] font-medium bg-[#0891B2]/10 text-[#0891B2] rounded">
											BETA
										</span>
										<ChevronDown className="h-3.5 w-3.5 text-gray-500" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-80 p-4 bg-white border-gray-200">
									<div className="space-y-3">
										<div className="space-y-1">
											<h4 className="text-sm font-semibold">Dashboard Version</h4>
											<p className="text-sm text-gray-600">
												You're using the new Dashboard 2.0 (Beta). We're actively adding more
												features and improvements. Stay tuned for exciting updates!
											</p>
										</div>
										<div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
											<p className="text-sm text-amber-800">
												<span className="font-medium">Need to perform transactions?</span>
												<br />
												Transaction features are available in Dashboard 1.0 while we complete the
												migration.
											</p>
										</div>
										<Button
											className="w-full flex items-center justify-center gap-2 bg-[#0891B2] hover:bg-[#0891B2]/90 text-white transition-colors"
											onClick={() =>
												window.open(
													config.externalUrls.oldDashboard,
													"_blank",
													"noopener,noreferrer",
												)
											}
										>
											<span>Open Dashboard 1.0</span>
											<ExternalLink className="h-4 w-4" />
										</Button>
									</div>
								</DropdownMenuContent>
							</DropdownMenu> */}

							{/* Account Balance Display - Clickable */}
							<button
								onClick={() => navigate(AppRoutes.balance)}
								className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-[var(--color-brand-primary)] shadow-sm hover:shadow-md transition-all cursor-pointer group"
								title="Click to add balance"
							>
								<Wallet className="h-4 w-4 text-gray-600 group-hover:text-[var(--color-brand-primary)] transition-colors" />
								<span className="text-xs text-gray-500">Balance:</span>
								<span className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-brand-primary)] transition-colors">
									{isBalanceLoading
										? "Loading..."
										: balanceData
											? formatCurrency(balanceData.balance)
											: "RM 0.00"}
								</span>
								<div className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-brand-primary)]/10 group-hover:bg-[var(--color-brand-primary)]/20 transition-colors">
									<Plus className="h-3 w-3 text-[var(--color-brand-primary)] group-hover:rotate-90 transition-all duration-300" />
								</div>
							</button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="flex items-center gap-2 h-auto p-2 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
									>
										<div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white font-semibold text-sm">
											{getUserInitials(user?.name)}
										</div>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<div className="flex items-center gap-2">
												<span className="truncate font-semibold">{user?.name || "User"}</span>
												{roleInfo && (
													<Badge
														variant="secondary"
														className={`text-[10px] px-2 py-0.5 h-5 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20 rounded-md`}
													>
														{roleInfo.name}
													</Badge>
												)}
											</div>
											<span className="truncate text-xs text-muted-foreground">
												{jwtEmail || user?.email}
											</span>
										</div>
										<ChevronDown className="h-4 w-4 text-muted-foreground" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56 border-gray-200 shadow-lg p-1">
									{/* User Info Section */}
									<div className="mx-1 px-3 py-3 border-b border-gray-100">
										<div className="flex items-start gap-2">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<p className="text-sm font-medium truncate">{user?.name || "User"}</p>
													{roleInfo && (
														<Badge
															variant="outline"
															className={`text-[10px] px-2 py-0.5 rounded-md flex-shrink-0 ${
																user?.role === "admin"
																	? "bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]/30"
																	: "bg-[var(--color-brand-accent)]/5 text-[var(--color-brand-accent)] border-[var(--color-brand-accent)]/30"
															}`}
														>
															{roleInfo.name}
														</Badge>
													)}
												</div>
												<p className="text-xs text-muted-foreground truncate">
													{jwtEmail || user?.email}
												</p>
											</div>
										</div>
									</div>
									<div className="py-1">
										<DropdownMenuItem
											onClick={() => {
												navigate(AppRoutes.changePassword);
											}}
											className="cursor-pointer mx-1 rounded-md hover:bg-gray-100 focus:bg-gray-100 transition-all duration-150 group"
										>
											<Lock className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
											<span className="group-hover:text-gray-900 transition-colors">
												Change Password
											</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="cursor-pointer mx-1 rounded-md hover:bg-gray-100 focus:bg-gray-100 transition-all duration-150 group"
											onClick={() => navigate(AppRoutes.profile)}
										>
											<User className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
											<span className="group-hover:text-gray-900 transition-colors">Profile</span>
										</DropdownMenuItem>
									</div>
									<DropdownMenuSeparator className="bg-gray-200 my-1" />
									<div className="py-1">
										<DropdownMenuItem
											className="cursor-pointer mx-1 rounded-md hover:bg-red-50 focus:bg-red-50 transition-all duration-150 group text-gray-700 hover:text-red-600"
											onClick={handleLogout}
										>
											<LogOut className="mr-2 h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
											<span className="group-hover:text-red-600 transition-colors">Log out</span>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</header>
					<div className="flex flex-col min-h-screen bg-background pt-16">
						<div className="flex-1 p-4 bg-background ml-[255px]">{children}</div>
					</div>
				</SidebarInset>
				<FeatureToggle />
			</SidebarProvider>
		</IntercomProvider>
	);
}
