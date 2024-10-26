import { getHomebrewAssetCollection } from "api-calls/homebrew/assets/assets/_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewAssets = createHomebrewListenerFunction(
  getHomebrewAssetCollection(),
);
