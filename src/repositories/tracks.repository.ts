import {
  CollectionReference,
  DocumentReference,
  PartialWithFieldValue,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import {
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { GameRepostiory } from "./game.repository";

export interface BaseTrackDTO {
  label: string;
  type: TrackSectionTracks;
  description?: string;
  value: number;
  status: TrackStatus;
  createdTimestamp: Timestamp;
}

export interface ProgressTrackDTO extends BaseTrackDTO {
  type: TrackSectionProgressTracks;
  difficulty: Difficulty;
}

export interface SceneChallengeDTO extends BaseTrackDTO {
  type: TrackTypes.SceneChallenge;
  segmentsFilled: number;
  difficulty: Difficulty;
}

export interface ClockDTO extends BaseTrackDTO {
  type: TrackTypes.Clock;
  segments: number;
  oracleKey?: AskTheOracle;
}

export type TrackDTO = ProgressTrackDTO | ClockDTO | SceneChallengeDTO;

export type PartialTrackDTO = PartialWithFieldValue<TrackDTO>;

export class TracksRepository {
  private static collectionName = "tracks";

  public static getTrackCollectionName(gameId: string): string {
    return `${GameRepostiory.collectionName}/${gameId}/${this.collectionName}`;
  }
  private static getGameTrackCollectionRef(gameId: string) {
    return collection(
      firestore,
      this.getTrackCollectionName(gameId),
    ) as CollectionReference<TrackDTO>;
  }

  private static getDocRef(
    gameId: string,
    trackId: string,
  ): DocumentReference<TrackDTO> {
    return doc(
      firestore,
      `${this.getTrackCollectionName(gameId)}/${trackId}`,
    ) as DocumentReference<TrackDTO>;
  }

  public static listenToGameTracks(
    gameId: string,
    onTrackChanges: (
      changedTracks: Record<string, TrackDTO>,
      deletedTrackIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return onSnapshot(
      this.getGameTrackCollectionRef(gameId),
      (snapshot) => {
        const changedTracks: Record<string, TrackDTO> = {};
        const deletedTrackIds: string[] = [];

        snapshot.docChanges().forEach((change) => {
          const track = change.doc.data();
          switch (change.type) {
            case "added":
            case "modified":
              changedTracks[change.doc.id] = track;
              break;
            case "removed":
              deletedTrackIds.push(change.doc.id);
              break;
          }
        });

        onTrackChanges(changedTracks, deletedTrackIds);
      },
      (error) => {
        onError(
          convertUnknownErrorToStorageError(
            error,
            "Failed to listen to tracks",
          ),
        );
      },
    );
  }

  public static async createTrack(
    gameId: string,
    track: TrackDTO,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      addDoc(collection(firestore, this.getTrackCollectionName(gameId)), track)
        .then((docRef) => {
          resolve(docRef.id);
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              "Track could not be created",
            ),
          );
        });
    });
  }

  public static async updateTrack(
    gameId: string,
    trackId: string,
    track: PartialTrackDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      updateDoc(this.getDocRef(gameId, trackId), track)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              "Track could not be updated",
            ),
          );
        });
    });
  }

  public static async deleteTrack(
    gameId: string,
    trackId: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      deleteDoc(this.getDocRef(gameId, trackId))
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              "Track could not be deleted",
            ),
          );
        });
    });
  }
}

export enum TrackTypes {
  Vow = "vow",
  Journey = "journey",
  Fray = "fray",
  BondProgress = "bondProgress",
  Clock = "clock",
  SceneChallenge = "sceneChallenge",
}

export type ProgressTracks =
  | TrackTypes.BondProgress
  | TrackTypes.Fray
  | TrackTypes.Journey
  | TrackTypes.Vow;
export type TrackSectionProgressTracks =
  | TrackTypes.Fray
  | TrackTypes.Journey
  | TrackTypes.Vow;
export type TrackSectionTracks =
  | TrackSectionProgressTracks
  | TrackTypes.Clock
  | TrackTypes.SceneChallenge;

export enum TrackStatus {
  Active = "active",
  Completed = "completed",
}

export enum Difficulty {
  Troublesome = "troublesome",
  Dangerous = "dangerous",
  Formidable = "formidable",
  Extreme = "extreme",
  Epic = "epic",
}

export enum AskTheOracle {
  AlmostCertain = "almost_certain",
  Likely = "likely",
  FiftyFifty = "fifty_fifty",
  Unlikely = "unlikely",
  SmallChance = "small_chance",
}
