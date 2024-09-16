import { Datasworn, IdParser } from "@datasworn/core";

export function useAssetCollection(
  assetCollectionId: string
): Datasworn.AssetCollection | undefined {
  let assetCollection: Datasworn.AssetCollection | undefined = undefined;
  try {
    const tmpAssetCollection = IdParser.get(assetCollectionId);
    if (
      (tmpAssetCollection as Datasworn.AssetCollection).type ===
      "asset_collection"
    ) {
      assetCollection = tmpAssetCollection as Datasworn.AssetCollection;
    }
  } catch {
    // Continue, just passing undefined instead
  }

  return assetCollection;
}
