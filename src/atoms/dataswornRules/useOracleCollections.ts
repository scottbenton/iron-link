import { CollectionId, Datasworn, IdParser } from "@datasworn/core";
import { Primary } from "@datasworn/core/dist/StringId";
import { dataswornTreeAtom } from "atoms/dataswornTree.atom";
import { atom, useAtomValue } from "jotai";
import { getRulesetFromId } from "./getRulesetFromId";
import { CollectionMap } from "./collectionMap.type";

export type OracleCollectionMap = CollectionMap<Datasworn.OracleCollection>;

const oracleCollectionsAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);

  IdParser.tree = trees;
  const rootOracleCollections = CollectionId.getMatches(
    "oracle_collection:*/*",
    trees
  );

  const oracleCollectionMap: OracleCollectionMap = {};

  rootOracleCollections.forEach((collection, key) => {
    const ruleset = getRulesetFromId(collection._id, trees);
    if (!ruleset) return;

    oracleCollectionMap[ruleset.id] = {
      title: ruleset.title,
      collections: {
        ...oracleCollectionMap[ruleset.id]?.collections,
        [key]: collection,
      },
    };
  });

  Object.entries(oracleCollectionMap).forEach(
    ([rulesetKey, assetCollection]) => {
      Object.entries(assetCollection.collections).forEach(
        ([collectionKey, collection]) => {
          if (collection.replaces) {
            collection.replaces.forEach((replacedKey) => {
              const collections = CollectionId.getMatches(
                replacedKey as Primary,
                trees
              );
              collections.forEach((replacedCollection) => {
                if (replacedCollection.type === "oracle_collection") {
                  oracleCollectionMap[rulesetKey].collections[replacedKey] =
                    replacedCollection;
                }
              });
            });
            // delete oracleCollectionMap[rulesetKey].collections[collectionKey];
          }
          if (collection.enhances) {
            collection.enhances.forEach((enhancedKey) => {
              const collections = CollectionId.getMatches(
                enhancedKey as Primary,
                trees
              );
              collections.forEach((enhancedCollection) => {
                if (
                  collection.oracle_type === "tables" &&
                  enhancedCollection.type === "oracle_collection" &&
                  enhancedCollection.oracle_type === "tables"
                ) {
                  oracleCollectionMap[rulesetKey].collections[collectionKey] = {
                    ...enhancedCollection,
                    collections: {
                      ...enhancedCollection.collections,
                      ...collection.collections,
                    },
                  };
                }
              });
            });
            delete oracleCollectionMap[rulesetKey].collections[collectionKey];
          }
        }
      );
    }
  );

  return oracleCollectionMap;
});

export function useOracleCollections() {
  return useAtomValue(oracleCollectionsAtom);
}
