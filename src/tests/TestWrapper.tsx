import { HeadProvider } from "providers/HeadProvider";
import { SnackbarProvider } from "providers/SnackbarProvider";
import { ThemeProvider } from "providers/ThemeProvider";
import { PropsWithChildren } from "react";

export function TestWrapper(props: PropsWithChildren) {
  const { children } = props;
  return (
    <HeadProvider>
      <ThemeProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </HeadProvider>
  );
}
