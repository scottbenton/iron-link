import { AvatarGroup } from "@mui/material";

import { useUID } from "stores/auth.store";
import { GameCharacterDisplayDetails } from "stores/users.games.store";

import { GameCharacterPortrait } from "./GameCharacterPortrait";

export interface GameCharacterPortraitsProps {
  gameCharacterDetails: Record<string, GameCharacterDisplayDetails>;
}

export function GameCharacterPortraits(props: GameCharacterPortraitsProps) {
  const { gameCharacterDetails } = props;

  const uid = useUID();

  // Sort users from the current player to the front, then as they were
  const sortedCampaignCharacters = Object.entries(gameCharacterDetails).sort(
    ([, a], [, b]) => {
      if (a.uid !== b.uid) {
        if (a.uid === uid) {
          return -1;
        }
        if (b.uid === uid) {
          return 1;
        }
      }
      return a.name.localeCompare(b.name);
    },
  );

  return (
    <AvatarGroup max={4}>
      {sortedCampaignCharacters.map(([characterId, characterDetails]) => (
        <GameCharacterPortrait
          key={characterId}
          characterId={characterId}
          characterDetails={characterDetails}
        />
      ))}
    </AvatarGroup>
  );
}
