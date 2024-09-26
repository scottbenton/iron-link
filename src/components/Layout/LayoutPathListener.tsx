import { AuthState, useAuthStatus } from "atoms/auth.atom";
import { useContinueUrl } from "hooks/useContinueUrl";
// import { sendPageViewEvent } from "lib/analytics.lib";
import { completeMagicLinkSignupIfPresent } from "lib/auth.lib";
import {
  onlyUnauthenticatedPaths,
  openPaths,
  pathConfig,
} from "pages/pathConfig";
import { useSnackbar } from "providers/SnackbarProvider";
import { useEffect, useRef } from "react";
import { matchPath, useLocation } from "react-router-dom";

export function LayoutPathListener() {
  const { pathname } = useLocation();
  const authStatus = useAuthStatus();
  const { error } = useSnackbar();

  const previousMagicLinkPathnameChecked = useRef<string>();
  const { redirectWithContinueUrl, navigateToContinueURL } = useContinueUrl();

  useEffect(() => {
    const doesOpenPathMatch = openPaths.some((path) => {
      return !!matchPath(path, pathname);
    });
    if (!doesOpenPathMatch && authStatus === AuthState.Unauthenticated) {
      redirectWithContinueUrl(pathConfig.signIn, pathname);
    } else if (
      onlyUnauthenticatedPaths.includes(pathname) &&
      authStatus === AuthState.Authenticated
    ) {
      navigateToContinueURL(pathConfig.gameSelect);
    }
  }, [pathname, navigateToContinueURL, redirectWithContinueUrl, authStatus]);

  useEffect(() => {
    if (previousMagicLinkPathnameChecked.current !== pathname) {
      previousMagicLinkPathnameChecked.current = pathname;
      completeMagicLinkSignupIfPresent().catch((e) => error(e));
    }
  }, [pathname, error]);

  return null;
}
