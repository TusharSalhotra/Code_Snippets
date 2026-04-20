import { lazy } from "react";
import type { RouteModule } from "@/router/types";
import { AppRoutes } from "@/shared";

export const auditLogRoutes = [
	{
		path: AppRoutes.auditLog,
		element: lazy(() => import("./index")),
		title: "Audit Log",
		loadingMessageKey: "auditLog",
		protected: true,
		permission: "audit.view",
	},
];

export const auditLogModule: RouteModule = {
	name: "auditLog",
	routes: auditLogRoutes,
};
