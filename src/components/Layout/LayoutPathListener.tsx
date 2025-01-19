import { Navigate, useLocation, useSearch } from "@tanstack/react-router";

import { AuthStatus, useAuthStatus, useUID } from "stores/auth.store";
import { useUserNameWithStatus } from "stores/users.store";

import { UserNameDialog } from "./UserNameDialog";

const openPaths = ["/", "/auth"];
const onlyUnauthenticatedPaths = ["/auth"];

export function LayoutPathListener() {
  const { pathname } = useLocation();
  const authStatus = useAuthStatus();

  const uid = useUID();
  const { name, loading } = useUserNameWithStatus(uid ?? null);

  const { continuePath } = useSearch({ strict: false });

  if (
    authStatus === AuthStatus.Unauthenticated &&
    !openPaths.includes(pathname)
  ) {
    return <Navigate to={"/auth"} search={{ continuePath: pathname }} />;
  }
  if (
    authStatus === AuthStatus.Authenticated &&
    onlyUnauthenticatedPaths.includes(pathname)
  ) {
    return <Navigate to={continuePath || "/games"} />;
  }

  return (
    <>
      <UserNameDialog open={!loading && name === null} />
    </>
  );
}
