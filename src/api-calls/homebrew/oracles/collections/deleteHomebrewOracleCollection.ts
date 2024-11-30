import { deleteDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { getHomebrewOracleCollectionDoc } from "./_getRef";

export const deleteHomebrewOracleCollection = createApiFunction<
  {
    oracleCollectionId: string;
  },
  void
>((params) => {
  const { oracleCollectionId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewOracleCollectionDoc(oracleCollectionId))
      .then(resolve)
      .catch(reject);
  });
}, "Failed to delete oracle collection.");
