import { createTheme, SimplePaletteColorOptions, Theme } from "@mui/material";
import { ColorScheme } from "atoms/theme.atom";
import { grey, sharedStatusColors } from "./colors";

export type ThemeConfig = Record<
  ColorScheme,
  {
    primary: SimplePaletteColorOptions;
    secondary: SimplePaletteColorOptions;
  }
>;

export const config: ThemeConfig = {
  [ColorScheme.Default]: {
    primary: {
      light: "#eab308",
      main: "#ca8a04",
      dark: "#a16207",
    },
    secondary: {
      light: "#ff8093",
      main: "#ff6584",
      dark: "#ff4d79",
    },
  },
  [ColorScheme.Cinder]: {
    primary: {
      light: "#dc2626",
      main: "#b91c1c",
      dark: "#991b1b",
    },
    secondary: {
      light: "#fecdd3",
      main: "#fda4af",
      dark: "#fb7185",
    },
  },
  [ColorScheme.Eidolon]: {
    primary: {
      light: "#ca8a04",
      main: "#a16207",
      dark: "#854d0e",
    },
    secondary: {
      light: "#fde68a",
      main: "#fcd34d",
      dark: "#fbbf24",
    },
  },
  [ColorScheme.Hinterlands]: {
    primary: {
      light: "#059669",
      main: "#047857",
      dark: "#065f46",
    },
    secondary: {
      light: "#bbf7d0",
      main: "#86efac",
      dark: "#4ade80",
    },
  },
  [ColorScheme.Myriad]: {
    primary: {
      light: "#2563eb",
      main: "#1d4ed8",
      dark: "#1e40af",
    },
    secondary: {
      light: "#a5f3fc",
      main: "#67e8f9",
      dark: "#22d3ee",
    },
  },
  [ColorScheme.Mystic]: {
    primary: {
      light: "#9333ea",
      main: "#7e22ce",
      dark: "#6b21a8",
    },
    secondary: {
      light: "#c7d2fe",
      main: "#a5b4fc",
      dark: "#818cf8",
    },
  },
};

export function getTheme(colorScheme: ColorScheme): Theme {
  return createTheme({
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: [
        "Inter Variable",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      fontFamilyTitle: [
        "Barlow Condensed",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    palette: {
      grey: grey,
      background: {
        paper: "#fff",
        default: grey[200],
      },
      text: {
        primary: grey[800],
        secondary: grey[700],
        disabled: grey[500],
      },
      action: {
        active: grey[950] + "8a",
        hover: grey[950] + "0a",
        selected: grey[950] + "14",
        disabled: grey[950] + "42",
        disabledBackground: grey[950] + "1f",
        focus: grey[950] + "1f",
      },
      ...config[colorScheme],
      ...sharedStatusColors,
    },
    colorSchemes: {
      dark: {
        palette: {
          mode: "dark",
          grey,
          divider: grey[600],
          background: {
            paper: grey[900],
            default: grey[950],
          },
          text: {
            primary: grey[50],
            secondary: grey[300],
            disabled: grey[400],
          },
          action: {
            hover: grey[100] + "14",
            selected: grey[100] + "29",
            disabled: grey[100] + "90",
            disabledBackground: grey[100] + "1f",
            focus: grey[100] + "1f",
          },
          ...config[colorScheme],
          ...sharedStatusColors,
        },
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            // border: `1px solid ${
            //   config.palette.grey[type === ThemeType.Light ? 300 : 700]
            // }`,
            backgroundImage: "unset!important", // Remove the annoying elevation background filter
          },
        },
      },
    },
  });
}

declare module "@mui/material" {
  interface TypographyOptions {
    fontFamilyTitle: string;
  }
}
