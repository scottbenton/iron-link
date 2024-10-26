import { PartialWithFieldValue, updateDoc } from "firebase/firestore";

import { getHomebrewOracleCollectionDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewOracleCollectionDocument } from "api-calls/homebrew/oracles/collections/_homebrewOracleCollection.type";

export const updateHomebrewOracleCollection = createApiFunction<
  {
    oracleCollectionId: string;
    oracleCollection: PartialWithFieldValue<HomebrewOracleCollectionDocument>;
  },
  void
>((params) => {
  const { oracleCollectionId, oracleCollection } = params;
  return new Promise((resolve, reject) => {
    updateDoc(
      getHomebrewOracleCollectionDoc(oracleCollectionId),
      oracleCollection,
    )
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to update oracle collection.");
