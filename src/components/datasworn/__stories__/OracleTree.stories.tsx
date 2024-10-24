import { Meta, StoryObj } from "@storybook/react";

import { OracleTree } from "../OracleTree";

const meta = {
  title: "Datasworn/OracleTree",
  component: OracleTree,
  tags: ["autodocs", "card"],
} satisfies Meta<typeof OracleTree>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  args: {},
};
