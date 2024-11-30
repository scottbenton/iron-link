import { Datasworn } from "@datasworn/core";
import { Box, SxProps, Theme } from "@mui/material";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { DebouncedConditionMeter } from "components/datasworn/ConditonMeter";

import { updateCharacter } from "api-calls/character/updateCharacter";

import { MoveActionRollButton } from "./MoveActionRollButton";
import { MoveActionRollChip } from "./MoveActionRollChip";
import {
  CampaignRollOptionState,
  CharacterRollOptionState,
} from "./common.types";

export interface ActionRollsProps {
  moveId: string;
  actionRolls: Datasworn.RollableValue[];
  character?: { id: string; data: CharacterRollOptionState };
  campaignData: CampaignRollOptionState;
  sx?: SxProps<Theme>;
  includeAdds?: boolean;
}

export function ActionRolls(props: ActionRollsProps) {
  const { moveId, actionRolls, character, campaignData, sx, includeAdds } =
    props;
  const { t } = useTranslation();
  const characterId = character?.id;
  const handleAddsChange = useCallback(
    (newAdds: number) => {
      if (characterId) {
        updateCharacter({
          characterId,
          character: { adds: newAdds },
        }).catch(() => {});
      }
    },
    [characterId],
  );
  return (
    <Box display="flex" flexWrap="wrap" gap={1} sx={sx}>
      {actionRolls.map((roll, index) => (
        <React.Fragment key={index}>
          {character ? (
            <MoveActionRollButton
              rollOption={roll}
              key={index}
              characterId={character.id}
              characterData={character.data}
              campaignData={campaignData}
              moveId={moveId}
            />
          ) : (
            <MoveActionRollChip key={index} rollOption={roll} />
          )}
        </React.Fragment>
      ))}
      {character && includeAdds && (
        <DebouncedConditionMeter
          label={t("character.character-sidebar.adds", "Adds")}
          min={-9}
          max={9}
          defaultValue={0}
          value={character.data.adds}
          onChange={handleAddsChange}
        />
      )}
    </Box>
  );
}
