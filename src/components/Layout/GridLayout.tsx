import { Box, LinearProgress } from "@mui/material";
import { EmptyState } from "./EmptyState";

export interface GridLayoutProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loading?: boolean;
  error?: string;
  emptyStateAction?: React.ReactNode;
  emptyStateMessage: string;
  minWidth: number;
}

export function GridLayout<T>(props: GridLayoutProps<T>) {
  const {
    items,
    renderItem,
    loading,
    error,
    emptyStateAction,
    emptyStateMessage,
    minWidth,
  } = props;

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <EmptyState message={error} sx={{ mt: 4 }} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message={emptyStateMessage}
        action={emptyStateAction}
        sx={{ mt: 4 }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
        gap: 2,
      }}
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
          {renderItem(item)}
        </Box>
      ))}
    </Box>
  );
}
