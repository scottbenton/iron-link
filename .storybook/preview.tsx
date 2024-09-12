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
    (Stories) => (
      <ThemeProvider>
        <Box sx={{ bgcolor: "background.default", color: "primary.main" }}>
          <PreviewHeader />
          <Box p={4}>
            <Stories />
          </Box>
        </Box>
      </ThemeProvider>
    ),
    withRouter,
  ],
};

export default preview;
