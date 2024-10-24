import { CollectionId, Datasworn, IdParser } from "@datasworn/core";
import { Primary } from "@datasworn/core/dist/StringId";
import { atom, useAtomValue } from "jotai";

import { CollectionMap } from "atoms/dataswornRules/collectionMap.type";
import { getRulesetFromId } from "atoms/dataswornRules/getRulesetFromId";
import { dataswornTreeAtom } from "atoms/dataswornTree.atom";

export type AssetCollectionMap = CollectionMap<Datasworn.AssetCollection>;

const assetCollectionsAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);

  IdParser.tree = trees;
  const rootAssetCollections = CollectionId.getMatches(
    "asset_collection:*/*",
    trees,
  );

  const assetCollectionMap: AssetCollectionMap = {};

  rootAssetCollections.forEach((collection, key) => {
    const ruleset = getRulesetFromId(collection._id, trees);
    if (!ruleset) return;

    assetCollectionMap[ruleset.id] = {
      title: ruleset.title,
      collections: {
        ...assetCollectionMap[ruleset.id]?.collections,
        [key]: collection,
      },
    };
  });

  Object.entries(assetCollectionMap).forEach(
    ([rulesetKey, assetCollection]) => {
      Object.entries(assetCollection.collections).forEach(
        ([collectionKey, collection]) => {
          if (collection.replaces) {
            collection.replaces.forEach((replacedKey) => {
              const collections = CollectionId.getMatches(
                replacedKey as Primary,
                trees,
              );
              collections.forEach((replacedCollection) => {
                if (replacedCollection.type === "asset_collection") {
                  assetCollectionMap[rulesetKey].collections[replacedKey] =
                    replacedCollection;
                }
              });
            });
            delete assetCollectionMap[rulesetKey].collections[collectionKey];
          }
          if (collection.enhances) {
            collection.enhances.forEach((enhancedKey) => {
              const collections = CollectionId.getMatches(
                enhancedKey as Primary,
                trees,
              );
              collections.forEach((enhancedCollection) => {
                if (enhancedCollection.type === "asset_collection") {
                  assetCollectionMap[rulesetKey].collections[collectionKey] = {
                    ...enhancedCollection,
                    collections: {
                      ...enhancedCollection.collections,
                      ...collection.collections,
                    },
                  };
                }
              });
            });
            delete assetCollectionMap[rulesetKey].collections[collectionKey];
          }
        },
      );
    },
  );

  return assetCollectionMap;
});

export function useAssetCollections() {
  return useAtomValue(assetCollectionsAtom);
}
