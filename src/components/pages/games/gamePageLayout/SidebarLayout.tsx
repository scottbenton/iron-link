import { Box, Card, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { NotesSection } from "../characterSheet/components/NotesSection";
import { ReferenceSidebarContents } from "../characterSheet/components/ReferenceSidebarContents";

export function SidebarLayout() {
  const theme = useTheme();
  const hasThreeColumns = useMediaQuery(theme.breakpoints.up("lg"));
  const hasAtLeastTwoColumns = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box display="flex" alignItems="stretch" height="100%">
      <Box
        component={PanelGroup}
        autoSaveId={"left-sidebar"}
        direction="vertical"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          maxWidth: 350,
          width: "100%",
        }}
      >
        <Card
          component={Panel}
          id="character-panel"
          defaultSize={50}
          minSize={10}
          order={0}
          variant="outlined"
          sx={{
            borderRadius: 0,
            bgcolor: "background.default",
          }}
        >
          <Box overflow="auto" p={2} height="100%">
            <Outlet />
          </Box>
        </Card>
        {hasAtLeastTwoColumns && !hasThreeColumns && (
          <>
            <Box
              component={PanelResizeHandle}
              sx={{
                position: "relative",
                zIndex: 1,
                bgcolor: "grey.400",
                alignSelf: "center",
                py: 0.25,
                px: 3,
                // my: -0.5,
                cursor: "ew-resize",
                borderRadius: 999,
              }}
            />
            <Card
              component={Panel}
              id="left-reference-panel"
              order={1}
              defaultSize={50}
              minSize={10}
              variant="outlined"
              sx={{
                borderRadius: 0,
                bgcolor: "background.default",
              }}
            >
              <Box overflow="auto" height={"100%"}>
                <ReferenceSidebarContents />
              </Box>
            </Card>
          </>
        )}
      </Box>
      {hasAtLeastTwoColumns && (
        <Box
          sx={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            px: 1,
            mt: 1,
          }}
        >
          <NotesSection />
        </Box>
      )}

      {hasThreeColumns && (
        <Card
          variant="outlined"
          sx={{
            display: {
              xs: "none",
              lg: "flex",
            },
            bgcolor: "background.default",
            maxWidth: 350,
            width: "100%",
            overflow: "hidden",
            flexDirection: "column",
            borderRadius: 0,
          }}
        >
          <ReferenceSidebarContents />
        </Card>
      )}
    </Box>
  );
}
