import { Box, Card, CardActionArea, SxProps, Theme } from "@mui/material";
import { PropsWithChildren } from "react";

export interface RollCardProps {
  sx?: SxProps<Theme>;
  onClick?: () => void;
  isExpanded?: boolean;
}

export function RollCard(props: PropsWithChildren<RollCardProps>) {
  const { sx, children, onClick } = props;

  return (
    <Card
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          position: "relative",
          bgcolor: "grey.800",
          color: "common.white",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component={onClick ? CardActionArea : "div"}
        onClick={onClick ? onClick : undefined}
        px={2}
        py={1}
      >
        {children}
      </Box>
    </Card>
  );
}
