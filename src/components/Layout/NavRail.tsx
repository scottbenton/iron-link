import { Box, Stack } from "@mui/material";

import { AppSettingsMenu } from "components/Layout/AppSettingsMenu";
import { IronLinkLogo } from "components/Layout/IronLinkLogo";
import { NavRailItem } from "components/Layout/NavRailItem";
import { NavRouteConfig } from "components/Layout/navRoutes";

export interface NavRailProps {
  routes: NavRouteConfig[];
}

export function NavRail(props: NavRailProps) {
  const { routes } = props;

  return (
    <Box flexShrink={0}>
      <Box
        sx={(theme) => ({
          bgcolor: "grey.900",
          color: "common.white",
          width: 80,
          height: "100%",
          py: 2,
          display: "none",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          [theme.breakpoints.up("sm")]: {
            display: "inline-flex",
          },
        })}
      >
        <IronLinkLogo sx={{ width: 48, height: 48 }} />
        <Stack
          mt={4}
          mb={8}
          component={"nav"}
          flexGrow={1}
          display="flex"
          flexDirection={"column"}
          alignItems={"center"}
          spacing={1}
        >
          {routes.map((route, index) => (
            <NavRailItem key={index} {...route} />
          ))}
        </Stack>
        <AppSettingsMenu />
      </Box>
    </Box>
  );
}
