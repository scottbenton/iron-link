import { Meta, StoryObj } from "@storybook/react";
import { MoveTree } from "../MoveTree";

const meta = {
  title: "Datasworn/MoveTree",
  component: MoveTree,
  tags: ["autodocs", "card"],
} satisfies Meta<typeof MoveTree>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  args: {},
};
