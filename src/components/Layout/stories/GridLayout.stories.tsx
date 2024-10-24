import EmptyImage from "@mui/icons-material/AccountCircle";
import { Box, Card, Typography } from "@mui/material";
import { Meta, StoryObj } from "@storybook/react";

import { GridLayout } from "components/Layout/GridLayout";

const meta = {
  title: "Layout/GridLayout",
  component: GridLayout,
  tags: ["autodocs"],
} satisfies Meta<typeof GridLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CharacterExample: Story = {
  args: {
    loading: false,
    error: undefined,
    items: [
      { id: "1", name: "Character 1" },
      { id: "2", name: "Character 2" },
      { id: "3", name: "Character 3" },
      { id: "4", name: "Character 4" },
      { id: "5", name: "Character 5" },
      { id: "6", name: "Character 6" },
    ],
    renderItem: (item: unknown) => (
      <Card
        variant={"outlined"}
        sx={{ p: 1, display: "flex", alignItems: "flex-start" }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          bgcolor="grey.300"
        >
          <EmptyImage fontSize="large" color="action" />
        </Box>
        <Typography
          variant={"h6"}
          ml={2}
          fontFamily={(theme) => theme.typography.fontFamilyTitle}
          textTransform="uppercase"
        >
          {(item as { name: string }).name}
        </Typography>
      </Card>
    ),
    minWidth: 250,
    emptyStateMessage: "No characters found",
    emptyStateAction: <button>Add Character</button>,
  },
};

export const LoadingExample: Story = {
  args: {
    loading: true,
    error: undefined,
    items: [],
    renderItem: () => <div>Test</div>,
    minWidth: 250,
    emptyStateMessage: "No characters found",
    emptyStateAction: <button>Add Character</button>,
  },
};

export const ErrorExample: Story = {
  args: {
    loading: false,
    error: "Failed to load characters",
    items: [],
    renderItem: () => <div>Test</div>,
    minWidth: 250,
    emptyStateMessage: "No characters found",
    emptyStateAction: <button>Add Character</button>,
  },
};

export const EmptyStateExample: Story = {
  args: {
    loading: false,
    error: undefined,
    items: [],
    renderItem: () => <div>Test</div>,
    minWidth: 250,
    emptyStateMessage: "No characters found",
    emptyStateAction: <button>Add Character</button>,
  },
};
