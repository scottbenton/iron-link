import { router } from "pages/routes";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { HeadProvider } from "./HeadProvider";

export function Providers() {
  return (
    <HeadProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </HeadProvider>
  );
}
