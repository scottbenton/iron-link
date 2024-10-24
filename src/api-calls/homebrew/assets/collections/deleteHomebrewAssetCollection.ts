import { deleteDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewAssetCollectionDoc } from "api-calls/homebrew/assets/collections/_getRef";

export const deleteHomebrewAssetCollection = createApiFunction<
  {
    assetCollectionId: string;
  },
  void
>((params) => {
  const { assetCollectionId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewAssetCollectionDoc(assetCollectionId))
      .then(resolve)
      .catch(reject);
  });
}, "Failed to delete asset collection.");
