import { addDoc } from "firebase/firestore";

import { getHomebrewOracleTableCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewOracleTableDocument } from "api-calls/homebrew/oracles/tables/_homebrewOracleTable.type";

export const createHomebrewOracleTable = createApiFunction<
  { oracleTable: HomebrewOracleTableDocument },
  void
>((params) => {
  const { oracleTable } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewOracleTableCollection(), oracleTable)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create oracle table.");
