import { ErrorPage } from "@/components/common";
import { CaseManagementLayout } from "./components/case-management-layout";

const case_management_routes = {
  Root: "case-management",
  Case_Files: "case-files",
  Case_Loads: "case-loads",
};

export const caseManagementRoutes = [
  {
    path: case_management_routes.Root,
    errorElement: <ErrorPage />,
    loader: async () => await Promise.resolve(null),
    element: <CaseManagementLayout />,
    children: [
      {
        path: case_management_routes.Case_Files,
        errorElement: <ErrorPage />,
        loader: async () => await Promise.resolve(null),
        element: <div>Case Files</div>,
      },
      {
        path: case_management_routes.Case_Loads,
        errorElement: <ErrorPage />,
        loader: async () => await Promise.resolve(null),
        element: <div>Case Loads</div>,
      },
    ],
  },
];
