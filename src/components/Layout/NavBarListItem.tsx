import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { ListItemLink } from "components/LinkComponent";

import { NavRouteConfig } from "./navRoutes";

export function NavBarListItem(props: NavRouteConfig) {
  const { title, Logo, href } = props;

  return (
    <ListItem disablePadding>
      <ListItemLink to={href}>
        <ListItemIcon>
          <Logo />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemLink>
    </ListItem>
  );
}
