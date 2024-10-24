import { PropsWithChildren } from "react";
import { Box } from "@mui/material";

export interface ContainedTabPanelProps extends PropsWithChildren {
  isVisible: boolean;
  overflowAuto?: boolean;
}

export function ContainedTabPanel(props: ContainedTabPanelProps) {
  const { isVisible, overflowAuto = true, children } = props;

  if (!isVisible) return null;

  return (
    <Box
      role={"tabpanel"}
      flexGrow={1}
      overflow={overflowAuto ? "auto" : undefined}
    >
      {children}
    </Box>
  );
}
