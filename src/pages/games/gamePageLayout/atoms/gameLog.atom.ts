import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { Roll } from "types/DieRolls.type";
import { useCampaignId } from "../hooks/useCampaignId";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "../hooks/usePermissions";
import { listenToLogs } from "api-calls/game-log/listenToLogs";
import { useDerivedAtomState } from "atoms/useDerivedAtomState";
import { rollDisplayAtom } from "atoms/rollDisplay.atom";

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
    (state) => state.totalLogsToLoad
  );
  const campaignId = useCampaignId();
  const isGuide =
    useCampaignPermissions().campaignPermission ===
    CampaignPermissionType.Guide;

  const setGameLogState = useSetAtom(gameLogAtom);
  const setRollDisplayRolls = useSetAtom(rollDisplayAtom);

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
        setRollDisplayRolls((displayRolls) => {
          const rollIndex = displayRolls.findIndex(({ id }) => id === logId);
          if (rollIndex >= 0) {
            const next = [...displayRolls];
            next[rollIndex] = {
              id: logId,
              roll: log,
            };
            return next;
          }
          return displayRolls;
        });
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
      setGameLogState({
        loading: true,
        logs: {},
        totalLogsToLoad: DEFAULT_AMOUNT_TO_LOAD,
      });
    };
  }, [
    totalLogsToLoad,
    setGameLogState,
    isGuide,
    campaignId,
    setRollDisplayRolls,
  ]);
}
