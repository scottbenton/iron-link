import deepEqual from "fast-deep-equal";
import { useEffect, useRef } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { StorageError, UnknownError } from "repositories/errors/storageErrors";

import { CharacterService, ICharacter } from "services/character.service";
import { GameService, IGame } from "services/game.service";

import { useUID } from "./auth.store";

export interface GameCharacterDisplayDetails {
  name: string;
  profileImageSettings: ICharacter["profileImage"];
  profileImageURL: string | null;
  uid: string;
}

interface UsersGamesState {
  games: Record<string, IGame>;
  characterDisplayDetails: Record<
    string,
    Record<string, GameCharacterDisplayDetails>
  >;
  loading: boolean;
  error?: StorageError;
}

interface UsersGamesActions {
  loadUsersGames: () => Promise<void>;
}

export const useUsersGames = createWithEqualityFn<
  UsersGamesState & UsersGamesActions
>()(
  immer((set) => ({
    games: {},
    characterDisplayDetails: {},
    loading: true,

    loadUsersGames: async () => {
      try {
        const games = await GameService.getUsersGames();
        set((state) => {
          state.loading = false;
          state.games = games;
          state.error = undefined;
        });

        const characterMap = await CharacterService.getCharactersInGames(
          Object.keys(games),
        );

        const portraitPromises: Record<string, Promise<string>> = {};
        Object.entries(characterMap).forEach(([characterId, character]) => {
          if (character.profileImage) {
            portraitPromises[characterId] =
              CharacterService.getCharacterPortraitURL(
                characterId,
                character.profileImage.filename,
              );
          }
        });

        const resolvedEntries = await Promise.all(
          Object.entries(portraitPromises).map(async ([key, promise]) => [
            key,
            await promise,
          ]),
        );
        const portraitURLs = Object.fromEntries(resolvedEntries);

        set((state) => {
          const characterDisplayDetails: UsersGamesState["characterDisplayDetails"] =
            {};

          Object.entries(characterMap).forEach(([characterId, character]) => {
            if (!characterDisplayDetails[character.gameId]) {
              characterDisplayDetails[character.gameId] = {};
            }
            characterDisplayDetails[character.gameId][characterId] = {
              name: character.name,
              profileImageSettings: character.profileImage,
              profileImageURL: portraitURLs[characterId] ?? null,
              uid: character.uid,
            };
          });
          state.characterDisplayDetails = characterDisplayDetails;
        });
      } catch (e) {
        console.error(e);
        set((state) => {
          state.loading = false;
          state.error = new UnknownError("Failed to load games");
        });
      }
    },
  })),
  deepEqual,
);

export function useLoadUsersGames() {
  const loadUsersGames = useUsersGames((state) => state.loadUsersGames);
  const uid = useUID();
  const loadingRef = useRef(false);
  useEffect(() => {
    if (uid) {
      loadingRef.current = true;
      loadUsersGames();
    }
  }, [uid, loadUsersGames]);
}
