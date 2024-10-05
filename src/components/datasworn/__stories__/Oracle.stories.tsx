import { Meta, StoryObj } from "@storybook/react";
import { Oracle } from "../Oracle";

const meta = {
  title: "Datasworn/OracleRenderer",
  component: Oracle,
  tags: ["autodocs", "card"],
  args: {
    sx: {
      p: 2,
    },
  },
} satisfies Meta<typeof Oracle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  args: {
    oracleId: "oracle_rollable:starforged/misc/story_clue",
  },
};

export const InvalidIdExample: Story = {
  args: {
    oracleId: "oracle_rollable:blarg/session/begin",
  },
};
