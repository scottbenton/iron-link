import {
  OracleRollableMap,
  OracleCollectionMap,
} from "atoms/dataswornRules/useOracles";

export enum CollectionVisibilityState {
  All,
  Some,
  Hidden,
}
export enum OracleVisibilityState {
  Visible,
  Hidden,
}

export interface VisibilitySettings {
  visibleCollections: Record<string, CollectionVisibilityState>;
  visibleOracles: Record<string, OracleVisibilityState>;
}

export function getOracleCollectionVisibility(
  searchValue: string,
  collectionId: string,
  oracleCollectionMap: OracleCollectionMap,
  oracleRollableMap: OracleRollableMap,
  collectionVisibilityMap: Record<string, CollectionVisibilityState>,
  visibleOracles: Record<string, OracleVisibilityState>
): boolean {
  if (!searchValue.trim()) {
    collectionVisibilityMap[collectionId] = CollectionVisibilityState.All;
    return true;
  }

  const collection = oracleCollectionMap[collectionId];
  if (!collection) {
    collectionVisibilityMap[collectionId] = CollectionVisibilityState.Hidden;
    return false;
  }

  if (
    collection.name
      .toLocaleLowerCase()
      .includes(searchValue.trim().toLocaleLowerCase())
  ) {
    collectionVisibilityMap[collectionId] = CollectionVisibilityState.All;
    return true;
  }

  let collectionVisibility = CollectionVisibilityState.Hidden;
  Object.keys(collection.contents).forEach((orcKey) => {
    const orc = collection.contents[orcKey];
    const oracle = oracleRollableMap[orc._id];
    if (oracle) {
      if (
        oracle &&
        oracle.name
          .toLocaleLowerCase()
          .includes(searchValue.trim().toLocaleLowerCase())
      ) {
        collectionVisibility = CollectionVisibilityState.Some;
        visibleOracles[oracle._id] = OracleVisibilityState.Visible;
      } else {
        visibleOracles[oracle._id] = OracleVisibilityState.Hidden;
      }
    }
  });

  if (collection.oracle_type === "tables") {
    Object.values(collection.collections).forEach((subCollection) => {
      const areSubCollectionsVisible = getOracleCollectionVisibility(
        searchValue,
        subCollection._id,
        oracleCollectionMap,
        oracleRollableMap,
        collectionVisibilityMap,
        visibleOracles
      );
      if (areSubCollectionsVisible) {
        collectionVisibility = CollectionVisibilityState.Some;
      }
    });
  }

  collectionVisibilityMap[collectionId] = collectionVisibility;

  return collectionVisibility !== CollectionVisibilityState.Hidden;
}
