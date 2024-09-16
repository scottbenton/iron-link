import CharacterIcon from "@mui/icons-material/Person";
import CampaignsIcon from "@mui/icons-material/Groups2";
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
    Logo: CharacterIcon,
    title: i18n.t("Characters"),
    href: pathConfig.characterSelect,
    checkIsSelected: (path) => path.startsWith(pathConfig.characterSelect),
  },
  {
    Logo: CampaignsIcon,
    title: i18n.t("Campaigns"),
    href: pathConfig.campaignSelect,
    checkIsSelected: (path) => path.startsWith(pathConfig.campaignSelect),
  },
  {
    Logo: WorldsIcon,
    title: i18n.t("Worlds"),
    href: pathConfig.worldSelect,
    checkIsSelected: (path) => path.startsWith(pathConfig.worldSelect),
  },
  {
    Logo: HomebrewIcon,
    title: i18n.t("Homebrew"),
    href: pathConfig.homebrewSelect,
    checkIsSelected: (path) => path.startsWith(pathConfig.homebrewSelect),
  },
];
export const unauthenticatedNavRoutes: NavRouteConfig[] = [
  {
    Logo: SignInIcon,
    title: i18n.t("Sign In"),
    href: pathConfig.signIn,
    checkIsSelected: (path) => path.startsWith(pathConfig.signIn),
  },
  {
    Logo: SignUpIcon,
    title: i18n.t("Sign Up"),
    href: pathConfig.signUp,
    checkIsSelected: (path) => path.startsWith(pathConfig.signUp),
  },
];
