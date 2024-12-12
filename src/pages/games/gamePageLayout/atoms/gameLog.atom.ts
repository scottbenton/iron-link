import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";

import { Roll } from "types/DieRolls.type";

import { listenToLogs } from "api-calls/game-log/listenToLogs";

import { useDerivedAtomState } from "atoms/useDerivedAtomState";

import { useAppState } from "stores/appState.store";
import { GamePermission } from "stores/game.store";

import { useGameId } from "../hooks/useGameId";
import { useCampaignPermissions } from "../hooks/usePermissions";

const DEFAULT_AMOUNT_TO_LOAD = 20;
const LOAD_MORE_AMOUNT = 20;

export const gameLogAtom = atom<{
  loading: boolean;
  logs: Record<string, Roll>;
  error?: string;
  totalLogsToLoad: number;
}>({
  loading: true,
  logs: {},
  totalLogsToLoad: DEFAULT_AMOUNT_TO_LOAD,
});

export function useGameLogs() {
  return useAtomValue(gameLogAtom);
}

export function useLoadMoreLogs() {
  const setGameLogState = useSetAtom(gameLogAtom);

  return useCallback(() => {
    setGameLogState((prev) => ({
      ...prev,
      loading: true,
      totalLogsToLoad: prev.totalLogsToLoad + LOAD_MORE_AMOUNT,
    }));
  }, [setGameLogState]);
}

export function useListenToLogs() {
  const totalLogsToLoad = useDerivedAtomState(
    gameLogAtom,
    (state) => state.totalLogsToLoad,
  );
  const campaignId = useGameId();
  const isGuide =
    useCampaignPermissions().gamePermission === GamePermission.Guide;

  const setGameLogState = useSetAtom(gameLogAtom);
  const updateRollIfPresent = useAppState((state) => state.updateRollIfPresent);

  useEffect(() => {
    const unsubscribe = listenToLogs({
      campaignId,
      isGM: isGuide,
      totalLogsToLoad,
      updateLog: (logId, log) => {
        setGameLogState((state) => {
          const newState = { ...state, loading: false, error: undefined };
          newState.logs = { ...state.logs };
          newState.logs[logId] = log;
          return newState;
        });
        updateRollIfPresent(logId, log);
      },
      removeLog: (logId) => {
        setGameLogState((state) => {
          const newState = { ...state, loading: false, error: undefined };
          newState.logs = { ...state.logs };
          delete newState.logs[logId];
          return newState;
        });
      },
      onLoaded: () => {
        setGameLogState((prev) => ({
          ...prev,
          loading: false,
          error: undefined,
        }));
      },
      onError: (error) => {
        setGameLogState((state) => ({ ...state, loading: false, error }));
      },
    });
    return () => {
      unsubscribe?.();
    };
  }, [
    totalLogsToLoad,
    setGameLogState,
    isGuide,
    campaignId,
    updateRollIfPresent,
  ]);

  useEffect(() => {
    return () => {
      setGameLogState({
        loading: true,
        logs: {},
        totalLogsToLoad: DEFAULT_AMOUNT_TO_LOAD,
      });
    };
  }, [campaignId, setGameLogState]);
}
