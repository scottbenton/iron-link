import CharacterIcon from "@mui/icons-material/Person";
import CampaignsIcon from "@mui/icons-material/Groups2";
import WorldsIcon from "@mui/icons-material/TravelExplore";
import HomebrewIcon from "@mui/icons-material/Edit";
import SignInIcon from "@mui/icons-material/Person";
import SignUpIcon from "@mui/icons-material/PersonAddAlt1";
import { routes } from "pages/routes";

export interface NavRouteConfig {
  Logo: typeof CharacterIcon;
  title: string;
  href: string;
  checkIsSelected: (path: string) => boolean;
}

export const authenticatedNavRoutes: NavRouteConfig[] = [
  {
    Logo: CharacterIcon,
    title: "Characters",
    href: routes.characterSelect,
    checkIsSelected: (path) => path.startsWith(routes.characterSelect),
  },
  {
    Logo: CampaignsIcon,
    title: "Campaigns",
    href: routes.campaignSelect,
    checkIsSelected: (path) => path.startsWith(routes.campaignSelect),
  },
  {
    Logo: WorldsIcon,
    title: "Worlds",
    href: routes.worldSelect,
    checkIsSelected: (path) => path.startsWith(routes.worldSelect),
  },
  {
    Logo: HomebrewIcon,
    title: "Homebrew",
    href: routes.homebrewSelect,
    checkIsSelected: (path) => path.startsWith(routes.homebrewSelect),
  },
];
export const unauthenticatedNavRoutes: NavRouteConfig[] = [
  {
    Logo: SignInIcon,
    title: "Sign In",
    href: routes.signIn,
    checkIsSelected: (path) => path.startsWith(routes.signIn),
  },
  {
    Logo: SignUpIcon,
    title: "Sign Up",
    href: routes.signUp,
    checkIsSelected: (path) => path.startsWith(routes.signUp),
  },
];
