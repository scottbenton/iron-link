import { Datasworn } from "@datasworn/core";

import { AssetSelectEnhancementField } from "components/datasworn/AssetCard/fields/AssetSelectEnhancementField";
import { AssetSelectValueField } from "components/datasworn/AssetCard/fields/AssetSelectValueField";
import { AssetTextField } from "components/datasworn/AssetCard/fields/AssetTextField";

export interface AssetOptionProps {
  assetOptionKey: string;
  value?: string;
  assetOption: Datasworn.AssetOptionField;
  onAssetOptionChange?: (assetOptionKey: string, value: string) => void;
}

export function AssetOption(props: AssetOptionProps) {
  const { assetOptionKey, value, assetOption, onAssetOptionChange } = props;

  switch (assetOption.field_type) {
    case "text":
      return (
        <AssetTextField
          field={assetOption}
          value={value}
          onChange={
            onAssetOptionChange
              ? (newValue) => onAssetOptionChange(assetOptionKey, newValue)
              : undefined
          }
        />
      );
    case "select_enhancement":
      return (
        <AssetSelectEnhancementField
          field={assetOption}
          value={value}
          onChange={
            onAssetOptionChange
              ? (newValue) => onAssetOptionChange(assetOptionKey, newValue)
              : undefined
          }
        />
      );
    case "select_value":
      return (
        <AssetSelectValueField
          field={assetOption}
          value={value}
          onChange={
            onAssetOptionChange
              ? (newValue) => onAssetOptionChange(assetOptionKey, newValue)
              : undefined
          }
        />
      );
  }

  return null;
}
