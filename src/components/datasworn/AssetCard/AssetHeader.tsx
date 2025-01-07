import LinkIcon from "@mui/icons-material/Link";
import { Box, Tooltip, Typography } from "@mui/material";

import { getIsLocalEnvironment } from "lib/environment.lib";

export interface AssetHeaderProps {
  category: string;
  id: string;
  actions?: React.ReactNode;
}

export function AssetHeader(props: AssetHeaderProps) {
  const { id, category, actions } = props;

  const isLocal = getIsLocalEnvironment();

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      pl={2}
      pr={1}
      bgcolor={"grey.700"}
      color={"common.white"}
      height={(theme) => theme.spacing(5)}
    >
      <Typography
        color={"inherit"}
        fontFamily={(theme) => theme.typography.fontFamilyTitle}
      >
        {category}
      </Typography>
      <Box display={"flex"} alignItems={"center"}>
        {isLocal && (
          <Tooltip title={id}>
            <LinkIcon color={"inherit"} />
          </Tooltip>
        )}
        {actions}
      </Box>
    </Box>
  );
}
