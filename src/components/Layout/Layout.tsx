import { Box, LinearProgress } from "@mui/material";
import { LiveRegion } from "./LiveRegion";
import { SkipToContentButton } from "./SkipToContentButton";
import { NavBar } from "./NavBar";
import { NavRail } from "./NavRail";
import { authenticatedNavRoutes, unauthenticatedNavRoutes } from "./navRoutes";
import { Outlet } from "react-router-dom";
import { AuthState, useAuthAtom } from "atoms/auth.atom";
import { LayoutPathListener } from "./LayoutPathListener";
import { RollSnackbarSection } from "components/characters/rolls/RollSnackbarSection";

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
    <Box minHeight={"100vh"} display={"flex"} flexDirection={"column"}>
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
