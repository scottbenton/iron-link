import { Box, ButtonBase, ThemeProvider, Typography } from "@mui/material";
import { ColorScheme } from "atoms/theme.atom";
import { getTheme } from "providers/ThemeProvider/themes/themeConfig";
import { IronLinkLogo } from "./Layout/IronLinkLogo";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export interface ColorSchemeSelectorProps {
  selectedColorScheme: ColorScheme;
  onChange: (colorScheme: ColorScheme) => void;
}

export function ColorSchemeSelector(props: ColorSchemeSelectorProps) {
  const { selectedColorScheme, onChange } = props;

  return (
    <Box display="flex" flexWrap="wrap" gap={1}>
      {Object.values(ColorScheme).map((scheme) => (
        <ThemedBox
          key={scheme}
          selected={selectedColorScheme === scheme}
          colorScheme={scheme}
          onClick={() => onChange(scheme)}
        />
      ))}
    </Box>
  );
}

export function ThemedBox(props: {
  selected: boolean;
  colorScheme: ColorScheme;
  onClick: () => void;
}) {
  const { selected, colorScheme, onClick } = props;
  const { t } = useTranslation();

  const theme = getTheme(colorScheme);

  return (
    <ThemeProvider theme={theme}>
      <ButtonBase
        focusRipple
        onClick={onClick}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 200,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 2,
          position: "relative",
        })}
      >
        {selected && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CheckCircleIcon aria-label={t("Selected")} />
          </Box>
        )}
        <IronLinkLogo sx={{ width: 64, height: 64 }} />
        <Typography
          variant="h6"
          fontFamily="fontFamilyTitle"
          textTransform={"capitalize"}
        >
          {colorScheme}
        </Typography>
      </ButtonBase>
    </ThemeProvider>
  );
}
