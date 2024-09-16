// theme.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TypographyOptions } from "@mui/material/styles/createTypography";

declare module "@mui/material/styles/createTypography" {
  interface TypographyOptions {
    fontFamilyTitle?: string;
  }

  interface Typography {
    fontFamilyTitle?: string;
  }
}
