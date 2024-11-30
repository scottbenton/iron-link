import { Datasworn } from "@datasworn/core";
import { Box, Checkbox, Stack, Typography } from "@mui/material";

import { MarkdownRenderer } from "components/MarkdownRenderer";

import { AssetDocument } from "api-calls/assets/_asset.type";

export interface AssetAbilitiesProps {
  abilities: Datasworn.AssetAbility[];
  assetDocument?: AssetDocument;
  onAbilityToggle?: (abilityIndex: number, checked: boolean) => void;
  hideUnavailableAbilities?: boolean;
}

export function AssetAbilities(props: AssetAbilitiesProps) {
  const {
    abilities,
    assetDocument,
    onAbilityToggle,
    hideUnavailableAbilities,
  } = props;

  const filteredAbilities = hideUnavailableAbilities
    ? abilities.filter(
        (ability, index) =>
          (ability.enabled || assetDocument?.enabledAbilities[index]) ?? false,
      )
    : abilities;

  return (
    <Stack spacing={1} flexGrow={1} sx={{ ml: -1, flexGrow: 1 }}>
      {filteredAbilities.map((ability, index) => (
        <Box display={"flex"} alignItems={"flex-start"} key={index}>
          <Checkbox
            checked={
              (ability.enabled || assetDocument?.enabledAbilities[index]) ??
              false
            }
            disabled={ability.enabled || !onAbilityToggle}
            onChange={(evt) =>
              onAbilityToggle && onAbilityToggle(index, evt.target.checked)
            }
            sx={{ p: 0.5 }}
          />
          <Box key={index}>
            {ability.name && (
              <Typography display={"inline"} variant={"body2"}>
                <b>{ability.name}: </b>
              </Typography>
            )}
            <MarkdownRenderer markdown={ability.text} inlineParagraph />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
