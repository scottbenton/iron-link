import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { useCharacterId } from "./useCharacterId";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
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
