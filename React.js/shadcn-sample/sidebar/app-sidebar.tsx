import type React from "react";
import { useMemo } from "react";
import { filterNavigationByPermissions } from "@/shared/auth";
import { isSidebarItemVisible } from "@/shared/auth/roles";
import Footer from "@/shared/components/footer";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarRail,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "@/shared/contexts/auth-context";
import { config } from "@/shared/lib/config";
import { type FeatureFlag, isFeatureEnabled } from "@/shared/lib/feature-flags";
import { NavGroup } from "./nav-group";
import { navigationConfig } from "./sidebar-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user, permissions } = useAuth();

	// Filter navigation items based on user permissions and role
	const filteredNavigation = useMemo(() => {
		if (!user || !permissions) return [];

		// Filter items based on permissions
		let filtered = filterNavigationByPermissions(navigationConfig, permissions);

		// Additional filtering based on role configuration
		if (user.role) {
			filtered = filtered.filter((item) => {
				// Map navigation titles to sidebar item keys for role-based hiding
				const itemKey = item.title.toLowerCase().replace(/ /g, "-");
				return isSidebarItemVisible(user.role!, itemKey);
			});
		}

		// Filter based on feature flags
		filtered = filtered.filter((item) => {
			if (item.featureFlag) {
				return isFeatureEnabled(item.featureFlag as FeatureFlag);
			}
			return true;
		});

		return filtered;
	}, [user, permissions]);

	// Convert filtered navigation to nav groups format
	const navGroups = useMemo(() => {
		return [
			{
				title: "",
				items: filteredNavigation.map((item) => ({
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
	}, [filteredNavigation]);

	return (
		<Sidebar collapsible="none" className="fixed left-0 top-0 h-screen z-40" {...props}>
			<SidebarHeader>
				<div className="flex h-12 items-center px-4">
					<img src="/square-logo.png" alt="IIMMPACT" className="h-10 w-10" />
					<span className="ml-2 text-lg font-semibold text-[var(--color-brand-primary)]">
						IIMMPACT
					</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						{navGroups.map((props) => (
							<NavGroup key={props.title} {...props} />
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<Footer />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
