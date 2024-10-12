import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { useAtomValue } from "jotai";
import {
  campaignCharactersAtom,
  CharacterStore,
} from "pages/games/gamePageLayout/atoms/campaign.characters.atom";
import { useMemo } from "react";

export function useDerivedCharacterState<T>(
  characterId: string | undefined,
  select: (store: CharacterStore | undefined) => T
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(campaignCharactersAtom, (state) =>
          select(characterId ? state[characterId] : undefined)
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [characterId]
    )
  );
}
