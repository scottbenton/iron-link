import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { atom, useAtomValue } from "jotai";

import { CampaignType } from "api-calls/campaign/_campaign.type";
import { authAtom } from "atoms/auth.atom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { currentCampaignAtom } from "pages/games/gamePageLayout/atoms/campaign.atom";

const campaignPermissions = derivedAtomWithEquality(
  currentCampaignAtom,
  (atom) => ({
    players: atom.campaign?.users ?? [],
    gmIds: atom.campaign?.gmIds ?? [],
    campaignType: atom.campaign?.type ?? CampaignType.Solo,
    characters: atom.campaign?.characters ?? [],
  }),
);

// Decreasing levels of ownership
export enum CharacterPermissionType {
  Owner,
  Guide,
  Viewer,
}
export enum CampaignPermissionType {
  Guide,
  Player,
  Viewer,
}

export function useCampaignPermissions() {
  const { characterId } = useParams<{ characterId?: string }>();

  const { campaignType, campaignPermission, permissionsByCharacter } =
    useAtomValue(
      useMemo(
        () =>
          atom((get) => {
            const currentUserUid = get(authAtom).uid;
            const { players, gmIds, campaignType, characters } =
              get(campaignPermissions);

            const isUserGuide = gmIds.includes(currentUserUid);
            const isUserPlayer = players.includes(currentUserUid);

            const characterPermissions: Record<
              string,
              CharacterPermissionType
            > = {};
            characters.forEach(({ characterId, uid }) => {
              if (currentUserUid === uid) {
                characterPermissions[characterId] =
                  CharacterPermissionType.Owner;
              } else if (isUserGuide) {
                characterPermissions[characterId] =
                  CharacterPermissionType.Guide;
              } else {
                characterPermissions[characterId] =
                  CharacterPermissionType.Viewer;
              }
            });

            return {
              campaignType,
              campaignPermission: isUserGuide
                ? CampaignPermissionType.Guide
                : isUserPlayer
                  ? CampaignPermissionType.Player
                  : CampaignPermissionType.Viewer,
              permissionsByCharacter: characterPermissions,
            };
          }),
        [],
      ),
    );

  return {
    campaignType,
    campaignPermission,
    permissionsByCharacter,
    characterPermission: characterId
      ? (permissionsByCharacter[characterId] ?? CharacterPermissionType.Viewer)
      : CharacterPermissionType.Viewer,
  };
}
