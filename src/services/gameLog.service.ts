import { Timestamp } from "firebase/firestore";

import { StorageError } from "repositories/errors/storageErrors";
import {
  ClockProgressionRollDTO,
  GameLogDTO,
  GameLogRepository,
  OracleTableRollDTO,
  SpecialTrackProgressRollDTO,
  StatRollDTO,
  TrackProgressRollDTO,
} from "repositories/gameLog.repository";
import { RollResult } from "repositories/shared.types";

type RollWithDate<T> = Omit<T, "timestamp"> & { timestamp: Date };

export type IStatRoll = RollWithDate<StatRollDTO>;
export type IOracleTableRoll = RollWithDate<OracleTableRollDTO>;
export type ITrackProgressRoll = RollWithDate<TrackProgressRollDTO>;
export type ISpecialTrackProgressRoll =
  RollWithDate<SpecialTrackProgressRollDTO>;
export type IClockProgressionRoll = RollWithDate<ClockProgressionRollDTO>;

export type IGameLog =
  | IStatRoll
  | IOracleTableRoll
  | ITrackProgressRoll
  | ISpecialTrackProgressRoll
  | IClockProgressionRoll;

export class GameLogService {
  public static listenToGameLogs(
    gameId: string,
    isGuide: boolean,
    totalLogsToLoad: number,
    onLogChanges: (
      changedLogs: Record<string, IGameLog>,
      deletedLogIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return GameLogRepository.listenToGameLogs(
      gameId,
      isGuide,
      totalLogsToLoad,
      (changedLogs, deletedLogIds) => {
        const convertedChangedLogs = Object.fromEntries(
          Object.entries(changedLogs).map(([logId, logDTO]) => [
            logId,
            this.convertGameLogDTOToGameLog(logDTO),
          ]),
        );

        onLogChanges(convertedChangedLogs, deletedLogIds);
      },
      onError,
    );
  }

  public static async addGameLog(
    gameId: string,
    logId: string,
    log: IGameLog,
  ): Promise<string> {
    return GameLogRepository.setGameLog(
      gameId,
      logId,
      this.convertGameLogToGameLogDTO(log),
    );
  }

  public static async setGameLog(
    gameId: string,
    logId: string,
    log: IGameLog,
  ): Promise<string> {
    return GameLogRepository.setGameLog(
      gameId,
      logId,
      this.convertGameLogToGameLogDTO(log),
    );
  }

  public static async burnMomentumOnLog(
    gameId: string,
    logId: string,
    momentum: number,
    newResult: RollResult,
  ): Promise<void> {
    return GameLogRepository.updateGameLog(gameId, logId, {
      momentumBurned: momentum,
      result: newResult,
    });
  }

  public static async deleteGame(gameId: string, logId: string): Promise<void> {
    return GameLogRepository.deleteGameLog(gameId, logId);
  }

  private static convertGameLogDTOToGameLog(dto: GameLogDTO): IGameLog {
    return {
      ...dto,
      timestamp: dto.timestamp.toDate(),
    };
  }
  private static convertGameLogToGameLogDTO(gameLog: IGameLog): GameLogDTO {
    return {
      ...gameLog,
      timestamp: Timestamp.fromDate(gameLog.timestamp),
    };
  }
}
