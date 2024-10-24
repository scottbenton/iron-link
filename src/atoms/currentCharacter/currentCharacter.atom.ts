import { useEffect } from "react";
import { Unsubscribe } from "firebase/firestore";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

import { CharacterDocument } from "api-calls/character/_character.type";
import { listenToCharacter } from "api-calls/character/listenToCharacter";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { ColorScheme, colorSchemeAtom } from "atoms/theme.atom";

export const currentCharacterIdAtom = atom<string | null>(null);

export function useSetCurrentCharacterId() {
  const [, setCurrentCharacterId] = useAtom(currentCharacterIdAtom);
  return setCurrentCharacterId;
}

export const currentCharacterAtom = atom<{
  characterId: string | null;
  character: CharacterDocument | null;
  loading: boolean;
  error?: string;
}>({
  characterId: null,
  character: null,
  loading: true,
});

export function useSyncCharacter() {
  const characterId = useAtomValue(currentCharacterIdAtom);
  const setCurrentCharacter = useSetAtom(currentCharacterAtom);
  const setColorScheme = useSetAtom(colorSchemeAtom);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;
    if (characterId) {
      // Fetch character data from API or database
      unsubscribe = listenToCharacter(
        characterId,
        (character) => {
          setCurrentCharacter({ characterId, character, loading: false });
          setColorScheme(character.colorScheme ?? ColorScheme.Default);
        },
        (error) => {
          console.error(error);
        },
      );
    } else {
      setCurrentCharacter({
        characterId: null,
        character: null,
        loading: false,
      });
      setColorScheme(ColorScheme.Default);
    }

    return () => {
      unsubscribe?.();
      setCurrentCharacter({
        characterId: null,
        character: null,
        loading: true,
      });
      setColorScheme(ColorScheme.Default);
    };
  }, [characterId, setCurrentCharacter, setColorScheme]);
}

const baseCharacterAtom = derivedAtomWithEquality(
  currentCharacterAtom,
  (atom) => ({
    loading: atom.loading,
    hasCharacter: atom.character !== null,
    error: atom.error,
  }),
);

export function useCharacterState() {
  return useAtomValue(baseCharacterAtom);
}
