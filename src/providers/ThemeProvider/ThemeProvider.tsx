import { PropsWithChildren } from "react";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";

import { useColorScheme } from "atoms/theme.atom";
import { getTheme } from "providers/ThemeProvider/themes/themeConfig";

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
