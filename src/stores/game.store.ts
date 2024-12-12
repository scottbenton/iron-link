import { Datasworn } from "@datasworn/core";
import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";

import { GameType } from "repositories/game.repository";

import { IAsset } from "services/asset.service";
import { GameService, IGame } from "services/game.service";

import { useUID } from "./auth.store";
import { useSetDataswornTree } from "./dataswornTree.store";

export enum GamePermission {
  Guide = "guide",
  Player = "player",
  Viewer = "viewer",
}

interface GameStoreState {
  gameId: string;
  game: IGame | null;

  gamePermissions: GamePermission;

  loading: boolean;
  error?: string;

  sharedAssets: {
    loading: boolean;
    assets: Record<string, IAsset>;
    error?: string;
  };
}
interface GameStoreActions {
  listenToGame: (gameId: string) => () => void;
  setPermissions: (permissions: GamePermission) => void;
  updateConditionMeter: (
    gameId: string,
    conditionMeterKey: string,
    value: number,
  ) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
}

const defaultGameStoreState: GameStoreState = {
  gameId: "",
  game: null,
  gamePermissions: GamePermission.Viewer,
  loading: true,
  sharedAssets: {
    loading: true,
    assets: {},
  },
};

export const useGameStore = createWithEqualityFn<
  GameStoreState & GameStoreActions
>()(
  immer((set) => ({
    ...defaultGameStoreState,
    listenToGame: (gameId: string) => {
      set((state) => {
        state.gameId = gameId;
      });
      const gameUnsubscribe = GameService.listenToGame(
        gameId,
        (game) => {
          set((state) => {
            state.game = game;
            state.loading = false;
            state.error = undefined;
          });
        },
        (error) => {
          console.error(error);
          set((state) => {
            state.loading = false;
            state.error = "Failed to load game";
          });
        },
      );
      return () => {
        set((state) => ({
          ...state,
          ...defaultGameStoreState,
        }));
        gameUnsubscribe();
      };
    },
    setPermissions: (permissions) => {
      set((state) => {
        state.gamePermissions = permissions;
      });
    },
    updateConditionMeter: (gameId, conditionMeterKey, value) => {
      return GameService.updateConditionMeter(gameId, conditionMeterKey, value);
    },
    deleteGame: (gameId) => {
      return GameService.deleteGame(gameId);
    },
  })),
  deepEqual,
);

export function useListenToGame(gameId: string | undefined) {
  const uid = useUID();

  const gamePlayers = useGameStore((state) => state.game?.playerIds ?? []);
  const gameGuides = useGameStore((state) => state.game?.guideIds ?? []);
  const gameType = useGameStore((state) => state.game?.gameType);

  const expansionsAndRulesets = useGameStore((store) => ({
    expansions: store.game?.expansions ?? {},
    rulesets: store.game?.rulesets ?? {},
  }));
  const setDataswornTree = useSetDataswornTree();

  const listenToGame = useGameStore((state) => state.listenToGame);
  const setPermissions = useGameStore((state) => state.setPermissions);

  useEffect(() => {
    if (gameId) {
      return listenToGame(gameId);
    }
  }, [gameId, listenToGame]);

  useEffect(() => {
    if (gameId) {
      if (!uid) {
        setPermissions(GamePermission.Viewer);
      } else if (
        (gameType === GameType.Solo || gameType === GameType.Coop) &&
        gamePlayers.includes(uid)
      ) {
        setPermissions(GamePermission.Guide);
      } else if (gameGuides.includes(uid)) {
        setPermissions(GamePermission.Guide);
      } else if (gamePlayers.includes(uid)) {
        setPermissions(GamePermission.Player);
      } else {
        setPermissions(GamePermission.Viewer);
      }
    }
  }, [gamePlayers, gameGuides, gameId, gameType, setPermissions, uid]);

  useEffect(() => {
    const dataswornTree: Record<string, Datasworn.RulesPackage> = {};
    Object.entries(expansionsAndRulesets.rulesets)
      .filter(([, value]) => value)
      .forEach(([key]) => {
        dataswornTree[key] = defaultBaseRulesets[key];
        Object.entries(expansionsAndRulesets.expansions[key] ?? {})
          .filter(([, value]) => value)
          .forEach(([expansionId]) => {
            dataswornTree[expansionId] = defaultExpansions[key]?.[expansionId];
          });
      });
    setDataswornTree(dataswornTree);

    return () => {
      setDataswornTree({});
    };
  }, [expansionsAndRulesets, setDataswornTree]);
}
