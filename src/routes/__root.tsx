import { Box, LinearProgress } from "@mui/material";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { LayoutPathListener } from "components/Layout/LayoutPathListener";
import { LiveRegion } from "components/Layout/LiveRegion";
import { NavRail } from "components/Layout/NavRail";
import { SkipToContentButton } from "components/Layout/SkipToContentButton";
import { useNavRoutes } from "components/Layout/navRoutes";
import { RollSnackbarSection } from "components/characters/rolls/RollSnackbarSection";
import { DataswornDialog } from "components/datasworn/DataswornDialog";

import { AuthStatus, useAuthStatus, useListenToAuth } from "stores/auth.store";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useListenToAuth();
  const authStatus = useAuthStatus();
  const routes = useNavRoutes();

  if (authStatus === AuthStatus.Loading) {
    return <LinearProgress />;
  }

  return (
    <Box
      minHeight={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      bgcolor="grey.950"
    >
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
        flexGrow={1}
        position="relative"
      >
        <LiveRegion />
        <SkipToContentButton />
        <LayoutPathListener />
        <NavRail routes={routes} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0,
          }}
          component={"main"}
          id={"main-content"}
        >
          <Outlet />
        </Box>
      </Box>
      <RollSnackbarSection />
      <DataswornDialog />
      <TanStackRouterDevtools />
      {/* <UserNameDialog
          open={userNameDialogOpen}
          handleClose={closeUserNameDialog}
        />
        <UpdateDialog />
        <LinkedDialog />
        <RollSnackbarSection /> */}
    </Box>
  );
}
