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
import { useCallback } from "react";
import { useRollStatAndAddToLog } from "../../../pages/games/hooks/useRollStatAndAddToLog.ts";
import RollIcon from "@mui/icons-material/Casino";
import { useCharacterIdOptional } from "../../../pages/games/characterSheet/hooks/useCharacterId.ts";
import { useDerivedCharacterState } from "../../../pages/games/characterSheet/hooks/useDerivedCharacterState.ts";
import { useTranslation } from "react-i18next";
import { DEFAULT_MOMENTUM } from "../../../data/constants.ts";

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

  const { t } = useTranslation();

  const characterId = useCharacterIdOptional();
  const { momentum } = useDerivedCharacterState(
    characterId,
    (character) => ({
      momentum: character?.characterDocument.data?.momentum ?? DEFAULT_MOMENTUM,
    })
  );

  const rollConditionMeter = useRollStatAndAddToLog();
  const handleRoll = useCallback(() => {
    if ("rollable" in control && control.rollable) {
      rollConditionMeter({
        statId: controlId,
        statLabel: control.label,
        statModifier: typeof value === "number" ? (value as number) : control.max,
        momentum,
      });
    }
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
            onActionClick={onControlChange ? handleRoll : undefined}
            action={onControlChange ? {
              ActionIcon: RollIcon,
              actionLabel: t("datasworn.roll", "Roll"),
            } : undefined}
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
