import { router } from "pages/routes";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeProvider";

export function Providers() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
