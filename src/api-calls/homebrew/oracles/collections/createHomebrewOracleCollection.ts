import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewOracleCollectionCollection } from "api-calls/homebrew/oracles/collections/_getRef";
import { HomebrewOracleCollectionDocument } from "api-calls/homebrew/oracles/collections/_homebrewOracleCollection.type";

export const createHomebrewOracleCollection = createApiFunction<
  { oracleCollection: HomebrewOracleCollectionDocument },
  void
>((params) => {
  const { oracleCollection } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewOracleCollectionCollection(), oracleCollection)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create oracle collection.");
