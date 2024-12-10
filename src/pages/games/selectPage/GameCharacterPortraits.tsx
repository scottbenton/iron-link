import { AvatarGroup } from "@mui/material";

import { useUID } from "stores/auth.store";

import { IGame } from "services/game.service";

import { GameCharacterPortrait } from "./GameCharacterPortrait";

export interface GameCharacterPortraitsProps {
  gameCharacters: IGame["characters"];
}

export function CampaignCharacterPortraits(props: GameCharacterPortraitsProps) {
  const { gameCharacters } = props;

  const uid = useUID();

  // Sort users from the current player to the front, then as they were
  const sortedCampaignCharacters = gameCharacters.sort((a, b) => {
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
        <GameCharacterPortrait
          key={character.characterId}
          characterId={character.characterId}
        />
      ))}
    </AvatarGroup>
  );
}
