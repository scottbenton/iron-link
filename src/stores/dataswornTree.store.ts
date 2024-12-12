import { Datasworn } from "@datasworn/core";
import deepEqual from "fast-deep-equal";
import { useEffect, useMemo } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { useActiveAssetMoveCategories } from "components/datasworn/hooks/useActiveAssetMoveCategories";
import { useActiveAssetOracleCollections } from "components/datasworn/hooks/useActiveAssetOracleCollections";

import { ironLinkAskTheOracleRulesPackage } from "data/askTheOracle";

import { parseAssets } from "./dataswornTreeHelpers/assets";
import { parseConditionMeterRules } from "./dataswornTreeHelpers/conditionMetersRules";
import { parseImpactRules } from "./dataswornTreeHelpers/impactRules";
import { parseMoves } from "./dataswornTreeHelpers/moves";
import { parseOracles } from "./dataswornTreeHelpers/oracles";
import { parseSpecialTrackRules } from "./dataswornTreeHelpers/specialTrackRules";
import { parseStatRules } from "./dataswornTreeHelpers/statRules";

export type CollectionMap<T> = {
  [rulesetKey: string]: {
    title: string;
    collections: Record<string, T>;
  };
};
export type AssetCollectionMap = Record<string, Datasworn.AssetCollection>;
export type AssetMap = Record<string, Datasworn.Asset>;
export type RootAssetCollections = Record<
  string,
  { title: string; rootAssets: string[] }
>;
export type RootMoveCategories = Record<
  string,
  { title: string; rootMoves: string[] }
>;
export type MoveCategoryMap = Record<string, Datasworn.MoveCategory>;
export type MoveMap = Record<string, Datasworn.Move>;
export type RootOracleCollections = Record<
  string,
  { title: string; rootOracles: string[] }
>;
export type OracleCollectionMap = Record<string, Datasworn.OracleCollection>;
export type OracleRollableMap = Record<string, Datasworn.OracleRollable>;

interface DataswornTreeStoreState {
  activeRules: Record<string, Datasworn.RulesPackage>;

  assets: {
    assetCollectionMap: AssetCollectionMap;
    assetMap: AssetMap;
    rootAssetCollections: RootAssetCollections;
  };
  moves: {
    rootMoveCategories: RootMoveCategories;
    moveCategoryMap: MoveCategoryMap;
    moveMap: MoveMap;
  };
  oracles: {
    rootOracleCollections: RootOracleCollections;
    oracleCollectionMap: OracleCollectionMap;
    oracleRollableMap: OracleRollableMap;
  };

  statRules: Record<string, Datasworn.StatRule>;
  conditionMeterRules: Record<string, Datasworn.ConditionMeterRule>;
  impactRules: {
    impactCategories: Record<string, Datasworn.ImpactCategory>;
    impacts: Record<string, Datasworn.ImpactRule>;
  };
  specialTrackRules: Record<string, Datasworn.SpecialTrackRule>;
}

interface DataswornTreeStoreActions {
  setActiveRules: (tree: Record<string, Datasworn.RulesPackage>) => void;
}

export const useDataswornTreeStore = createWithEqualityFn<
  DataswornTreeStoreState & DataswornTreeStoreActions
>()(
  immer((set) => ({
    activeRules: {},

    assets: {
      assetCollectionMap: {},
      assetMap: {},
      rootAssetCollections: {},
    },
    moves: {
      moveCategoryMap: {},
      moveMap: {},
      rootMoveCategories: {},
    },
    oracles: {
      oracleCollectionMap: {},
      oracleRollableMap: {},
      rootOracleCollections: {},
    },

    statRules: {},
    conditionMeterRules: {},
    impactRules: {
      impactCategories: {},
      impacts: {},
    },
    specialTrackRules: {},

    setActiveRules: (tree) => {
      set((store) => {
        store.activeRules = {
          [ironLinkAskTheOracleRulesPackage._id]:
            ironLinkAskTheOracleRulesPackage,
          ...JSON.parse(JSON.stringify(tree)),
        };

        store.assets = parseAssets(store.activeRules);
        store.moves = parseMoves(store.activeRules);
        store.oracles = parseOracles(store.activeRules);

        store.statRules = parseStatRules(store.activeRules);
        store.conditionMeterRules = parseConditionMeterRules(store.activeRules);
        store.impactRules = parseImpactRules(store.activeRules);
        store.specialTrackRules = parseSpecialTrackRules(store.activeRules);
      });
    },
  })),
  deepEqual,
);

