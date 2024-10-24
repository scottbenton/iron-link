import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Datasworn, IdParser } from "@datasworn/core";
import { Primary } from "@datasworn/core/dist/StringId";
import RollIcon from "@mui/icons-material/Casino";

import { useDataswornTree } from "atoms/dataswornTree.atom";
import {
  CampaignState,
  CharacterState,
} from "components/datasworn/Move/RollOptions/common.types";
import { Stat } from "components/datasworn/Stat";
import { useRollStatAndAddToLog } from "pages/games/hooks/useRollStatAndAddToLog";

export interface MoveActionAssetControlProps {
  moveId: string;
  disabled?: boolean;
  rollOption: Datasworn.AssetControlValueRef;
  characterData: CharacterState;
  campaignData: CampaignState;
  characterId: string;
}

export function MoveActionAssetControl(props: MoveActionAssetControlProps) {
  const {
    moveId,
    rollOption,
    disabled,
    characterData,
    campaignData,
    characterId,
  } = props;

  const { t } = useTranslation();
  const tree = useDataswornTree();

  const characterAssets = characterData.assets;
  const campaignAssets = campaignData.assets;

  const rollStat = useRollStatAndAddToLog();

  const assetValues = useMemo(() => {
    const actualAssetValues: {
      label: string;
      value: number;
    }[] = [];

    rollOption.assets?.forEach((assetWildcard) => {
      const matches = IdParser.getMatches(assetWildcard as Primary, tree);
      matches.forEach((asset) => {
        if (asset.type === "asset") {
          Object.values({ ...characterAssets, ...campaignAssets }).forEach(
            (assetDocument) => {
              const control = asset.controls?.[rollOption.control];
              if (control && assetDocument.id === asset._id) {
                const controlValue =
                  assetDocument.controlValues?.[rollOption.control];
                const defaultControlValue = control.value;
                const controlLabel = control.label;
                const assetName =
                  assetDocument.optionValues?.["name"] ?? asset.name;
                actualAssetValues.push({
                  label: t(
                    "datasworn.move.asset-control-roll-label",
                    "{{assetName}}'s {{controlLabel}}",
                    { assetName, controlLabel },
                  ),
                  value:
                    typeof controlValue === "number"
                      ? controlValue
                      : ((typeof defaultControlValue === "number"
                          ? defaultControlValue
                          : 0) ?? 0),
                });
              }
            },
          );
        }
      });
    });

    return actualAssetValues;
  }, [campaignAssets, characterAssets, rollOption, tree, t]);

  return (
    <>
      {assetValues.map((assetValue, index) => (
        <Stat
          key={index}
          disabled={disabled}
          label={assetValue.label}
          value={assetValue.value}
          action={{
            actionLabel: t("datasworn.roll"),
            ActionIcon: RollIcon,
          }}
          onActionClick={() => {
            rollStat({
              statId: rollOption.control,
              statLabel: assetValue.label,
              statModifier: assetValue.value,
              moveId,
              adds: characterData.adds ?? 0,
              momentum: characterData.momentum,
              characterId,
            });
          }}
        />
      ))}
    </>
  );
}
