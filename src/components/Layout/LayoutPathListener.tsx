import { Navigate, useLocation } from "@tanstack/react-router";

import { AuthStatus, useAuthStatus } from "stores/auth.store";

const openPaths = ["/", "/auth"];
const onlyUnauthenticatedPaths = ["/auth"];

export function LayoutPathListener() {
  const { pathname } = useLocation();
  const authStatus = useAuthStatus();

  if (
    authStatus === AuthStatus.Unauthenticated &&
    !openPaths.includes(pathname)
  ) {
    return <Navigate to={"/auth"} />;
  }
  if (
    authStatus === AuthStatus.Authenticated &&
    onlyUnauthenticatedPaths.includes(pathname)
  ) {
    return <Navigate to={"/games"} />;
  }

  return <></>;
}
