import HomebrewIcon from "@mui/icons-material/Edit";
import GamesIcon from "@mui/icons-material/Group";
import CharacterIcon from "@mui/icons-material/Person";
import AuthIcon from "@mui/icons-material/PersonAddAlt1";
import WorldsIcon from "@mui/icons-material/TravelExplore";
import { useMemo } from "react";

import { AuthStatus, useAuthStatus } from "stores/auth.store";

import { i18n } from "i18n/config";

import { usePathConfig } from "lib/paths.lib";

export interface NavRouteConfig {
  Logo: typeof CharacterIcon;
  title: string;
  href: string;
  checkIsSelected: (path: string) => boolean;
}

function inPath(topLevelPath: string, pathname: string) {
  return pathname.startsWith(topLevelPath.replace(/\/$/, ""));
}

export function useNavRoutes(): NavRouteConfig[] {
  const pathConfig = usePathConfig();
  const authStatus = useAuthStatus();

  return useMemo(() => {
    if (authStatus === AuthStatus.Loading) {
      return [];
    }
    if (authStatus === AuthStatus.Unauthenticated) {
      return [
        {
          Logo: AuthIcon,
          title: i18n.t("datasworn.authenticate", "Sign In/Up"),
          href: pathConfig.auth,
          checkIsSelected: (path) => inPath(pathConfig.auth, path),
        },
      ];
    }
    return [
      {
        Logo: GamesIcon,
        title: i18n.t("datasworn.games", "Games"),
        href: pathConfig.gameSelect,
        checkIsSelected: (path) => inPath(pathConfig.gameSelect, path),
      },
      {
        Logo: WorldsIcon,
        title: i18n.t("datasworn.worlds", "Worlds"),
        href: pathConfig.worldSelect,
        checkIsSelected: (path) => inPath(pathConfig.worldSelect, path),
      },
      {
        Logo: HomebrewIcon,
        title: i18n.t("datasworn.homebrew", "Homebrew"),
        href: pathConfig.homebrewSelect,
        checkIsSelected: (path) => inPath(pathConfig.homebrewSelect, path),
      },
    ];
  }, [pathConfig, authStatus]);
}
