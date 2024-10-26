import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewOracleTableCollection } from "api-calls/homebrew/oracles/tables/_getRef";

export const listenToHomebrewOracleTables = createHomebrewListenerFunction(
  getHomebrewOracleTableCollection(),
);
