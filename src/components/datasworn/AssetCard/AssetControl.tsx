import { Datasworn } from "@datasworn/core";
import { Box } from "@mui/material";
import { AssetControls } from "./AssetControls";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { AssetCounterField } from "./fields/AssetCounterField";
import { AssetClockField } from "./fields/AssetClockField";
import { ConditionMeter } from "../ConditonMeter";
import { AssetSelectEnhancementField } from "./fields/AssetSelectEnhancementField";
import { AssetCheckboxField } from "./fields/AssetCheckboxField";
import { AssetTextField } from "./fields/AssetTextField";
import { useCallback, useMemo } from "react";
import { useRollStatAndAddToLog } from "../../../pages/games/hooks/useRollStatAndAddToLog.ts";
import RollIcon from "@mui/icons-material/Casino";
import { t } from "i18next";
import { useUID } from "../../../atoms/auth.atom.ts";
import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai/index";
import { derivedAtomWithEquality } from "../../../atoms/derivedAtomWithEquality.ts";
import { campaignCharactersAtom } from "../../../pages/games/gamePageLayout/atoms/campaign.characters.atom.ts";

const derivedCampaignCharacterMomentum = (
  uid: string,
  currentCharacterId?: string
) =>
  derivedAtomWithEquality(campaignCharactersAtom, (state) => {
    Object.entries(state).forEach(([characterId, characterState]) => {
      if (
        uid === characterState.characterDocument.data?.uid &&
        (!currentCharacterId || characterId === currentCharacterId)
      ) {
        return characterState.characterDocument.data?.momentum;
      }
    });
    return undefined;
  });

export interface AssetControlProps {
  controlId: string;
  assetDocument?: AssetDocument;
  control: Datasworn.AssetControlField | Datasworn.AssetAbilityControlField;
  value?: boolean | string | number;
  onControlChange?: (
    controlKey: string,
    value: boolean | string | number
  ) => void;
}
export function AssetControl(props: AssetControlProps) {
  const { controlId, control, value, onControlChange, assetDocument } = props;

  const handleControlChange = useCallback(
    (value: boolean | string | number) => {
      if (onControlChange) {
        onControlChange(controlId, value);
      }
    },
    [onControlChange, controlId]
  );

  const uid = useUID();
  const { characterId } = useParams<{
    characterId?: string;
    campaignId?: string;
  }>();
  const momentum = useAtomValue(
    useMemo(
      () => derivedCampaignCharacterMomentum(uid, characterId),
      [uid, characterId]
    )
  );

  const rollConditionMeter = useRollStatAndAddToLog();
  const handleRoll = useCallback(() => {
    rollConditionMeter({
      statId: controlId,
      statLabel: control.label,
      statModifier: typeof value === "number" ? (value as number) : 0,
      momentum: momentum || 0,
      moveId: undefined,
    });
  }, [rollConditionMeter, value, control, controlId, momentum]);

  switch (control.field_type) {
    case "select_enhancement":
      return (
        <AssetSelectEnhancementField
          field={control}
          value={typeof value === "string" ? value : undefined}
          onChange={onControlChange ? handleControlChange : undefined}
        />
      );
    case "card_flip":
      return (
        <AssetCheckboxField
          field={control}
          value={typeof value === "boolean" ? value : undefined}
          onChange={onControlChange ? handleControlChange : undefined}
        />
      );
    case "checkbox":
      return (
        <AssetCheckboxField
          field={control}
          value={typeof value === "boolean" ? value : undefined}
          onChange={onControlChange ? handleControlChange : undefined}
        />
      );
    case "condition_meter": {
      const subControls = control.controls;
      return (
        <Box display={"flex"} alignItems="flex-start" flexWrap="wrap" gap={2}>
          <ConditionMeter
            label={control.label}
            defaultValue={control.value}
            min={control.min}
            max={control.max}
            value={typeof value === "number" ? (value as number) : undefined}
            disabled={!onControlChange}
            onChange={onControlChange ? handleControlChange : undefined}
            onActionClick={handleRoll}
            action={{
              ActionIcon: RollIcon,
              actionLabel: t("datasworn.roll", "Roll"),
            }}
          />
          {subControls && (
            <Box mt={-1}>
              <AssetControls
                spacing={0}
                controls={subControls}
                assetDocument={assetDocument}
                onControlChange={onControlChange}
              />
            </Box>
          )}
        </Box>
      );
    }
    case "text": {
      return (
        <AssetTextField
          field={control}
          value={typeof value === "string" ? value : undefined}
          onChange={onControlChange ? handleControlChange : undefined}
        />
      );
    }
    case "clock": {
      return (
        <AssetClockField
          field={control}
          value={typeof value === "number" ? value : undefined}
          onChange={onControlChange ? handleControlChange : undefined}
        />
      );
    }
    case "counter": {
      return (
        <AssetCounterField
          value={typeof value === "number" ? value : undefined}
          field={control}
          onChange={onControlChange ? handleControlChange : undefined}
        />
      );
    }
  }

  return null;
}
