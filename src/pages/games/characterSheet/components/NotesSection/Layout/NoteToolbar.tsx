import { PropsWithChildren } from "react";
import { Box } from "@mui/material";

export function NoteToolbar(props: PropsWithChildren) {
  const { children } = props;

  return (
    <Box
      mt={0.5}
      px={0.5}
      pb={1}
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
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
      >
        {children}
      </Box>
    </Box>
  );
}
