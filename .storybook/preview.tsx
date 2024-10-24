import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import "@fontsource-variable/inter";
import "@fontsource/barlow-condensed/600.css";
import { Box, LinearProgress } from "@mui/material";
import type { Preview } from "@storybook/react";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

import "src/App.css";
import { PreviewHeader } from ".storybook/PreviewHeader";
import { useSetDataswornTree } from "atoms/dataswornTree.atom";
import { RollSnackbarSection } from "components/characters/rolls/RollSnackbarSection";
import { allDefaultPackages } from "data/datasworn.packages";
import { i18n } from "i18n/config";
import { SnackbarProvider } from "providers/SnackbarProvider";
import { ThemeProvider } from "providers/ThemeProvider";

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
        <Suspense fallback={<LinearProgress />}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <SnackbarProvider>
                <Box
                  sx={{ bgcolor: "background.default", color: "text.primary" }}
                >
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
                    <RollSnackbarSection />
                  </Box>
                </Box>
              </SnackbarProvider>
            </ThemeProvider>
          </I18nextProvider>
        </Suspense>
      );
    },
    withRouter,
  ],
};

export default preview;
