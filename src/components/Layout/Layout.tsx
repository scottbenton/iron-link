import { Box, LinearProgress } from "@mui/material";
import { Outlet } from "react-router-dom";

import { RollSnackbarSection } from "components/characters/rolls/RollSnackbarSection";
import { DataswornDialog } from "components/datasworn/DataswornDialog";

import { AuthState, useAuthAtom } from "atoms/auth.atom";

import { LayoutPathListener } from "./LayoutPathListener";
import { LiveRegion } from "./LiveRegion";
import { NavBar } from "./NavBar";
import { NavRail } from "./NavRail";
import { SkipToContentButton } from "./SkipToContentButton";
import { authenticatedNavRoutes, unauthenticatedNavRoutes } from "./navRoutes";

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
        flexGrow={1}
        position="relative"
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
