import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewImpactsCollection } from "api-calls/homebrew/rules/impacts/_getRef";

export const listenToHomebrewImpacts = createHomebrewListenerFunction(
  getHomebrewImpactsCollection(),
);
