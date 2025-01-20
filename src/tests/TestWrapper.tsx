import { PropsWithChildren } from "react";

import { SnackbarProvider } from "providers/SnackbarProvider";
import { ThemeProvider } from "providers/ThemeProvider";

export function TestWrapper(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ThemeProvider>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
}
