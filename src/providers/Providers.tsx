import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import { ConfirmProvider } from "material-ui-confirm";

import { HeadProvider } from "./HeadProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { ThemeProvider } from "./ThemeProvider";
import { router } from "pages/routes";

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
