import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { useAtomValue } from "jotai";
import {
  campaignCharactersAtom,
  CharacterStore,
} from "pages/games/gamePageLayout/atoms/campaign.characters.atom";
import { useMemo } from "react";

export function useDerivedCharacterState<T>(
  characterId: string,
  select: (store: CharacterStore | undefined) => T
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(campaignCharactersAtom, (state) =>
          select(state[characterId])
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [characterId]
    )
  );
}
