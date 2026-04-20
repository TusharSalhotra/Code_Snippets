import React from "react";
import type { RouteObject } from "react-router-dom";
import { ErrorPage } from "@/components/common";

// Layout
import { AdministrationLayout } from "./components/administration-layout";
import { globalCodesService } from "./global-codes";

// Lazy load the Sub-Modules
const GlobalCodesModule = React.lazy(() =>
  import("./global-codes").then((module) => ({
    default: module.GlobalCodesLayout,
  })),
);

// Routes for the administration module
export const admin_routes = {
  Administration: "administration",
  Global_Codes: "global-codes",
};

// Export the routes for the administration module
export const administrationRoutes: RouteObject[] = [
  {
    id: admin_routes.Administration,
    path: admin_routes.Administration,
    errorElement: <ErrorPage />,
    loader: async () => await Promise.resolve(null),
    element: <AdministrationLayout />,
    children: [
      {
        id: admin_routes.Global_Codes,
        path: admin_routes.Global_Codes,
        loader: async () => await globalCodesService.getCategories(),
        errorElement: <ErrorPage />,
        element: <GlobalCodesModule />,
      },
    ],
  },
];
