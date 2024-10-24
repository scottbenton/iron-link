import { deleteDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewOracleTableDoc } from "api-calls/homebrew/oracles/tables/_getRef";

export const deleteHomebrewOracleTable = createApiFunction<
  {
    oracleTableId: string;
  },
  void
>((params) => {
  const { oracleTableId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewOracleTableDoc(oracleTableId))
      .then(resolve)
      .catch(reject);
  });
}, "Failed to delete oracle table.");
