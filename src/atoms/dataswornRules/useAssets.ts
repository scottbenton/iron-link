import { CollectionId, Datasworn, IdParser } from "@datasworn/core";
import { Primary } from "@datasworn/core/dist/StringId";
import { dataswornTreeAtom } from "atoms/dataswornTree.atom";
import { atom, useAtomValue } from "jotai";
import { getRulesetFromId } from "./getRulesetFromId";

export type RootAssetCollections = Record<
  string,
  { title: string; rootAssets: string[] }
>;
export type AssetCollectionMap = Record<string, Datasworn.AssetCollection>;
export type AssetMap = Record<string, Datasworn.Asset>;

function parseAssetCollection(
  collection: Datasworn.AssetCollection,
  tree: Record<string, Datasworn.RulesPackage>,
  assetCollectionMap: AssetCollectionMap,
  assetMap: AssetMap,
  isParentReplaced: boolean
) {
  let isCollectionReplaced = false;
  Object.keys(collection.contents).forEach((assetKey) => {
    const asset = collection.contents[assetKey];
    if (asset.replaces) {
      asset.replaces.forEach((replacesKey) => {
        const replacedItems = IdParser.getMatches(replacesKey as Primary, tree);
        replacedItems.forEach((value) => {
          if (value.type === "asset") {
            assetMap[value._id] = asset;
          }
        });
      });
    }
    assetMap[asset._id] = asset;
  });

  if (collection.replaces) {
    isCollectionReplaced = true;
    if (!isParentReplaced) {
      delete assetCollectionMap[collection._id];
    }
    collection.replaces.forEach((replacesKey) => {
      const replacedItems = IdParser.getMatches(replacesKey as Primary, tree);
      replacedItems.forEach((value) => {
        if (value.type === "asset_collection") {
          assetCollectionMap[value._id] = collection;
        }
      });
    });
  } else if (collection.enhances) {
    delete assetCollectionMap[collection._id];
    collection.enhances.forEach((enhancesKey) => {
      const enhancedItems = IdParser.getMatches(enhancesKey as Primary, tree);
      enhancedItems.forEach((value) => {
        if (value.type === "asset_collection") {
          assetCollectionMap[value._id].contents = {
            ...assetCollectionMap[value._id].contents,
            ...collection.contents,
          };
          assetCollectionMap[value._id].collections = {
            ...assetCollectionMap[value._id].collections,
            ...collection.collections,
          };
        }
      });
    });
  }

  Object.values(collection.collections).forEach((subCollection) => {
    assetCollectionMap[subCollection._id] = subCollection;
    parseAssetCollection(
      subCollection,
      tree,
      assetCollectionMap,
      assetMap,
      isCollectionReplaced
    );
  });
}

const assetsAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);

  IdParser.tree = trees;
  const rootAssetCollectionsMap = CollectionId.getMatches(
    "asset_collection:*/*",
    trees
  );

  const rootAssetCollections: RootAssetCollections = {};
  const assetCollectionMap: AssetCollectionMap = {};
  const assetMap: AssetMap = {};

  rootAssetCollectionsMap.forEach((collection) => {
    const ruleset = getRulesetFromId(collection._id, trees);
    if (!ruleset) return;

    if (!rootAssetCollections[ruleset.id]) {
      rootAssetCollections[ruleset.id] = {
        title: ruleset.title,
        rootAssets: [],
      };
    }
    rootAssetCollections[ruleset.id].rootAssets.push(collection._id);
  });

  Object.values(rootAssetCollections).forEach(({ rootAssets }) => {
    rootAssets.forEach((rootAssetId) => {
      const collection = rootAssetCollectionsMap.get(rootAssetId);
      if (collection) {
        assetCollectionMap[collection._id] = collection;
        parseAssetCollection(
          collection,
          trees,
          assetCollectionMap,
          assetMap,
          false
        );
      }
    });
  });

  return { rootAssetCollections, assetCollectionMap, assetMap };
});

export function useAssets() {
  return useAtomValue(assetsAtom);
}
