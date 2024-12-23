import {
  CollectionReference,
  DocumentReference,
  PartialWithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import {
  NotFoundError,
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { ColorScheme } from "./shared.types";
import { SpecialTrack } from "./shared.types";
import { Tables } from "types/supabase-generated.type";
import { supabase } from "lib/supabase.lib";

export enum GameType {
  Solo = "solo",
  Coop = "co-op",
  Guided = "guided",
}

export type RulesetConfig = Record<string, boolean>;
export type ExpansionConfig = Record<string, Record<string, boolean>>;

export interface LegacyGameDTO {
  name: string;
  playerIds: string[];
  guideIds: string[];
  worldId: string | null;
  conditionMeters: Record<string, number>;
  specialTracks: Record<string, SpecialTrack>;
  gameType: GameType;
  colorScheme: ColorScheme | null;

  rulesets: RulesetConfig;
  expansions: ExpansionConfig;
}

export type PartialGameDTO = PartialWithFieldValue<LegacyGameDTO>;

export type GameDTO = Tables<'games'>;
export type GamePlayerDTO = Tables<'game_players'>;

export class GameRepostiory {
  public static games = supabase.from("games");
  public static gamePlayers = supabase.from("game_players");

  public static collectionName = "games";

  private static getCollectionRef(): CollectionReference<LegacyGameDTO> {
    return collection(
      firestore,
      this.collectionName,
    ) as CollectionReference<LegacyGameDTO>;
  }
  private static getDocRef(gameId: string): DocumentReference<LegacyGameDTO> {
    return doc(
      firestore,
      `${this.collectionName}/${gameId}`,
    ) as DocumentReference<LegacyGameDTO>;
  }

  public static async getGameInviteInfo(gameId: string, userId: string): Promise<{name: string, game_type: GameDTO['game_type'], isPlayer: boolean}> {
    return new Promise((res, reject) => {
      const gamePromise = this.games.select('name, game_type');
      const playerPromise = this.gamePlayers.select('user_id').eq('game_id', gameId).eq('user_id', userId);

      Promise.all([gamePromise, playerPromise]).then(([gameResult, playerResult]) => {
        const isPlayer = (playerResult.data?.length ?? 0) > 0;

        if (gameResult.error) {
          reject(
            convertUnknownErrorToStorageError(
              gameResult.error,
              `Failed to get game with id ${gameId}`,
            ));
        } else {
          res({ name: gameResult.data[0].name, game_type: gameResult.data[0].game_type, isPlayer })
        }
      });
    });
  }

  public static async getGame(gameId: string): Promise<GameDTO> {
    const { data, error } = await this.games
      .select('*')
      .eq('id', gameId)
      .single();

    if (error) {
      throw convertUnknownErrorToStorageError(
        error,
        `Failed to get game with id ${gameId}`
      );
    }

    return data;
  }

  public static listenToGame(
    gameId: string,
    onGame: (game: GameDTO) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    // Fetch the initial state
    this.getGame(gameId)
      .then(onGame)
      .catch(onError);
    
    console.debug("LISTENING TO GAME", gameId);
    const subscription = supabase.channel(`game_${gameId}_changes`).on<GameDTO>('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'games',
      filter: `id=eq.${gameId}`,
    }, (payload) => {
      if (payload.errors) {
        console.debug(payload.errors);
      }
      console.debug("GOT PAYLOAD", payload);
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        onGame(payload.new);
      } else {
        onError(new NotFoundError(`Game with id ${gameId} was deleted`));
      }
    }).subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }

  public static async getUsersGames(
    userId: string,
  ): Promise<GameDTO[]> {
    return new Promise((resolve, reject) => {

    this.games.select('*, game_players(*)').eq('game_players.user_id', userId)
        .then(({ data, error }) => {
        if (error) {
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Failed to get games for user with id ${userId}`,
            ));
        } else {
          resolve(data)
        }
      });
    });
  }

  public static async updateGame(
    gameId: string,
    game: PartialGameDTO,
  ): Promise<void> {
    return new Promise<void>((res, reject) => {
      updateDoc(this.getDocRef(gameId), game)
        .then(() => {
          res();
        })
        .catch((err) => {
          reject(
            convertUnknownErrorToStorageError(
              err,
              `Failed to update game with id ${gameId}`,
            ),
          );
        });
    });
  }

  public static async deleteGame(gameId: string): Promise<void> {
    return new Promise<void>((res, reject) => {
      deleteDoc(this.getDocRef(gameId))
        .then(() => {
          res();
        })
        .catch((err) => {
          reject(
            convertUnknownErrorToStorageError(
              err,
              `Failed to remove game with id ${gameId}`,
            ),
          );
        });
    });
  }

  public static async createGame(game: LegacyGameDTO): Promise<string> {
    return new Promise<string>((res, reject) => {
      addDoc(this.getCollectionRef(), game)
        .then((doc) => {
          res(doc.id);
        })
        .catch((err) => {
          reject(
            convertUnknownErrorToStorageError(err, `Failed to create new game`),
          );
        });
    });
  }
}
