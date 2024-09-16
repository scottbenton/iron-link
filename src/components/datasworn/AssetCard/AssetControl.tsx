import { Datasworn } from "@datasworn/core";
import { Box } from "@mui/material";
// import { Track } from "components/features/Track";
import { AssetControls } from "./AssetControls";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { AssetCounterField } from "./fields/AssetCounterField";
import { AssetClockField } from "./fields/AssetClockField";
import { ConditionMeter } from "../ConditonMeter";
import { AssetSelectEnhancementField } from "./fields/AssetSelectEnhancementField";
import { AssetCheckboxField } from "./fields/AssetCheckboxField";
import { AssetTextField } from "./fields/AssetTextField";

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

  switch (control.field_type) {
    case "select_enhancement":
      return (
        <AssetSelectEnhancementField
          field={control}
          value={typeof value === "string" ? value : undefined}
          onChange={
            onControlChange
              ? (value) => onControlChange(controlId, value)
              : undefined
          }
        />
      );
    case "card_flip":
      return (
        <AssetCheckboxField
          field={control}
          value={typeof value === "boolean" ? value : undefined}
          onChange={
            onControlChange
              ? (checked) => onControlChange(controlId, checked)
              : undefined
          }
        />
      );
    case "checkbox":
      return (
        <AssetCheckboxField
          field={control}
          value={typeof value === "boolean" ? value : undefined}
          onChange={
            onControlChange
              ? (checked) => onControlChange(controlId, checked)
              : undefined
          }
        />
      );
    case "condition_meter": {
      const subControls = control.controls;
      return (
        <Box display={"flex"} alignItems="flex-start">
          <ConditionMeter
            label={control.label}
            defaultValue={control.value}
            min={control.min}
            max={control.max}
            value={typeof value === "number" ? (value as number) : undefined}
            disabled={!onControlChange}
            onChange={
              onControlChange
                ? (value) => {
                    onControlChange(controlId, value);
                  }
                : undefined
            }
          />
          {subControls && (
            <Box ml={2} mt={-1}>
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
          onChange={
            onControlChange
              ? (value) => onControlChange(controlId, value)
              : undefined
          }
        />
      );
    }
    case "clock": {
      return (
        <AssetClockField
          field={control}
          value={typeof value === "number" ? value : undefined}
          onChange={
            onControlChange
              ? (value) => onControlChange(controlId, value)
              : undefined
          }
        />
      );
    }
    case "counter": {
      return (
        <AssetCounterField
          value={typeof value === "number" ? value : undefined}
          field={control}
          onChange={
            onControlChange
              ? (value) => onControlChange(controlId, value)
              : undefined
          }
        />
      );
    }
  }

  return null;
}
