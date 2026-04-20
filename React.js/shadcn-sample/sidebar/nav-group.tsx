import { ChevronRight } from "lucide-react";
import React, { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/shared/components/ui/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/shared/components/ui/sidebar";
import type { NavGroup as NavGroupProps, NavItem } from "./types";

// Extended types for nav items with collapsible functionality
interface NavLink extends NavItem {
	url: string;
	items?: never;
}

interface NavCollapsible extends NavItem {
	items: NavItem[];
}

export function NavGroup({ title, items }: NavGroupProps) {
	const { state, isMobile } = useSidebar();
	const location = useLocation();
	const href = location.pathname;
	return (
		<SidebarGroup>
			{title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
			<SidebarMenu>
				{items.map((item) => {
					const key = `${item.title}-${item.url || "no-url"}`;

					if (!item.items) return <SidebarMenuLink key={key} item={item as NavLink} href={href} />;

					if (state === "collapsed" && !isMobile)
						return (
							<SidebarMenuCollapsedDropdown key={key} item={item as NavCollapsible} href={href} />
						);

					return <SidebarMenuCollapsible key={key} item={item as NavCollapsible} href={href} />;
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavBadge({ children }: { children: ReactNode }) {
	return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

// Preload module based on route
const preloadRoute = (url: string) => {
	// Preload specific routes on hover (excluding dashboard and services which are no longer lazy)
	switch (url) {
		case "/members":
			import("@/modules/members").catch(() => {});
			break;
		case "/bank-accounts":
			import("@/modules/bank-accounts").catch(() => {});
			break;
		case "/reports/transactions":
			import("@/modules/reports/transactions").catch(() => {});
			break;
		case "/reports/account-statement":
			import("@/modules/reports/account-statement").catch(() => {});
			break;
		case "/audit-log":
			import("@/modules/audit-log").catch(() => {});
			break;
		// Add more routes as needed
		// Note: Dashboard and Services are no longer lazy loaded
	}
};

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
	const { setOpenMobile } = useSidebar();

	// Handle external links
	if (item.external || item.url?.startsWith("http")) {
		const handleExternalClick = (e: React.MouseEvent) => {
			e.preventDefault();
			if (item.url) {
				const target = item.openInNewTab ? "_blank" : "_self";
				const features = item.openInNewTab ? "noopener,noreferrer" : undefined;
				window.open(item.url, target, features);
			}
			setOpenMobile(false);
		};

		return (
			<SidebarMenuItem>
				<SidebarMenuButton asChild isActive={false} tooltip={item.title}>
					<a
						href={item.url}
						onClick={handleExternalClick}
						rel={item.openInNewTab ? "noopener noreferrer" : undefined}
					>
						{item.icon && React.isValidElement(item.icon) ? item.icon : null}
						<span>{item.title}</span>
						{item.badge && <NavBadge>{item.badge}</NavBadge>}
					</a>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	}

	// Handle internal links
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={checkIsActive(href, item)} tooltip={item.title}>
				<Link
					to={item.url}
					onClick={() => setOpenMobile(false)}
					onMouseEnter={() => preloadRoute(item.url)}
				>
					{item.icon &&
						(React.isValidElement(item.icon)
							? item.icon
							: React.createElement(item.icon as React.ElementType, { className: "h-4 w-4" }))}
					<span>{item.title}</span>
					{item.badge && <NavBadge>{item.badge}</NavBadge>}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

function SidebarMenuCollapsible({ item, href }: { item: NavCollapsible; href: string }) {
	const { setOpenMobile } = useSidebar();
	return (
		<Collapsible
			asChild
			defaultOpen={checkIsActive(href, item, true)}
			className="group/collapsible"
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={item.title}>
						{item.icon && React.isValidElement(item.icon) ? item.icon : null}
						<span>{item.title}</span>
						{item.badge && <NavBadge>{item.badge}</NavBadge>}
						<ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent className="CollapsibleContent">
					<SidebarMenuSub>
						{item.items.map((subItem) => (
							<SidebarMenuSubItem key={subItem.title}>
								<SidebarMenuSubButton asChild isActive={checkIsActive(href, subItem)}>
									{subItem.external || subItem.url?.startsWith("http") ? (
										<a
											href={subItem.url || "#"}
											onClick={(e) => {
												e.preventDefault();
												if (subItem.url) {
													const target = subItem.openInNewTab ? "_blank" : "_self";
													const features = subItem.openInNewTab ? "noopener,noreferrer" : undefined;
													window.open(subItem.url, target, features);
												}
												setOpenMobile(false);
											}}
											rel={subItem.openInNewTab ? "noopener noreferrer" : undefined}
										>
											{subItem.icon && React.isValidElement(subItem.icon) ? subItem.icon : null}
											<span>{subItem.title}</span>
											{subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
										</a>
									) : (
										<Link
											to={subItem.url || "#"}
											onClick={() => setOpenMobile(false)}
											onMouseEnter={() => subItem.url && preloadRoute(subItem.url)}
										>
											{subItem.icon && React.isValidElement(subItem.icon) ? subItem.icon : null}
											<span>{subItem.title}</span>
											{subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
										</Link>
									)}
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}

function SidebarMenuCollapsedDropdown({ item, href }: { item: NavCollapsible; href: string }) {
	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton tooltip={item.title} isActive={checkIsActive(href, item)}>
						{item.icon && React.isValidElement(item.icon) ? item.icon : null}
						<span>{item.title}</span>
						{item.badge && <NavBadge>{item.badge}</NavBadge>}
						<ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="right" align="start" sideOffset={4}>
					<DropdownMenuLabel>
						{item.title} {item.badge ? `(${item.badge})` : ""}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{item.items.map((sub) => (
						<DropdownMenuItem key={`${sub.title}-${sub.url || "no-url"}`} asChild>
							{sub.external || sub.url?.startsWith("http") ? (
								<a
									href={sub.url || "#"}
									onClick={(e) => {
										e.preventDefault();
										if (sub.url) {
											const target = sub.openInNewTab ? "_blank" : "_self";
											const features = sub.openInNewTab ? "noopener,noreferrer" : undefined;
											window.open(sub.url, target, features);
										}
									}}
									rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
									className={`${checkIsActive(href, sub) ? "bg-secondary" : ""}`}
								>
									{sub.icon && React.isValidElement(sub.icon) ? sub.icon : null}
									<span className="max-w-52 text-wrap">{sub.title}</span>
									{sub.badge && <span className="ms-auto text-xs">{sub.badge}</span>}
								</a>
							) : (
								<Link
									to={sub.url || "#"}
									className={`${checkIsActive(href, sub) ? "bg-secondary" : ""}`}
									onMouseEnter={() => sub.url && preloadRoute(sub.url)}
								>
									{sub.icon && React.isValidElement(sub.icon) ? sub.icon : null}
									<span className="max-w-52 text-wrap">{sub.title}</span>
									{sub.badge && <span className="ms-auto text-xs">{sub.badge}</span>}
								</Link>
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
	if (!item.url) return false;

	// External links are never active in terms of internal routing
	if (item.external || item.url.startsWith("http")) return false;

	return (
		href === item.url || // /endpoint?search=param
		href.split("?")[0] === item.url || // endpoint
		!!item?.items?.filter((i) => i.url && i.url === href).length || // if child nav is active
		(mainNav && href.split("/")[1] !== "" && href.split("/")[1] === item.url.split("/")[1])
	);
}
