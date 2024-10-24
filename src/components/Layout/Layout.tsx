import { Outlet } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";

import { AuthState, useAuthAtom } from "atoms/auth.atom";
import { RollSnackbarSection } from "components/characters/rolls/RollSnackbarSection";
import { DataswornDialog } from "components/datasworn/DataswornDialog";
import { LayoutPathListener } from "components/Layout/LayoutPathListener";
import { LiveRegion } from "components/Layout/LiveRegion";
import { NavBar } from "components/Layout/NavBar";
import { NavRail } from "components/Layout/NavRail";
import {
  authenticatedNavRoutes,
  unauthenticatedNavRoutes,
} from "components/Layout/navRoutes";
import { SkipToContentButton } from "components/Layout/SkipToContentButton";

export function Layout() {
  const authStatus = useAuthAtom()[0].status;

  if (authStatus === AuthState.Loading) {
    return <LinearProgress />;
  }

  const routes =
    authStatus === AuthState.Authenticated
      ? authenticatedNavRoutes
      : unauthenticatedNavRoutes;

  return (
    <Box
      minHeight={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      bgcolor="grey.950"
    >
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", sm: "row" }}
        maxHeight={{ xs: undefined, sm: "100vh" }}
        flexGrow={1}
      >
        <LiveRegion />
        <SkipToContentButton />
        <LayoutPathListener />
        <NavBar routes={routes} />
        <NavRail routes={routes} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflowY: { xs: "unset", sm: "auto" },
          }}
          component={"main"}
          id={"main-content"}
        >
          <Outlet />
        </Box>
      </Box>
      <RollSnackbarSection />
      <DataswornDialog />
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
