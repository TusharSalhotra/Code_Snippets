import Clients from "features/clients/Clients";
import { Dashboard } from "features/dashboard/Dashboard";
import MachineTypes from "features/machine-types/MachineTypes";
import Templates from "features/templates/Templates";
import Stages from "features/stages/Stages";
import Users from "features/users/Users";
import RolesAndPermissions from "features/roles-and-permissions/RolesAndPermissions";
import Technician from "features/technician/technician";
import TechnicianProductivePoints from "features/technician-productive-parts/technicianProductivePoints";
import Organizations from "features/organizations/organizations";

import { lazy } from "react";
import { RoutePath } from ".";
import AccordionExampleNested from "features/questions/QuestionsList";
import JobDetails from "features/reports/JobDetails";
import JobHours from "features/reports/JobHours";
import JobInventory from "features/reports/JobInventory";
import BecPerformance from "features/reports/BecPerformance";
import JobList from "features/job-list/JobList";

const Profile = lazy(() => import("../features/profile/Profile"));
const GlobalCodeCategory = lazy(() => import("features/global-code-category/GlobalCodeCategory"));
const GlobalCode = lazy(() => import("features/global-code/GlobalCode"));
const Machines = lazy(() => import("../features/machines/Machines"));
const JobType = lazy(() => import("../features/job-type/JobType"));
const Inventory = lazy(() => import("../features/inventory/Inventory"));
const AdditionalWorkHours = lazy(
  () => import("../features/additional-work-hours/AdditionalWorkHours"),
);
const Holidays = lazy(() => import("../features/holiday/Holiday"));
const Segments = lazy(() => import("../features/segments/Segments"));
const Part = lazy(() => import("../features/part/Part"));
const TimeTable = lazy(() => import("../features/time-table/TimeTable"));
const ScopeOfWork = lazy(() => import("../features/scope-of-work/ScopeOfWork"));

export enum LayoutTypes {
  Public = "Public",
  Private = "Private",
}

const PrivateRoutes: RoutePath[] = [
  {
    path: "/profile",
    element: Profile,
    type: LayoutTypes.Private,
  },
  {
    path: "/category-codes",
    element: GlobalCodeCategory,
    type: LayoutTypes.Private,
  },
  {
    path: "/global-codes",
    element: GlobalCode,
    type: LayoutTypes.Private,
  },
  {
    path: "/machines",
    element: Machines,
    type: LayoutTypes.Private,
  },
  {
    path: "/users",
    element: Users,
    type: LayoutTypes.Private,
  },
  {
    path: "/machine-types",
    element: MachineTypes,
    type: LayoutTypes.Private,
  },
  {
    path: "/job-types",
    element: JobType,
    type: LayoutTypes.Private,
  },
  {
    path: "/inventory",
    element: Inventory,
    type: LayoutTypes.Private,
  },
  {
    path: "/additional-work-hours",
    element: AdditionalWorkHours,
    type: LayoutTypes.Private,
  },
  {
    path: "/holidays",
    element: Holidays,
    type: LayoutTypes.Private,
  },
  {
    path: "/segments",
    element: Segments,
    type: LayoutTypes.Private,
  },
  {
    path: "/parts",
    element: Part,
    type: LayoutTypes.Private,
  },
  {
    path: "/clients",
    element: Clients,
    type: LayoutTypes.Private,
  },
  {
    path: "/time-table",
    element: TimeTable,
    type: LayoutTypes.Private,
  },
  {
    path: "/scope-of-work",
    element: ScopeOfWork,
    type: LayoutTypes.Private,
  },
  {
    path: "/stages",
    element: Stages,
    type: LayoutTypes.Private,
  },
  {
    path: "/dashboard",
    element: Dashboard,
    type: LayoutTypes.Private,
  },
  {
    path: "/questions",
    element: AccordionExampleNested,
    type: LayoutTypes.Private,
  },
  {
    path: "/templates",
    element: Templates,
    type: LayoutTypes.Private,
  },
  {
    path: "/roles-permissions",
    element: RolesAndPermissions,
    type: LayoutTypes.Private,
  },
  {
    path: "/technician",
    element: Technician,
    type: LayoutTypes.Private,
  },
  {
    path: "/technicianpoints",
    element: TechnicianProductivePoints,
    type: LayoutTypes.Private,
  },
  {
    path: "/job-details",
    element: JobDetails,
    type: LayoutTypes.Private,
  },
  {
    path: "/job-hours",
    element: JobHours,
    type: LayoutTypes.Private,
  },
  {
    path: "/job-inventory",
    element: JobInventory,
    type: LayoutTypes.Private,
  },
  {
    path: "/abc-performance",
    element: BecPerformance,
    type: LayoutTypes.Private,
  },
  {
    path: "/jobs-list",
    element: JobList,
    type: LayoutTypes.Private,
  },
  {
    path: "/organizations",
    element: Organizations,
    type: LayoutTypes.Private,
  },
];

export default PrivateRoutes;
