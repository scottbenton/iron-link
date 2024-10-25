import { Datasworn, IdParser } from "@datasworn/core";
import {
  CampaignRollOptionState,
  CharacterRollOptionState,
} from "./common.types";
import { useMemo } from "react";
import { useDataswornTree } from "atoms/dataswornTree.atom";
import { Primary } from "@datasworn/core/dist/StringId";
import { useTranslation } from "react-i18next";
import { Stat } from "components/datasworn/Stat";
import RollIcon from "@mui/icons-material/Casino";
import { useRollStatAndAddToLog } from "pages/games/hooks/useRollStatAndAddToLog";

export interface MoveActionAssetControlProps {
  moveId: string;
  disabled?: boolean;
  rollOption: Datasworn.AssetControlValueRef;
  characterData: CharacterRollOptionState;
  campaignData: CampaignRollOptionState;
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
    const actualAssetValues: Record<
      string,
      {
        label: string;
        value: number;
      }
    > = {};

    rollOption.assets?.forEach((assetWildcard) => {
      const matches = IdParser.getMatches(assetWildcard as Primary, tree);
      matches.forEach((asset) => {
        if (asset.type === "asset") {
          Object.entries({ ...characterAssets, ...campaignAssets }).forEach(
            ([assetDocumentId, assetDocument]) => {
              const control = asset.controls?.[rollOption.control];
              if (control && assetDocument.id === asset._id) {
                const controlValue =
                  assetDocument.controlValues?.[rollOption.control];
                const defaultControlValue = control.value;
                const controlLabel = control.label;
                const assetName =
                  assetDocument.optionValues?.["name"] ?? asset.name;
                actualAssetValues[
                  `${asset._id}-${assetDocumentId}-${rollOption.control}`
                ] = {
                  label: t(
                    "datasworn.move.asset-control-roll-label",
                    "{{assetName}}'s {{controlLabel}}",
                    { assetName, controlLabel }
                  ),
                  value:
                    typeof controlValue === "number"
                      ? controlValue
                      : (typeof defaultControlValue === "number"
                          ? defaultControlValue
                          : 0) ?? 0,
                };
              }
            }
          );
        }
      });
    });

    return actualAssetValues;
  }, [campaignAssets, characterAssets, rollOption, tree, t]);

  return (
    <>
      {Object.values(assetValues).map((assetValue, index) => (
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
