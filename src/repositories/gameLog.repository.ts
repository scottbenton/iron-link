import {
  CollectionReference,
  DocumentReference,
  PartialWithFieldValue,
  QueryConstraint,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import {
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { GameRepostiory } from "./game.repository";
import { RollResult, RollType } from "./shared.types";
import { TrackTypes } from "./tracks.repository";

export interface BaseRollDTO {
  type: RollType;
  rollLabel: string;
  timestamp: Timestamp;
  characterId: string | null;
  uid: string;
  guidesOnly: boolean;
}
export interface StatRollDTO extends BaseRollDTO {
  type: RollType.Stat;
  moveId: string | null;
  rolled: string;
  action: number;
  actionTotal: number;
  challenge1: number;
  challenge2: number;
  modifier: number;
  matchedNegativeMomentum: boolean;
  adds: number;
  result: RollResult;
  momentumBurned: number | null;
}

export interface OracleTableRollDTO extends BaseRollDTO {
  type: RollType.OracleTable;
  roll: number | number[];
  result: string;
  oracleCategoryName?: string;
  oracleId?: string;
  match?: boolean;
}

export interface TrackProgressRollDTO extends BaseRollDTO {
  type: RollType.TrackProgress;
  challenge1: number;
  challenge2: number;
  trackProgress: number;
  result: RollResult;
  trackType: TrackTypes;
  moveId?: string;
}

export interface SpecialTrackProgressRollDTO extends BaseRollDTO {
  type: RollType.SpecialTrackProgress;
  challenge1: number;
  challenge2: number;
  trackProgress: number;
  result: RollResult;
  specialTrackKey: string;
  moveId?: string;
}

export interface ClockProgressionRollDTO extends BaseRollDTO {
  type: RollType.ClockProgression;
  roll: number;
  oracleTitle: string;
  result: string;
  oracleId?: string;
  match?: boolean;
}

export type GameLogDTO =
  | StatRollDTO
  | OracleTableRollDTO
  | TrackProgressRollDTO
  | SpecialTrackProgressRollDTO
  | ClockProgressionRollDTO;

export type PartialGameLogDTO = PartialWithFieldValue<GameLogDTO>;

export class GameLogRepository {
  private static collectionName = "game-log";

  private static getGameLogCollectionName(gameId: string): string {
    return `${GameRepostiory.collectionName}/${gameId}/${this.collectionName}`;
  }
  private static getGameLogCollectionRef(gameId: string) {
    return collection(
      firestore,
      this.getGameLogCollectionName(gameId),
    ) as CollectionReference<GameLogDTO>;
  }
  private static getDocRef(gameId: string, logId: string) {
    return doc(
      firestore,
      `${this.getGameLogCollectionName(gameId)}/${logId}`,
    ) as DocumentReference<GameLogDTO>;
  }

  public static listenToGameLogs(
    gameId: string,
    isGuide: boolean,
    totalLogsToLoad: number,
    onLogChanges: (
      changedLogs: Record<string, GameLogDTO>,
      deletedLogIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    const collection = this.getGameLogCollectionRef(gameId);
    const queryConstraints: QueryConstraint[] = [
      limit(totalLogsToLoad),
      orderBy("timestamp", "desc"),
    ];
    if (!isGuide) {
      queryConstraints.push(where("guidesOnly", "==", false));
    }

    return onSnapshot(
      query(collection, ...queryConstraints),
      (snapshot) => {
        const changedLogs: Record<string, GameLogDTO> = {};
        const deletedLogIds: string[] = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            changedLogs[change.doc.id] = change.doc.data() as GameLogDTO;
          } else if (change.type === "removed") {
            deletedLogIds.push(change.doc.id);
          }
        });
        onLogChanges(changedLogs, deletedLogIds);
      },
      (error) => {
        console.error(error);
        onError(
          convertUnknownErrorToStorageError(
            error,
            "Failed to listen to game logs",
          ),
        );
      },
    );
  }

  public static async setGameLog(
    gameId: string,
    logId: string,
    log: GameLogDTO,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      setDoc(this.getDocRef(gameId, logId), log)
        .then(() => {
          resolve(logId);
        })
        .catch((e) => {
          console.error(e);
          reject(
            convertUnknownErrorToStorageError(e, "Failed to create game log"),
          );
        });
    });
  }

  public static async updateGameLog(
    gameId: string,
    logId: string,
    log: PartialGameLogDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      updateDoc(this.getDocRef(gameId, logId), log)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          console.error(e);
          reject(
            convertUnknownErrorToStorageError(e, "Failed to update game log"),
          );
        });
    });
  }

  public static async deleteGameLog(
    gameId: string,
    logId: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      deleteDoc(this.getDocRef(gameId, logId))
        .then(() => {
          resolve();
        })
        .catch((e) => {
          console.error(e);
          reject(
            convertUnknownErrorToStorageError(e, "Failed to delete game log"),
          );
        });
    });
  }
}
