import { Tabs, TabsProps } from "@mui/material";

export function StyledTabs(props: TabsProps) {
  const { sx, ...otherProps } = props;
  return (
    <Tabs
      TabIndicatorProps={{
        sx: (theme) => ({
          height: "100%",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[300]
              : theme.palette.grey[700],
          color: theme.palette.text.secondary,
          borderRadius: `${theme.shape.borderRadius}px`,
        }),
      }}
      TabScrollButtonProps={{
        sx: {
          alignSelf: "stretch",
        },
      }}
      sx={[
        (theme) => ({
          py: 0,
          backgroundColor: undefined,
          borderBottom: `1px solid ${theme.palette.divider}`,
          alignItems: "center",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      scrollButtons
      allowScrollButtonsMobile
      {...otherProps}
    />
  );
}
