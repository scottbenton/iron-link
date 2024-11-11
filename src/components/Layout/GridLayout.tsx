import { Box, LinearProgress, SxProps, Theme } from "@mui/material";

import { EmptyState } from "./EmptyState";

export interface GridLayoutProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  error?: string;
  emptyStateAction?: React.ReactNode;
  emptyStateMessage?: string;
  minWidth: number;
  sx?: SxProps<Theme>;
  gap?: number;
}

export function GridLayout<T>(props: GridLayoutProps<T>) {
  const {
    gap = 2,
    items,
    renderItem,
    loading,
    error,
    emptyStateAction,
    emptyStateMessage,
    minWidth,
    sx,
  } = props;

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <EmptyState message={error} sx={{ mt: 4 }} />;
  }

  if (items.length === 0) {
    if (!emptyStateMessage) {
      return null;
    }
    return (
      <EmptyState
        message={emptyStateMessage}
        action={emptyStateAction}
        sx={{ mt: 4 }}
      />
    );
  }

  return (
    <Box sx={{ containerType: "inline-size" }}>
      <Box
        sx={[
          {
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
            gap,
            [`@container (max-width: ${minWidth}px)`]: {
              gridTemplateColumns: "1fr",
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            height={"100%"}
            sx={{
              "&>": {
                height: "100%",
              },
            }}
          >
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
