import ActionIcon from "@mui/icons-material/Casino";
import { Meta, StoryObj } from "@storybook/react";

import { ConditionMeter } from "../ConditonMeter";

const meta = {
  title: "Datasworn/Condition Meter",
  component: ConditionMeter,
  tags: ["autodocs", "centered", "card"],
} satisfies Meta<typeof ConditionMeter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  args: {
    label: "Health",
    defaultValue: 5,
    min: 0,
    max: 5,
  },
};

export const WithOnActionClick: Story = {
  args: {
    label: "Health",
    defaultValue: 5,
    min: 0,
    max: 5,
    onActionClick: () => {},
  },
};

export const WithOnChange: Story = {
  args: {
    label: "Health",
    defaultValue: 5,
    min: 0,
    max: 5,
    value: 2,
    onChange: () => {},
    onActionClick: () => {},
  },
};

export const WithActionIcon: Story = {
  args: {
    label: "Health",
    defaultValue: 0,
    min: 0,
    max: 5,
    onChange: () => {},
    onActionClick: () => {},
    action: {
      ActionIcon: ActionIcon,
      actionLabel: "Roll",
    },
  },
};
