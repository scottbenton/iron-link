import CharacterIcon from "@mui/icons-material/Person";
import GamesIcon from "@mui/icons-material/Group";
import WorldsIcon from "@mui/icons-material/TravelExplore";
import HomebrewIcon from "@mui/icons-material/Edit";
import SignInIcon from "@mui/icons-material/Person";
import SignUpIcon from "@mui/icons-material/PersonAddAlt1";
import { pathConfig } from "pages/pathConfig";
import { i18n } from "i18n/config";

export interface NavRouteConfig {
  Logo: typeof CharacterIcon;
  title: string;
  href: string;
  checkIsSelected: (path: string) => boolean;
}

export const authenticatedNavRoutes: NavRouteConfig[] = [
  {
    Logo: GamesIcon,
    title: i18n.t("datasworn.games", "Games"),
    href: pathConfig.gameSelect,
    checkIsSelected: (path) => path.startsWith(pathConfig.gameSelect),
  },
  {
    Logo: WorldsIcon,
    title: i18n.t("datasworn.worlds", "Worlds"),
    href: pathConfig.worldSelect,
    checkIsSelected: (path) => path.startsWith(pathConfig.worldSelect),
  },
  {
    Logo: HomebrewIcon,
    title: i18n.t("datasworn.homebrew", "Homebrew"),
    href: pathConfig.homebrewSelect,
    checkIsSelected: (path) => path.startsWith(pathConfig.homebrewSelect),
  },
];
export const unauthenticatedNavRoutes: NavRouteConfig[] = [
  {
    Logo: SignInIcon,
    title: i18n.t("datasworn.sign-in", "Sign In"),
    href: pathConfig.signIn,
    checkIsSelected: (path) => path.startsWith(pathConfig.signIn),
  },
  {
    Logo: SignUpIcon,
    title: i18n.t("datasworn.sign-up", "Sign Up"),
    href: pathConfig.signUp,
    checkIsSelected: (path) => path.startsWith(pathConfig.signUp),
  },
];
