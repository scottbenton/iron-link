import { Meta, StoryObj } from "@storybook/react";
import { DebouncedOracleTextField } from "../OracleTextField";

const meta = {
  title: "Datasworn/Debounced Oracle Text Field",
  component: DebouncedOracleTextField,
  tags: ["autodocs", "centered", "card"],
} satisfies Meta<typeof DebouncedOracleTextField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  args: {
    label: "Ironlander Name Oracle",
    oracleId: "oracle_rollable:classic/name/ironlander/a",
    onChange: (value: string) => console.log(value),
  },
};

export const StarforgedNameOracles: Story = {
  args: {
    label: "Starforged Name Oracle",
    oracleConfig: {
      tableIds: [
        "oracle_rollable:starforged/character/name/given_name",
        "oracle_rollable:starforged/character/name/family_name",
      ],
      joinTables: true,
    },
    onChange: (value: string) => console.log(value),
  },
};

export const CombinedOracles: Story = {
  args: {
    label: "Combined Oracles",
    oracleConfig: {
      tableIds: [
        {
          tableIds: [
            "oracle_rollable:classic/name/ironlander/a",
            "oracle_rollable:classic/name/ironlander/b",
          ],
        },
        {
          tableIds: [
            "oracle_rollable:starforged/character/name/given_name",
            "oracle_rollable:starforged/character/name/family_name",
          ],
          joinTables: true,
        },
      ],
      joinTables: false,
    },
    onChange: (value: string) => console.log(value),
  },
};
