import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { RollResult } from "repositories/shared.types";

import { GameLogService, IGameLog } from "services/gameLog.service";

import { useAppState } from "./appState.store";
import { GamePermission, useGameStore } from "./game.store";

const DEFAULT_AMOUNT_TO_LOAD = 20;
const LOAD_MORE_AMOUNT = 20;

interface GameLogStoreState {
  logs: Record<string, IGameLog>;
  loading: boolean;
  error?: string;
  totalLogsToLoad: number;
}

interface GameLogStoreActions {
  listenToGameLogs: (
    gameId: string,
    isGuide: boolean,
    totalLogsToLoad: number,
  ) => () => void;
  loadMoreLogsIfPresent: () => void;

  createLog: (gameId: string, logId: string, log: IGameLog) => Promise<string>;
  setGameLog: (gameId: string, logId: string, log: IGameLog) => Promise<string>;
  burnMomentumOnLog: (
    gameId: string,
    logId: string,
    momentum: number,
    newResult: RollResult,
  ) => Promise<void>;
  deleteLog: (gameId: string, logId: string) => Promise<void>;
}

const defaultGameLogStoreState: GameLogStoreState = {
  logs: {},
  loading: true,
  totalLogsToLoad: DEFAULT_AMOUNT_TO_LOAD,
};

export const useGameLogStore = createWithEqualityFn<
  GameLogStoreState & GameLogStoreActions
>()(
  immer((set, getState) => ({
    ...defaultGameLogStoreState,

    listenToGameLogs: (gameId, isGuide, totalLogsToLoad) => {
      return GameLogService.listenToGameLogs(
        gameId,
        isGuide,
        totalLogsToLoad,
        (changedLogs, deletedLogIds) => {
          set((state) => {
            state.loading = false;
            state.error = undefined;
            state.logs = { ...state.logs, ...changedLogs };
            deletedLogIds.forEach((logId) => {
              delete state.logs[logId];
            });

            Object.entries(changedLogs).forEach(([logId, log]) => {
              useAppState.getState().updateRollIfPresent(logId, log);
            });
          });
        },
        (error) => {
          set((state) => {
            state.loading = false;
            state.error = error.message;
          });
        },
      );
    },

    loadMoreLogsIfPresent: () => {
      const state = getState();

      const areLogsLoading = state.loading;
      const logLength = Object.keys(state.logs).length;
      const doesLogLengthMatchTotal = logLength === state.totalLogsToLoad;

      if (logLength > 0 && !areLogsLoading && doesLogLengthMatchTotal) {
        set((store) => {
          store.totalLogsToLoad = store.totalLogsToLoad + LOAD_MORE_AMOUNT;
        });
      }
    },
    createLog: (gameId, logId, log) => {
      return GameLogService.addGameLog(gameId, logId, log);
    },
    setGameLog: (gameId, logId, log) => {
      return GameLogService.setGameLog(gameId, logId, log);
    },
    burnMomentumOnLog: (gameId, logId, momentum, newResult) => {
      return GameLogService.burnMomentumOnLog(
        gameId,
        logId,
        momentum,
        newResult,
      );
    },
    deleteLog: (gameId, logId) => {
      return GameLogService.deleteGame(gameId, logId);
    },
  })),
  deepEqual,
);

export function useListenToGameLogs(gameId: string | undefined) {
  const listenToLogs = useGameLogStore((state) => state.listenToGameLogs);
  const totalLogsToLoad = useGameLogStore((state) => state.totalLogsToLoad);

  const isGameLoading = useGameStore((state) => state.loading);
  const isGuide = useGameStore(
    (state) => state.gamePermissions === GamePermission.Guide,
  );

  useEffect(() => {
    if (gameId && !isGameLoading) {
      return listenToLogs(gameId, isGuide, totalLogsToLoad);
    }
  }, [listenToLogs, totalLogsToLoad, isGameLoading, isGuide, gameId]);
}
