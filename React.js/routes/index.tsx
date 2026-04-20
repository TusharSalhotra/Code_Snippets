import Loader from "components/elements/Loader";
import { FC, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import AuthenticatedLayout from "../components/layouts/AuthenticatedLayout";
import UnAuthenticatedLayout from "../components/layouts/UnAuthenticatedLayout";
import PrivateRoutes, { LayoutTypes } from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

export type RoutePath = {
  path: string;
  element: FC;
  type: LayoutTypes;
};

const getJSX = (Component: FC, type: LayoutTypes) => {
  switch (type) {
    case LayoutTypes.Private:
      return (
        <AuthenticatedLayout>
          <Suspense fallback={<Loader />}>
            <Component />
          </Suspense>
        </AuthenticatedLayout>
      );

    default:
      return (
        <Suspense fallback={<Loader />}>
          <UnAuthenticatedLayout>
            <Component />
          </UnAuthenticatedLayout>
        </Suspense>
      );
  }
};

const routes: RoutePath[] = [...PrivateRoutes, ...PublicRoutes];

const BaseRoutes = () => {
  return (
    <Routes>
      {routes.map(({ path, element, type }, index) => {
        return <Route key={index} path={path} element={getJSX(element, type)} />;
      })}
    </Routes>
  );
};

export default BaseRoutes;
