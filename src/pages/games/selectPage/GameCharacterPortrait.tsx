import { PortraitAvatar } from "components/characters/PortraitAvatar";

import { useUsersGames } from "stores/users.games.store";

export interface GameCharacterPortraitProps {
  characterId: string;
}

export function GameCharacterPortrait(props: GameCharacterPortraitProps) {
  const { characterId } = props;
  const characterPortraitSettings = useUsersGames(
    (store) => store.characterDisplayDetails[characterId],
  );

  return (
    <PortraitAvatar
      characterId={characterId}
      portraitSettings={
        characterPortraitSettings?.profileImageSettings ?? undefined
      }
      name={characterPortraitSettings?.name}
      size={"small"}
    />
  );
}
