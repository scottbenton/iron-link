import { Meta, StoryObj } from "@storybook/react";
import { Move } from "../Move";

const meta = {
  title: "Datasworn/MoveRenderer",
  component: Move,
  tags: ["autodocs", "card"],
  args: {
    sx: {
      p: 2,
    },
  },
} satisfies Meta<typeof Move>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MoveNoRollExample: Story = {
  args: {
    moveId: "move:starforged/session/begin_a_session",
  },
};

export const MoveActionRollStats: Story = {
  args: {
    moveId: "move:starforged/adventure/gather_information",
  },
};

export const InvalidIdExample: Story = {
  args: {
    moveId: "move:blarg/session/begin",
  },
};
