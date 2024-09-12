import { PropsWithChildren } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { useColorScheme } from "atoms/theme.atom";
import { getTheme } from "./themes/themeConfig";

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
