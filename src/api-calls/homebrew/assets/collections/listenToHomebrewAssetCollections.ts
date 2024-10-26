import { getHomebrewAssetCollectionCollection } from "api-calls/homebrew/assets/collections/_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewAssetCollections = createHomebrewListenerFunction(
  getHomebrewAssetCollectionCollection(),
);
