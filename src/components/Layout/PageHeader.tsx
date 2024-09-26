import {
  Box,
  Breakpoint,
  Container,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React, { PropsWithChildren } from "react";

export interface PageHeaderProps extends PropsWithChildren {
  label?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: false | Breakpoint;
  disablePadding?: boolean;
  sx?: SxProps<Theme>;
}

export function PageHeader(props: PageHeaderProps) {
  const {
    label,
    subLabel,
    actions,
    maxWidth = "xl",
    disablePadding,
    sx,
    children,
  } = props;

  return (
    <Container
      maxWidth={maxWidth}
      sx={[
        {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          py: disablePadding ? 0 : 4,

          bgcolor: "background.paper",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children ? (
        <>{children}</>
      ) : (
        <>
          <Box>
            {label &&
              (typeof label === "string" ? (
                <Typography
                  variant={"h4"}
                  component={"h1"}
                  textTransform={"uppercase"}
                  fontFamily={(theme) => theme.typography.fontFamilyTitle}
                >
                  {label}
                </Typography>
              ) : (
                label
              ))}
            {subLabel &&
              (typeof subLabel === "string" ? (
                <Typography
                  variant={"h6"}
                  component={"h2"}
                  textTransform={"uppercase"}
                  fontFamily={(theme) => theme.typography.fontFamilyTitle}
                >
                  {subLabel}
                </Typography>
              ) : (
                subLabel
              ))}
          </Box>
          {actions && (
            <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
              {actions}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}
