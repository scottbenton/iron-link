import { useAtomValue } from "jotai";
import { useMemo } from "react";

import {
  CharacterStore,
  campaignCharactersAtom,
} from "pages/games/gamePageLayout/atoms/campaign.characters.atom";

import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

import { useCharacterIdOptional } from "./useCharacterId";

export function useDerivedCharacterState<T>(
  characterId: string | undefined,
  select: (store: CharacterStore | undefined) => T,
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(campaignCharactersAtom, (state) =>
          select(characterId ? state[characterId] : undefined),
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [characterId],
    ),
  );
}

export function useDerivedCurrentCharacterState<T>(
  select: (store: CharacterStore | undefined) => T,
) {
  const characterId = useCharacterIdOptional();
  return useDerivedCharacterState(characterId, select);
}
