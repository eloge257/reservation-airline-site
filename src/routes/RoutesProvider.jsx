import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
const RootPage = lazy(() => import("../pages/home/RootPage"));
import SlimTopLoading from "../components/app/SlimTopLoading";
import horaire_routes from "./Ghoraire/horaire_routes";

const NotFound = lazy(() => import("../pages/home/NotFound"));

export default function RoutesProvider() {
  return (
    <Suspense fallback={<SlimTopLoading />}>
      <Routes>
        <Route path="/" Component={RootPage}></Route>
        {horaire_routes}
        <Route Component={NotFound} path="*" />
      </Routes>
    </Suspense>
  );
}
