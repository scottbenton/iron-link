import { Box, BoxProps } from "@mui/material";
import { usePrefersReducedMotion } from "hooks/usePrefersReducedMotion";

export interface GradientBoxProps extends BoxProps {
  hide?: boolean;
}

export function GradientBox(props: GradientBoxProps) {
  const { hide, sx, children, ...rest } = props;
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Box
      sx={[
        {
          position: "relative",
          overflow: "hidden",
          "&:before": hide
            ? {}
            : {
                content: '""',
                position: "absolute",
                top: -5,
                left: -5,
                right: -5,
                bottom: -5,
                aspectRatio: "1/1",
                background: (theme) =>
                  `radial-gradient(142% 91% at 111% 84%, ${theme.palette.secondary.dark} 20%, ${theme.palette.primary.light} 80%)`,
                animation: prefersReducedMotion
                  ? "none"
                  : "spin-gradient 10s linear infinite",
                zIndex: 1,
              },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <Box sx={{ zIndex: 2, position: "relative" }}>{children}</Box>
    </Box>
  );
}
