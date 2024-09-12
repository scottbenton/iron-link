import { Box, IconButton, Stack } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { IronLinkLogo } from "./IronLinkLogo";
import { NavRailItem } from "./NavRailItem";
import { NavRouteConfig } from "./navRoutes";

export interface NavRailProps {
  routes: NavRouteConfig[];
}

export function NavRail(props: NavRailProps) {
  const { routes } = props;

  return (
    <Box
      sx={{
        bgcolor: "grey.800",
        color: "common.white",
        width: 80,
        height: "100%",
        py: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <IronLinkLogo sx={{ width: 64, height: 64 }} />
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
        {routes.map((route) => (
          <NavRailItem {...route} />
        ))}
      </Stack>
      <IconButton color="inherit">
        <SettingsIcon />
      </IconButton>
    </Box>
  );
}
