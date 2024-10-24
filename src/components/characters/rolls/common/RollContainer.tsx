import { PropsWithChildren } from "react";
import { Box } from "@mui/material";

export function RollContainer(props: PropsWithChildren) {
  const { children } = props;
  return (
    <Box display={"flex"} alignItems={"center"}>
      {children}
    </Box>
  );
}
