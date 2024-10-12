import { CollectionId, Datasworn, IdParser } from "@datasworn/core";
import { Primary } from "@datasworn/core/dist/StringId";
import { dataswornTreeAtom } from "atoms/dataswornTree.atom";
import { atom, useAtomValue } from "jotai";
import { getRulesetFromId } from "./getRulesetFromId";
import { useActiveAssetOracleCollections } from "components/datasworn/hooks/useActiveAssetOracleCollections";

export type RootOracleCollections = Record<
  string,
  { title: string; rootOracles: string[] }
>;
export type OracleCollectionMap = Record<string, Datasworn.OracleCollection>;
export type OracleRollableMap = Record<string, Datasworn.OracleRollable>;

function parseOracleCollection(
  collection: Datasworn.OracleCollection,
  tree: Record<string, Datasworn.RulesPackage>,
  oracleCollectionMap: OracleCollectionMap,
  oracleRollableMap: OracleRollableMap,
  isParentReplaced: boolean
) {
  let isCollectionReplaced = false;
  Object.keys(collection.contents).forEach((oracleKey) => {
    const oracle = collection.contents[oracleKey];
    if (oracle.replaces) {
      oracle.replaces.forEach((replacesKey) => {
        const replacedItems = IdParser.getMatches(replacesKey as Primary, tree);
        replacedItems.forEach((value) => {
          if (value.type === "oracle_rollable") {
            oracleRollableMap[value._id] = oracle;
          }
        });
      });
    }
    oracleRollableMap[oracle._id] = oracle;
  });

  if (collection.replaces) {
    isCollectionReplaced = true;
    if (!isParentReplaced) {
      delete oracleCollectionMap[collection._id];
    }
    collection.replaces.forEach((replacesKey) => {
      const replacedItems = IdParser.getMatches(replacesKey as Primary, tree);
      replacedItems.forEach((value) => {
        if (value.type === "oracle_collection") {
          oracleCollectionMap[value._id] = collection;
        }
      });
    });
  } else if (collection.enhances) {
    delete oracleCollectionMap[collection._id];
    collection.enhances.forEach((enhancesKey) => {
      const enhancedItems = IdParser.getMatches(enhancesKey as Primary, tree);
      enhancedItems.forEach((value) => {
        if (
          value.type === "oracle_collection" &&
          value.oracle_type === collection.oracle_type &&
          oracleCollectionMap[value._id]
        ) {
          oracleCollectionMap[value._id].contents = {
            ...oracleCollectionMap[value._id].contents,
            ...collection.contents,
            //  type will be correct based on the value.oracleType === colleciton.oracleType above
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;

          if (
            collection.oracle_type === "tables" &&
            oracleCollectionMap[value._id].oracle_type === "tables"
          ) {
            (
              oracleCollectionMap[value._id] as Datasworn.OracleTablesCollection
            ).collections = {
              ...(
                oracleCollectionMap[
                  value._id
                ] as Datasworn.OracleTablesCollection
              ).collections,
              ...collection.collections,
            };
          }
        }
      });
    });
  }

  if (collection.oracle_type === "tables") {
    Object.values(collection.collections).forEach((subCollection) => {
      oracleCollectionMap[subCollection._id] = subCollection;
      parseOracleCollection(
        subCollection,
        tree,
        oracleCollectionMap,
        oracleRollableMap,
        isCollectionReplaced
      );
    });
  }
}

const oraclesAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);

  IdParser.tree = trees;
  const rootOracleCollectionsMap = CollectionId.getMatches(
    "oracle_collection:*/*",
    trees
  );

  const rootOracleCollections: RootOracleCollections = {};
  const oracleCollectionMap: OracleCollectionMap = {};
  const oracleRollableMap: OracleRollableMap = {};

  rootOracleCollectionsMap.forEach((collection) => {
    const ruleset = getRulesetFromId(collection._id, trees);
    if (!ruleset) return;

    if (!rootOracleCollections[ruleset.id]) {
      rootOracleCollections[ruleset.id] = {
        title: ruleset.title,
        rootOracles: [],
      };
    }
    rootOracleCollections[ruleset.id].rootOracles.push(collection._id);
  });

  Object.values(rootOracleCollections).forEach(({ rootOracles }) => {
    rootOracles.forEach((rootOracleId) => {
      const collection = rootOracleCollectionsMap.get(rootOracleId);
      if (collection) {
        oracleCollectionMap[collection._id] = collection;
        parseOracleCollection(
          collection,
          trees,
          oracleCollectionMap,
          oracleRollableMap,
          false
        );
      }
    });
  });

  return { rootOracleCollections, oracleCollectionMap, oracleRollableMap };
});

export function useOracles() {
  const assetOracleCollections = useActiveAssetOracleCollections();
  const { rootOracleCollections, oracleCollectionMap, oracleRollableMap } =
    useAtomValue(oraclesAtom);

  if (Object.keys(assetOracleCollections).length > 0) {
    const rootOracleCollectionsWithAssetCollections = {
      ...rootOracleCollections,
    };
    let oracleCollectionMapWithAssetCollections = {
      ...oracleCollectionMap,
    };
    let oracleRollableMapWithAssetOracles = {
      ...oracleRollableMap,
    };

    Object.entries(assetOracleCollections).forEach(
      ([rulesetId, assetOracleCollection]) => {
        rootOracleCollectionsWithAssetCollections[rulesetId] = {
          ...rootOracleCollectionsWithAssetCollections[rulesetId],
          rootOracles: [
            ...rootOracleCollectionsWithAssetCollections[rulesetId].rootOracles,
            assetOracleCollection._id,
          ],
        };
        oracleCollectionMapWithAssetCollections = {
          ...oracleCollectionMapWithAssetCollections,
          [assetOracleCollection._id]: assetOracleCollection,
        };

        oracleRollableMapWithAssetOracles = {
          ...oracleRollableMapWithAssetOracles,
          ...assetOracleCollection.contents,
        };
      }
    );

    return {
      rootOracleCollections: rootOracleCollectionsWithAssetCollections,
      oracleCollectionMap: oracleCollectionMapWithAssetCollections,
      oracleRollableMap: oracleRollableMapWithAssetOracles,
    };
  }

  return { rootOracleCollections, oracleCollectionMap, oracleRollableMap };
}