export function useDataswornTree() {
  return useDataswornTreeStore((state) => state.activeRules);
}

export function useUpdateDataswornTree(
  tree: Record<string, Datasworn.RulesPackage>,
) {
  const setTree = useSetDataswornTree();
  useEffect(() => {
    setTree(tree);
  }, [tree, setTree]);
}

export function useSetDataswornTree() {
  const setActiveRules = useDataswornTreeStore((state) => state.setActiveRules);
  return setActiveRules;
}

export function useAssets() {
  return useDataswornTreeStore((state) => state.assets);
}

export function useConditionMeterRules() {
  return useDataswornTreeStore((state) => state.conditionMeterRules);
}

export function useImpactRules() {
  return useDataswornTreeStore((state) => state.impactRules);
}

export function useMoves() {
  const assetMoveCategories = useActiveAssetMoveCategories();
  const { rootMoveCategories, moveCategoryMap, moveMap } =
    useDataswornTreeStore((store) => store.moves);

  return useMemo(() => {
    if (Object.keys(assetMoveCategories).length > 0) {
      const rootMoveCategoriesWithAssetCategories = {
        ...rootMoveCategories,
      };
      let moveCategoryMapWithAssetCategories = {
        ...moveCategoryMap,
      };
      let moveMapWithAssetMoves = {
        ...moveMap,
      };

      Object.entries(assetMoveCategories).forEach(
        ([rulesetId, assetMoveCategory]) => {
          rootMoveCategoriesWithAssetCategories[rulesetId] = {
            ...rootMoveCategoriesWithAssetCategories[rulesetId],
            rootMoves: [
              ...rootMoveCategoriesWithAssetCategories[rulesetId].rootMoves,
              assetMoveCategory._id,
            ],
          };
          moveCategoryMapWithAssetCategories = {
            ...moveCategoryMapWithAssetCategories,
            [assetMoveCategory._id]: assetMoveCategory,
          };
          moveMapWithAssetMoves = {
            ...moveMapWithAssetMoves,
            ...assetMoveCategory.contents,
          };
        },
      );

      return {
        rootMoveCategories: rootMoveCategoriesWithAssetCategories,
        moveCategoryMap: moveCategoryMapWithAssetCategories,
        moveMap: moveMapWithAssetMoves,
      };
    }
    return { rootMoveCategories, moveCategoryMap, moveMap };
  }, [assetMoveCategories, rootMoveCategories, moveCategoryMap, moveMap]);
}

export function useOracles() {
  const assetOracleCollections = useActiveAssetOracleCollections();
  const { rootOracleCollections, oracleCollectionMap, oracleRollableMap } =
    useDataswornTreeStore((store) => store.oracles);

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
      },
    );

    return {
      rootOracleCollections: rootOracleCollectionsWithAssetCollections,
      oracleCollectionMap: oracleCollectionMapWithAssetCollections,
      oracleRollableMap: oracleRollableMapWithAssetOracles,
    };
  }

  return { rootOracleCollections, oracleCollectionMap, oracleRollableMap };
}

export function useSpecialTrackRules() {
  return useDataswornTreeStore((state) => state.specialTrackRules);
}

export function useStatRules() {
  return useDataswornTreeStore((state) => state.statRules);
}
