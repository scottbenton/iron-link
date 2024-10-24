import { AvatarGroup } from "@mui/material";

import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { useAuthAtom } from "atoms/auth.atom";
import { CampaignCharacterPortrait } from "pages/games/selectPage/CampaignCharacterPortrait";

export interface CampaignCharacterPortraitsProps {
  campaignCharacters: CampaignDocument["characters"];
}

export function CampaignCharacterPortraits(
  props: CampaignCharacterPortraitsProps,
) {
  const { campaignCharacters } = props;

  const uid = useAuthAtom()[0].uid;

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
