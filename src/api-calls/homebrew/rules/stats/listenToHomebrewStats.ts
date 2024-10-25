import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewStatsCollection } from "api-calls/homebrew/rules/stats/_getRef";

export const listenToHomebrewStats = createHomebrewListenerFunction(
  getHomebrewStatsCollection(),
);
