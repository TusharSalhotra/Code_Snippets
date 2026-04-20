import { RoutePath } from ".";
import { lazy } from "react";
import { LayoutTypes } from "./PrivateRoutes";

const Login = lazy(() => import("../features/login/Login"));

const PublicRoutes: RoutePath[] = [
  {
    path: "/login",
    element: Login,
    type: LayoutTypes.Public,
  },
  {
    path: "/sitemap.xml",
    element: Login,
    type: LayoutTypes.Public,
  },
];

export default PublicRoutes;
