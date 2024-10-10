import { router } from "pages/routes";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { HeadProvider } from "./HeadProvider";
import { ConfirmProvider } from "material-ui-confirm";
import { useTranslation } from "react-i18next";

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
