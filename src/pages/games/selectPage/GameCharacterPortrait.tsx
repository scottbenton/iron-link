import { PortraitAvatar } from "components/characters/PortraitAvatar";

import { GameCharacterDisplayDetails } from "stores/users.games.store";

export interface GameCharacterPortraitProps {
  characterId: string;
  characterDetails: GameCharacterDisplayDetails;
}

export function GameCharacterPortrait(props: GameCharacterPortraitProps) {
  const { characterId, characterDetails } = props;

  return (
    <PortraitAvatar
      characterId={characterId}
      portraitSettings={characterDetails.profileImageSettings ?? undefined}
      name={characterDetails.name}
      size={"small"}
    />
  );
}
