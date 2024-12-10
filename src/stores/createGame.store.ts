import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/vanilla/shallow";

import {
  ExpansionConfig,
  GameType,
  RulesetConfig,
} from "repositories/game.repository";

import { GameService } from "services/game.service";

export interface CreateGameState {
  gameName: string;
  gameType: GameType;
  rulesets: RulesetConfig;
  expansions: ExpansionConfig;
}
interface CreateGameActions {
  createGame(name: string): Promise<string>;
  setGameName: (name: string) => void;
  setGameType: (gameType: GameType) => void;
  toggleRuleset: (rulesetKey: string, active: boolean) => void;
  toggleExpansion: (
    rulesetKey: string,
    expansionKey: string,
    active: boolean,
  ) => void;

  reset: () => void;
}

const defaultState: CreateGameState = {
  gameName: "",
  gameType: GameType.Solo,
  rulesets: {},
  expansions: {},
};

export const useCreateGameStore = createWithEqualityFn<
  CreateGameState & CreateGameActions
>()(
  immer((set, getState) => ({
    ...defaultState,
    createGame: (name: string) => {
      const { gameType, rulesets, expansions } = getState();
      return GameService.createGame(name, gameType, rulesets, expansions);
    },

    setGameName: (name) => {
      set((state) => {
        state.gameName = name;
      });
    },
    setGameType: (gameType) => {
      set((state) => {
        state.gameType = gameType;
      });
    },
    toggleRuleset: (rulesetKey, active) => {
      set((state) => {
        state.rulesets[rulesetKey] = active;
      });
    },
    toggleExpansion: (rulesetKey, expansionKey, active) => {
      set((state) => {
        if (!state.expansions[rulesetKey]) {
          state.expansions[rulesetKey] = {};
        }
        state.expansions[rulesetKey][expansionKey] = active;
      });
    },
    reset: () => {
      set((store) => {
        store.gameName = defaultState.gameName;
        store.gameType = defaultState.gameType;
        store.rulesets = { ...defaultState.rulesets };
        store.expansions = { ...defaultState.expansions };
      });
    },
  })),
  shallow,
);
