import { Datasworn } from "@datasworn/core";
import { Box, Typography } from "@mui/material";
import { MoveActionRollButton, CharacterData } from "./MoveActionRollButton";
import { useParams } from "react-router-dom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { campaignCharactersAtom } from "pages/games/gamePageLayout/atoms/campaign.characters.atom";
import { useAtomValue } from "jotai";
import { useUID } from "atoms/auth.atom";
import { useMemo } from "react";
import { MoveActionRollChip } from "./MoveActionRollChip";
import { currentCampaignAtom } from "pages/games/gamePageLayout/atoms/campaign.atom";

const derivedCampaignState = derivedAtomWithEquality(
  currentCampaignAtom,
  (state) => ({
    conditionMeters: state.campaign?.conditionMeters ?? {},
  })
);

const derivedCampaignCharacterState = (
  uid: string,
  currentCharacterId?: string
) =>
  derivedAtomWithEquality(campaignCharactersAtom, (state) => {
    const characterData: Record<string, CharacterData> = {};
    Object.entries(state).forEach(([characterId, characterState]) => {
      if (
        uid === characterState.characterDocument.data?.uid &&
        (!currentCharacterId || characterId === currentCharacterId)
      ) {
        characterData[characterId] = {
          name: characterState.characterDocument.data?.name,
          stats: characterState.characterDocument.data?.stats,
          conditionMeters:
            characterState.characterDocument.data?.conditionMeters,
          adds: characterState.characterDocument.data?.adds,
          momentum: characterState.characterDocument.data?.momentum,
        };
      }
    });
    return characterData;
  });

export interface MoveRollOptions {
  move: Datasworn.Move;
}

export function MoveRollOptions(props: MoveRollOptions) {
  const { move } = props;
  const uid = useUID();
  const { characterId } = useParams<{
    characterId?: string;
    campaignId?: string;
  }>();
  const characterData = useAtomValue(
    useMemo(
      () => derivedCampaignCharacterState(uid, characterId),
      [uid, characterId]
    )
  );
  const campaignData = useAtomValue(derivedCampaignState);
  const actionRollOptions = extractActionRollOptions(move);

  return (
    <Box mt={1}>
      {Object.keys(characterData).length === 0 && (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {move.roll_type === "action_roll" && (
            <>
              {actionRollOptions.map((roll, index) => (
                <MoveActionRollChip key={index} rollOption={roll} />
              ))}
            </>
          )}
        </Box>
      )}
      {Object.entries(characterData).map(
        ([characterId, character], idx, arr) => (
          <Box
            key={characterId}
            display="flex"
            flexDirection="column"
            mt={idx === 0 ? 0 : 1}
          >
            {arr.length > 1 && (
              <Typography variant="overline">{character.name}</Typography>
            )}
            <Box display="flex" flexWrap="wrap" gap={1}>
              {move.roll_type === "action_roll" && (
                <>
                  {actionRollOptions.map((roll, index) => (
                    <MoveActionRollButton
                      rollOption={roll}
                      key={index}
                      characterId={characterId}
                      characterData={character}
                      campaignData={campaignData}
                      moveId={move._id}
                    />
                  ))}
                </>
              )}
            </Box>
          </Box>
        )
      )}
    </Box>
  );
}

function extractActionRollOptions(
  move: Datasworn.Move
): Datasworn.RollableValue[] {
  if (move.roll_type !== "action_roll") return [];

  const conditions = move.trigger.conditions;
  const conditionMap: Record<
    string,
    Record<string, Datasworn.RollableValue>
  > = {
    stats: {},
    conditionMeters: {},
    custom: {},
  };

  conditions.forEach((condition) => {
    condition.roll_options.forEach((option) => {
      if (option.using === "stat") {
        conditionMap.stats[option.stat] = option;
      } else if (option.using === "condition_meter") {
        conditionMap.conditionMeters[option.condition_meter] = option;
      } else if (option.using === "custom") {
        conditionMap.custom[option.label] = option;
      }
    });
  });

  return Object.values(conditionMap).flatMap((conditions) =>
    Object.values(conditions)
  );
}
