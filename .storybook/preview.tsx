import React from "react";
import type { Preview } from "@storybook/react";
import { Box } from "@mui/material";
import { ThemeProvider } from "../src/providers/ThemeProvider";
import { PreviewHeader } from "./PreviewHeader";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";
import "../src/App.css";
import "@fontsource-variable/inter";
import "@fontsource/barlow-condensed/600.css";

import { allDefaultPackages } from "../src/data/datasworn.packages";
import { useSetDataswornTree } from "../src/atoms/dataswornTree.atom";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: { path: "/characters" },
    }),
  },
  decorators: [
    (Stories, args) => {
      useSetDataswornTree(allDefaultPackages);
      const shouldBeCentered = args.tags.includes("centered");
      const isCard = args.tags.includes("card");
      return (
        <ThemeProvider>
          <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
            <PreviewHeader />
            <Box
              p={4}
              sx={[
                shouldBeCentered
                  ? {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
                  : {},
                isCard
                  ? {
                      maxWidth: 400,
                      mx: "auto",
                    }
                  : {},
              ]}
            >
              <Stories />
            </Box>
          </Box>
        </ThemeProvider>
      );
    },
    withRouter,
  ],
};

export default preview;
