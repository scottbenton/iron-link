import { PropsWithChildren } from "react";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";

import { getTheme } from "./themes/themeConfig";
import { useColorScheme } from "atoms/theme.atom";

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props;

  const [colorScheme] = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
