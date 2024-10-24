import { useCallback } from "react";
import { Datasworn } from "@datasworn/core";
import { Box } from "@mui/material";

import { AssetDocument } from "api-calls/assets/_asset.type";
// import { Track } from "components/features/Track";
import { AssetControls } from "components/datasworn/AssetCard/AssetControls";
import { AssetCheckboxField } from "components/datasworn/AssetCard/fields/AssetCheckboxField";
import { AssetClockField } from "components/datasworn/AssetCard/fields/AssetClockField";
import { AssetCounterField } from "components/datasworn/AssetCard/fields/AssetCounterField";
import { AssetSelectEnhancementField } from "components/datasworn/AssetCard/fields/AssetSelectEnhancementField";
import { AssetTextField } from "components/datasworn/AssetCard/fields/AssetTextField";
import { ConditionMeter } from "components/datasworn/ConditonMeter";

export interface AssetControlProps {
  controlId: string;
  assetDocument?: AssetDocument;
  control: Datasworn.AssetControlField | Datasworn.AssetAbilityControlField;
  value?: boolean | string | number;
  onControlChange?: (
    controlKey: string,
    value: boolean | string | number,
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
    [onControlChange, controlId],
  );

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
