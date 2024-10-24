import { Datasworn } from "@datasworn/core";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { campaignCharactersAtom } from "pages/games/gamePageLayout/atoms/campaign.characters.atom";
import { useAtomValue } from "jotai";
import { useUID } from "atoms/auth.atom";
import { useMemo } from "react";
import { currentCampaignAtom } from "pages/games/gamePageLayout/atoms/campaign.atom";
import { ActionRolls, CharacterState } from "./RollOptions";
import { AssetEnhancements } from "./AssetEnhancements";
// import { ProgressRolls } from "./RollOptions/ProgressRolls";

const derivedCampaignState = derivedAtomWithEquality(
  currentCampaignAtom,
  (state) => ({
    conditionMeters: state.campaign?.conditionMeters ?? {},
    assets: state.sharedAssets.assets ?? {},
  })
);

const derivedCampaignCharacterState = (
  uid: string,
  currentCharacterId?: string
) =>
  derivedAtomWithEquality(campaignCharactersAtom, (state) => {
    const characterData: Record<string, CharacterState> = {};
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
          assets: characterState.assets?.assets ?? {},
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

  const hasRollOptions =
    actionRollOptions.length > 0 || move.roll_type === "progress_roll";
  const hasCharacterRollOptions =
    actionRollOptions.length > 0 && move.roll_type === "action_roll";
  return (
    <Box mt={hasRollOptions ? 1 : 0}>
      {/* {move.roll_type === "progress_roll" && (
        <ProgressRolls moveId={move._id} />
      )} */}
      {Object.keys(characterData).length === 0 && (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {move.roll_type === "action_roll" && (
            <ActionRolls
              moveId={move._id}
              actionRolls={actionRollOptions}
              campaignData={campaignData}
            />
          )}
        </Box>
      )}
      {hasCharacterRollOptions &&
        Object.entries(characterData).map(
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
              {move.roll_type === "action_roll" && (
                <ActionRolls
                  moveId={move._id}
                  actionRolls={actionRollOptions}
                  character={{ id: characterId, data: character }}
                  campaignData={campaignData}
                  includeAdds
                />
              )}
              <AssetEnhancements
                moveId={move._id}
                campaign={campaignData}
                assetDocuments={character.assets}
                character={{ id: characterId, data: character }}
              />
            </Box>
          )
        )}
      <AssetEnhancements
        moveId={move._id}
        campaign={campaignData}
        assetDocuments={campaignData.assets}
        character={
          characterId
            ? { id: characterId, data: characterData[characterId] }
            : undefined
        }
      />
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
    assetControls: {},
  };

  conditions.forEach((condition) => {
    condition.roll_options.forEach((option) => {
      if (option.using === "stat") {
        conditionMap.stats[option.stat] = option;
      } else if (option.using === "condition_meter") {
        conditionMap.conditionMeters[option.condition_meter] = option;
      } else if (option.using === "custom") {
        conditionMap.custom[option.label] = option;
      } else if (option.using === "asset_control") {
        conditionMap.assetControls[option.control] = option;
      }
    });
  });

  return Object.values(conditionMap).flatMap((conditions) =>
    Object.values(conditions)
  );
}
