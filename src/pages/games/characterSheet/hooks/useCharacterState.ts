import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { useCharacterId } from "pages/games/characterSheet/hooks/useCharacterId";
import { campaignCharactersAtom } from "pages/games/gamePageLayout/atoms/campaign.characters.atom";

export function useCharacterState() {
  const characterId = useCharacterId();
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(campaignCharactersAtom, (atom) => ({
          hasCharacter: !!atom[characterId]?.characterDocument,
          error: atom.error,
        })),
      [characterId],
    ),
  );
}
