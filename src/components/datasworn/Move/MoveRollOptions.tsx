import { Datasworn } from "@datasworn/core";
import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { currentCampaignAtom } from "pages/games/gamePageLayout/atoms/campaign.atom";
import { campaignCharactersAtom } from "pages/games/gamePageLayout/atoms/campaign.characters.atom";

import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

import { useUID } from "stores/auth.store";
import { useDataswornTree } from "stores/dataswornTree.store";

import { AssetEnhancements } from "./AssetEnhancements";
import {
  ActionRolls,
  CharacterRollOptionState,
  ProgressRolls,
} from "./RollOptions";
import { SpecialTracks } from "./RollOptions/SpecialTracks";
import { extractRollOptions } from "./RollOptions/extractRollOptions";

const derivedCampaignState = derivedAtomWithEquality(
  currentCampaignAtom,
  (state) => ({
    conditionMeters: state.campaign?.conditionMeters ?? {},
    assets: state.sharedAssets.assets ?? {},
  }),
);

const derivedCampaignCharacterState = (
  uid: string | undefined,
  currentCharacterId?: string,
) =>
  derivedAtomWithEquality(campaignCharactersAtom, (state) => {
    const characterData: Record<string, CharacterRollOptionState> = {};
    Object.entries(state).forEach(([characterId, characterState]) => {
      if (
        uid &&
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
          specialTracks: characterState.characterDocument.data?.specialTracks,
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
      [uid, characterId],
    ),
  );
  const dataswornTree = useDataswornTree();
  const campaignData = useAtomValue(derivedCampaignState);
  const rollOptions = useMemo(
    () => extractRollOptions(move, campaignData, characterData, dataswornTree),
    [move, campaignData, characterData, dataswornTree],
  );

  return (
    <Box>
      {rollOptions.visibleProgressTrack && (
        <ProgressRolls
          moveId={move._id}
          moveName={move.name}
          trackType={rollOptions.visibleProgressTrack}
        />
      )}
      <AssetEnhancements enhancements={rollOptions.sharedEnhancements} />
      {Object.entries(rollOptions.character).map(
        ([rollOptionCharacterId, characterRollOptions], idx) => (
          <Box
            key={rollOptionCharacterId}
            display="flex"
            flexDirection="column"
            mt={
              Object.keys(rollOptions.sharedEnhancements).length === 0 &&
              idx === 0
                ? 0
                : 1
            }
            gap={1}
          >
            {!characterId && (
              <Typography variant="overline">
                {characterData[rollOptionCharacterId].name}
              </Typography>
            )}
            <AssetEnhancements
              enhancements={characterRollOptions.assetEnhancements}
            />
            {characterRollOptions.specialTracks && (
              <SpecialTracks
                moveId={move._id}
                moveName={move.name}
                tracks={characterRollOptions.specialTracks}
                characterData={characterData[rollOptionCharacterId]}
              />
            )}
            {characterRollOptions.actionRolls.length > 0 && (
              <ActionRolls
                moveId={move._id}
                actionRolls={characterRollOptions.actionRolls}
                character={{
                  id: rollOptionCharacterId,
                  data: characterData[rollOptionCharacterId],
                }}
                campaignData={campaignData}
                includeAdds
              />
            )}
          </Box>
        ),
      )}
    </Box>
  );
}
