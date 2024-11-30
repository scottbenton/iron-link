import { PartialWithFieldValue, updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewAssetDocument } from "api-calls/homebrew/assets/assets/_homebrewAssets.type";

import { getHomebrewAssetDoc } from "./_getRef";

export const updateHomebrewAsset = createApiFunction<
  {
    assetId: string;
    asset: PartialWithFieldValue<HomebrewAssetDocument>;
  },
  void
>((params) => {
  const { assetId, asset } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewAssetDoc(assetId), asset).then(resolve).catch(reject);
  });
}, "Failed to update asset.");
