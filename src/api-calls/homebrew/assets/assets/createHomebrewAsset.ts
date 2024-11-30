import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewAssetDocument } from "api-calls/homebrew/assets/assets/_homebrewAssets.type";

import { getHomebrewAssetCollection } from "./_getRef";

export const createHomebrewAsset = createApiFunction<
  { asset: HomebrewAssetDocument },
  void
>((params) => {
  const { asset } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewAssetCollection(), asset)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create asset.");
