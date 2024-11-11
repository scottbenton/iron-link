import { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import { NoteBreadcrumbs } from "./NoteBreadcrumbs";

export function NoteToolbar(props: PropsWithChildren) {
  const { children } = props;

  return (
    <Box>
      <Box px={1.5}>
        <NoteBreadcrumbs />
      </Box>
      <Box
        mt={0.5}
        px={0.5}
        pb={1}
        flexShrink={0}
        borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
        overflow="hidden"
        maxWidth={"100%"}
      >
        <Box
          px={1}
          py={0.5}
          bgcolor={(theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? "200" : "800"]
          }
          borderRadius={1}
          display={"flex"}
          alignItems={"center"}
          gap={0.5}
          width={"100%"}
          sx={{ overflowX: "auto" }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
