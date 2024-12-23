import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

import {
  onlyUnauthenticatedPaths,
  openPaths,
  pathConfig,
} from "pages/pathConfig";

import { useContinueUrl } from "hooks/useContinueUrl";

import { AuthStatus, useAuthStatus } from "stores/auth.store";

export function LayoutPathListener() {
  const { pathname } = useLocation();
  const authStatus = useAuthStatus();
  const { redirectWithContinueUrl, navigateToContinueURL } = useContinueUrl();

  useEffect(() => {
    const doesOpenPathMatch = openPaths.some((path) => {
      return !!matchPath(path, pathname);
    });
    if (!doesOpenPathMatch && authStatus === AuthStatus.Unauthenticated) {
      redirectWithContinueUrl(pathConfig.auth, pathname);
    } else if (
      onlyUnauthenticatedPaths.includes(pathname) &&
      authStatus === AuthStatus.Authenticated
    ) {
      navigateToContinueURL(pathConfig.gameSelect);
    }
  }, [pathname, navigateToContinueURL, redirectWithContinueUrl, authStatus]);

  return null;
}
