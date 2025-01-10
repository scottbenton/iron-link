import { Tables } from "types/supabase-generated.type";

import { supabase } from "lib/supabase.lib";

import {
  NotFoundError,
  StorageError,
  UnknownError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { ColorScheme } from "./shared.types";
import { SpecialTrack } from "./shared.types";

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

export type GameDTO = Tables<"games">;
export type GameDTOUpdate = Partial<Omit<GameDTO, "id" | "created_at">>;

export class GameRepostiory {
  public static games = () => supabase.from("games");

  public static collectionName = "games";

  public static async getGameInviteInfo(gameId: string): Promise<{
    name: string;
    game_type: GameDTO["game_type"];
  }> {
    return new Promise((resolve, reject) => {
      this.games()
        .select("name, game_type")
        .eq("id", gameId)
        .single()
        .then((response) => {
          if (response.error) {
            console.error(response.error);
            reject(
              convertUnknownErrorToStorageError(
                response.error,
                "Failed to get game invite info",
              ),
            );
          } else {
            resolve(response.data);
          }
        });
    });
  }

  public static async getGame(gameId: string): Promise<GameDTO> {
    const { data, error } = await this.games()
      .select("*")
      .eq("id", gameId)
      .single();

    if (error) {
      throw convertUnknownErrorToStorageError(
        error,
        `Failed to get game with id ${gameId}`,
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
    this.getGame(gameId).then(onGame).catch(onError);

    const subscription = supabase
      .channel(`games:game_id=${gameId}`)
      .on<GameDTO>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.errors) {
            console.error(payload.errors);
            onError(new UnknownError("Failed to get game changes"));
          }
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            onGame(payload.new);
          } else {
            onError(new NotFoundError(`Game with id ${gameId} was deleted`));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  public static async getUsersGames(userId: string): Promise<GameDTO[]> {
    return new Promise((resolve, reject) => {
      this.games()
        .select("*, game_players!inner(*)")
        .eq("game_players.user_id", userId)
        .then(({ data, error }) => {
          console.debug(data);
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                `Failed to get games for user with id ${userId}`,
              ),
            );
          } else {
            resolve(data);
          }
        });
    });
  }

  public static async updateGame(
    gameId: string,
    game: GameDTOUpdate,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.games()
        .update(game)
        .eq("id", gameId)
        .then((response) => {
          if (response.error) {
            console.error(response.error);
            reject(
              convertUnknownErrorToStorageError(
                response.error,
                "Failed to update game",
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static async deleteGame(gameId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.games()
        .delete()
        .eq("id", gameId)
        .then((response) => {
          if (response.error) {
            reject(
              convertUnknownErrorToStorageError(
                response.error,
                "Failed to delete game",
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static async createGame(
    gameName: string,
    gameType: GameDTO["game_type"],
    rulesets: Record<string, boolean>,
    expansions: Record<string, Record<string, boolean>>,
  ): Promise<string> {
    return new Promise<string>((res, reject) => {
      this.games()
        .insert({
          name: gameName,
          game_type: gameType,
          rulesets,
          expansions,
        })
        .select()
        .single()
        .then((response) => {
          if (response.error || !response.data) {
            console.error(response.error);
            reject(
              convertUnknownErrorToStorageError(
                response.error,
                "Failed to create new game",
              ),
            );
          } else {
            res(response.data.id);
          }
        });
    });
  }
}
