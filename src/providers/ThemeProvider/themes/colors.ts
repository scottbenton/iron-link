import { Color } from "@mui/material/styles";

type ColorWith950 = Color & { 950: string };

export const grey: ColorWith950 = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#0a101c",
  950: "#030712",
  A100: "#f3f4f6",
  A200: "#e5e7eb",
  A400: "#9ca3af",
  A700: "#374151",
};

export const sharedStatusColors = {
  success: {
    light: "#10b981",
    main: "#059669",
    dark: "#047857",
  },
  warning: {
    light: "#d97706",
    main: "#b45309",
    dark: "#92400e",
  },
  error: {
    light: "#ef4444",
    main: "#dc2626",
    dark: "#b91c1c",
  },
  info: {
    light: "#0ea5e9",
    main: "#0284c7",
    dark: "#0369a1",
  },
};
