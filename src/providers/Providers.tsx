import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ConfirmProvider } from "material-ui-confirm";
import { useTranslation } from "react-i18next";
import { routeTree } from "routeTree.gen";

import { HeadProvider } from "./HeadProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { ThemeProvider } from "./ThemeProvider";

const router = createRouter({ routeTree, defaultViewTransition: true });
// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function Providers() {
  const { t } = useTranslation();

  return (
    <HeadProvider>
      <ThemeProvider>
        <ConfirmProvider
          defaultOptions={{
            cancellationText: t("common.cancel", "Cancel"),
            cancellationButtonProps: { color: "inherit" },
            confirmationButtonProps: {
              variant: "contained",
              color: "error",
            },
          }}
        >
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </HeadProvider>
  );
}
