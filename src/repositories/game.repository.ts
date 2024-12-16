import {
  CollectionReference,
  DocumentReference,
  PartialWithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import {
  NotFoundError,
  StorageError,
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

export interface GameDTO {
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

export type PartialGameDTO = PartialWithFieldValue<GameDTO>;

export class GameRepostiory {
  public static collectionName = "games";

  private static getCollectionRef(): CollectionReference<GameDTO> {
    return collection(
      firestore,
      this.collectionName,
    ) as CollectionReference<GameDTO>;
  }
  private static getDocRef(gameId: string): DocumentReference<GameDTO> {
    return doc(
      firestore,
      `${this.collectionName}/${gameId}`,
    ) as DocumentReference<GameDTO>;
  }

  public static async getGame(gameId: string): Promise<GameDTO> {
    return new Promise<GameDTO>((res, reject) => {
      getDoc(this.getDocRef(gameId))
        .then((doc) => {
          if (doc.exists()) {
            res(doc.data() as GameDTO);
          } else {
            reject(
              new NotFoundError(`Game with id ${gameId} could not be found`),
            );
          }
        })
        .catch((err) => {
          reject(
            convertUnknownErrorToStorageError(
              err,
              `Game with id ${gameId} could not be found`,
            ),
          );
        });
    });
  }

  public static listenToGame(
    gameId: string,
    onGame: (game: GameDTO) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return onSnapshot(
      this.getDocRef(gameId),
      (doc) => {
        if (doc.exists()) {
          onGame(doc.data() as GameDTO);
        } else {
          onError(
            new NotFoundError(`Game with id ${gameId} could not be found`),
          );
        }
      },
      (error) => {
        onError(
          convertUnknownErrorToStorageError(
            error,
            `Failed to get game with id ${gameId}`,
          ),
        );
      },
    );
  }

  public static async getUsersGames(
    userId: string,
  ): Promise<Record<string, GameDTO>> {
    const usersGamesQuery = query(
      this.getCollectionRef(),
      where("playerIds", "array-contains", userId),
    );
    return new Promise((res, reject) => {
      getDocs(usersGamesQuery)
        .then((snapshot) => {
          const games: Record<string, GameDTO> = {};
          snapshot.docs.forEach((gameDoc) => {
            games[gameDoc.id] = gameDoc.data() as GameDTO;
          });
          res(games);
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Failed to get games for user with id ${userId}`,
            ),
          );
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

  public static async createGame(game: GameDTO): Promise<string> {
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
