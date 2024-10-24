import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewAssetCollectionCollection } from "api-calls/homebrew/assets/collections/_getRef";
import { HomebrewAssetCollectionDocument } from "api-calls/homebrew/assets/collections/_homebrewAssetCollection.type";

export const createHomebrewAssetCollection = createApiFunction<
  { assetCollection: HomebrewAssetCollectionDocument },
  void
>((params) => {
  const { assetCollection } = params;

  return new Promise((resolve, reject) => {
    addDoc(getHomebrewAssetCollectionCollection(), assetCollection)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create asset collection.");
