import { AvatarGroup } from "@mui/material";

import { CampaignDocument } from "api-calls/campaign/_campaign.type";

import { useUID } from "stores/auth.store";

import { CampaignCharacterPortrait } from "./CampaignCharacterPortrait";

export interface CampaignCharacterPortraitsProps {
  campaignCharacters: CampaignDocument["characters"];
}

export function CampaignCharacterPortraits(
  props: CampaignCharacterPortraitsProps,
) {
  const { campaignCharacters } = props;

  const uid = useUID();

  // Sort users from the current player to the front, then as they were
  const sortedCampaignCharacters = campaignCharacters.sort((a, b) => {
    if (a.uid !== b.uid) {
      if (a.uid === uid) {
        return -1;
      }
      if (b.uid === uid) {
        return 1;
      }
    }
    return 0;
  });

  return (
    <AvatarGroup max={4}>
      {sortedCampaignCharacters.map((character) => (
        <CampaignCharacterPortrait
          key={character.characterId}
          characterId={character.characterId}
        />
      ))}
    </AvatarGroup>
  );
}
