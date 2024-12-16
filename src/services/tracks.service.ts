import { Timestamp } from "firebase/firestore";

import { StorageError } from "repositories/errors/storageErrors";
import {
  AskTheOracle,
  BaseTrackDTO,
  Difficulty,
  TrackDTO,
  TrackSectionProgressTracks,
  TrackStatus,
  TrackTypes,
  TracksRepository,
} from "repositories/tracks.repository";

export interface IBaseTrack extends Omit<BaseTrackDTO, "createdTimestamp"> {
  createdDate: Date;
}

export interface IProgressTrack extends IBaseTrack {
  type: TrackSectionProgressTracks;
  difficulty: Difficulty;
}

export interface ISceneChallenge extends IBaseTrack {
  type: TrackTypes.SceneChallenge;
  segmentsFilled: number;
  difficulty: Difficulty;
}

export interface IClock extends IBaseTrack {
  type: TrackTypes.Clock;
  segments: number;
  oracleKey?: AskTheOracle;
}

export type ITrack = IProgressTrack | IClock | ISceneChallenge;

export class TracksService {
  public static listenToGameTracks(
    gameId: string,
    onTrackChanges: (
      changedTracks: Record<string, ITrack>,
      deletedTrackIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return TracksRepository.listenToGameTracks(
      gameId,
      (changedTracks, deletedTrackIds) => {
        const convertedChangedTracks = Object.fromEntries(
          Object.entries(changedTracks).map(([trackId, trackDTO]) => [
            trackId,
            this.convertTrackDTOToTrack(trackDTO),
          ]),
        );

        onTrackChanges(convertedChangedTracks, deletedTrackIds);
      },
      onError,
    );
  }

  public static async createTrack(
    gameId: string,
    track: ITrack,
  ): Promise<string> {
    return TracksRepository.createTrack(
      gameId,
      this.convertTrackToTrackDTO(track),
    );
  }

  public static async setTrack(
    gameId: string,
    trackId: string,
    track: ITrack,
  ): Promise<void> {
    return TracksRepository.updateTrack(
      gameId,
      trackId,
      this.convertTrackToTrackDTO(track),
    );
  }

  public static async setTrackStatus(
    gameId: string,
    trackId: string,
    status: TrackStatus,
  ): Promise<void> {
    return TracksRepository.updateTrack(gameId, trackId, { status });
  }

  public static async updateTrackValue(
    gameId: string,
    trackId: string,
    value: number,
  ): Promise<void> {
    return TracksRepository.updateTrack(gameId, trackId, { value });
  }

  public static async updateSceneChallengeClockFilledSegments(
    gameId: string,
    trackId: string,
    filledSegments: number,
  ): Promise<void> {
    return TracksRepository.updateTrack(gameId, trackId, {
      segmentsFilled: filledSegments,
    });
  }

  public static async updateClockSelectedOracle(
    gameId: string,
    trackId: string,
    oracleKey: AskTheOracle,
  ): Promise<void> {
    return TracksRepository.updateTrack(gameId, trackId, { oracleKey });
  }

  public static async deleteTrack(
    gameId: string,
    trackId: string,
  ): Promise<void> {
    return TracksRepository.deleteTrack(gameId, trackId);
  }

  private static convertTrackToTrackDTO(track: ITrack): TrackDTO {
    const { createdDate, ...rest } = track;

    return {
      ...rest,
      createdTimestamp: Timestamp.fromDate(createdDate),
    };
  }

  private static convertTrackDTOToTrack(trackDTO: TrackDTO): ITrack {
    const { createdTimestamp, ...rest } = trackDTO;

    return {
      ...rest,
      createdDate: createdTimestamp.toDate(),
    };
  }
}
