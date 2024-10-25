import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewMoveCollection } from "api-calls/homebrew/moves/moves/_getRef";

export const listenToHomebrewMoves = createHomebrewListenerFunction(
  getHomebrewMoveCollection(),
);
