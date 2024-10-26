import { deleteDoc } from "firebase/firestore";

import { getHomebrewOracleTableDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

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
