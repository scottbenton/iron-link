import { Outlet, createFileRoute } from "@tanstack/react-router";

import { NavBar } from "components/Layout/NavBar";
import { useNavRoutes } from "components/Layout/navRoutes";

export const Route = createFileRoute("/_defaultNavLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  const navRoutes = useNavRoutes();
  return (
    <>
      <NavBar topLevelRoutes={navRoutes} />
      <Outlet />
    </>
  );
}
