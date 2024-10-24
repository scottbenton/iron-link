import { Meta, StoryObj } from "@storybook/react";

import { AssetCard } from "components/datasworn/AssetCard";

const meta = {
  title: "Datasworn/AssetCard",
  component: AssetCard,
  tags: ["autodocs", "centered", "card"],
} satisfies Meta<typeof AssetCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  args: {
    assetId: "asset:classic/combat_talent/archer",
  },
};

export const HawkExample: Story = {
  args: {
    assetId: "asset:classic/companion/hawk",
    assetDocument: {
      id: "",
      enabledAbilities: {
        2: true,
      },
      order: 1,
      optionValues: {
        name: "Leo",
      },
      shared: false,
    },
    onAssetAbilityToggle: () => {},
    onAssetControlChange: () => {},
    onAssetOptionChange: () => {},
  },
};

export const FlagshipExample: Story = {
  args: {
    assetId: "asset:sundered_isles/command_vehicle/flagship",
    assetDocument: {
      id: "",
      enabledAbilities: {
        2: true,
      },
      order: 1,
      optionValues: {
        name: "Leo",
      },
      shared: false,
    },
    onAssetAbilityToggle: () => {},
    onAssetControlChange: () => {},
    onAssetOptionChange: () => {},
  },
};

export const KrakenExample: Story = {
  args: {
    assetId: "asset:sundered_isles/companion/kraken",
    assetDocument: {
      id: "",
      enabledAbilities: {},
      order: 1,
      optionValues: {
        name: "Leo",
      },
      shared: false,
    },
    onAssetAbilityToggle: () => {},
    onAssetControlChange: () => {},
    onAssetOptionChange: () => {},
  },
};

export const SnubFighterExample: Story = {
  args: {
    assetId: "asset:starforged/support_vehicle/snub_fighter",
    assetDocument: {
      id: "",
      enabledAbilities: {
        2: true,
      },
      order: 1,
      optionValues: {
        name: "Leo",
      },
      shared: false,
    },
    onAssetAbilityToggle: () => {},
    onAssetControlChange: () => {},
    onAssetOptionChange: () => {},
  },
};

export const InvalidIdExample: Story = {
  args: {
    assetId: "invalid/asset/id",
  },
};

export const IroncladExample: Story = {
  args: {
    assetId: "asset:classic/combat_talent/ironclad",
    assetDocument: {
      id: "",
      enabledAbilities: {
        2: true,
      },
      order: 1,
      controlValues: {
        equipped: "lightly_armored",
      },
      shared: false,
    },
    onAssetAbilityToggle: () => {},
    onAssetControlChange: () => {},
    onAssetOptionChange: () => {},
  },
};

export const LuckyFigureheadExample: Story = {
  args: {
    assetId: "asset:sundered_isles/module/lucky_figurehead",
    assetDocument: {
      id: "",
      enabledAbilities: {
        2: true,
      },
      order: 1,
      shared: false,
    },
    onAssetAbilityToggle: () => {},
    onAssetControlChange: () => {},
    onAssetOptionChange: () => {},
  },
};
