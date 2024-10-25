import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewOracleCollectionCollection } from "api-calls/homebrew/oracles/collections/_getRef";

export const listenToHomebrewOracleCollections = createHomebrewListenerFunction(
  getHomebrewOracleCollectionCollection(),
);
