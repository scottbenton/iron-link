import { Unsubscribe } from "firebase/firestore";
import { t } from "i18next";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

import { CharacterDocument } from "api-calls/character/_character.type";
import { listenToUsersCharacters } from "api-calls/character/listenToUsersCharacters";

import { getErrorMessage } from "lib/getErrorMessage";

import { useCurrentUserUID } from "./auth.atom";

const usersCharactersAtom = atom<{
  characters: Record<string, CharacterDocument>;
  loading: boolean;
  error?: string;
}>({
  characters: {},
  loading: true,
});

export function useUsersCharacters() {
  return useAtomValue(usersCharactersAtom);
}

export function useSyncUsersCharacters() {
  const uid = useCurrentUserUID();
  const [, setUsersCharacters] = useAtom(usersCharactersAtom);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;

    if (uid) {
      unsubscribe = listenToUsersCharacters(
        uid,
        {
          onDocChange: (id, character) => {
            setUsersCharacters((prev) => ({
              ...prev,
              characters: {
                ...prev.characters,
                [id]: character,
              },
              loading: false,
              error: undefined,
            }));
          },
          onDocRemove: (id) => {
            setUsersCharacters((prev) => {
              const newCharacters = { ...prev.characters };
              delete newCharacters[id];
              return {
                characters: newCharacters,
                loading: false,
                error: undefined,
              };
            });
          },
          onLoaded: () => {
            setUsersCharacters((prev) => ({
              ...prev,
              loading: false,
              error: undefined,
            }));
          },
        },
        (error) => {
          const errorMessage = getErrorMessage(
            error,
            t("character.load-failure", "Failed to load characters"),
          );
          setUsersCharacters((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        },
      );
    }

    return () => {
      unsubscribe?.();
    };
  }, [setUsersCharacters, uid]);
}
