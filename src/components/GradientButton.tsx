import { Box, ButtonBase, SxProps, Theme, Typography } from "@mui/material";
import { useMemo } from "react";

import { GradientBox } from "./GradientBox";
import { ButtonBaseLink } from "./LinkComponent";

export interface GradientButtonProps {
  href?: string;
  sx?: SxProps<Theme>;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export function GradientButton(props: GradientButtonProps) {
  const { sx, children, href, onClick, type = "button", disabled } = props;

  const contents = useMemo(() => {
    return (
      <GradientBox className="gradient-box">
        <Box
          className="inner-box"
          px={1.75}
          py={0.75}
          borderRadius={0.75}
          bgcolor="grey.900"
          sx={(theme) => ({
            transition: theme.transitions.create(["padding", "border-radius"], {
              duration: 150,
              easing: theme.transitions.easing.easeInOut,
            }),
          })}
        >
          <Typography variant="button" color="inherit">
            {children}
          </Typography>
        </Box>
      </GradientBox>
    );
  }, [children]);

  const buttonProps = useMemo(
    () => ({
      focusRipple: true,
      disabled,
      sx: [
        (theme: Theme) => ({
          color: "common.white",
          borderRadius: 1,
          overflow: "hidden",
          "& .gradient-box::before": { opacity: 1000 },
          "& .gradient-box": {
            p: 0.25,
            transitionProperty: "padding",
            transition: theme.transitions.create("padding", {
              duration: 150,
              easing: theme.transitions.easing.easeInOut,
            }),
          },
          "&:hover .gradient-box": {
            p: 0.4,
          },
          "&:hover .gradient-box::before": { opacity: 100 },
          "&:hover .inner-box": {
            px: 1.6,
            py: 0.6,
            borderRadius: 0.6,
          },
          ".MuiTouchRipple-root": {
            zIndex: 3,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ],
    }),
    [disabled, sx],
  );

  if (href) {
    return (
      <ButtonBaseLink to={href} {...buttonProps}>
        {contents}
      </ButtonBaseLink>
    );
  }

  return (
    <ButtonBase {...buttonProps} onClick={onClick} type={type}>
      {contents}
    </ButtonBase>
  );
}
