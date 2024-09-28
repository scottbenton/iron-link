import { MoveCategoryMap, MoveMap } from "atoms/dataswornRules/useMoves";

export enum CategoryVisibilityState {
  All,
  Some,
  Hidden,
}
export enum MoveVisibilityState {
  Visible,
  Hidden,
}

export interface VisibilitySettings {
  visibleCategories: Record<string, CategoryVisibilityState>;
  visibleMoves: Record<string, MoveVisibilityState>;
}

export function getMoveCategoryVisibility(
  searchValue: string,
  categoryId: string,
  moveCategoryMap: MoveCategoryMap,
  moveMap: MoveMap,
  categoryVisibilityMap: Record<string, CategoryVisibilityState>,
  visibleMoves: Record<string, MoveVisibilityState>
): boolean {
  if (!searchValue.trim()) {
    categoryVisibilityMap[categoryId] = CategoryVisibilityState.All;
    return true;
  }

  const collection = moveCategoryMap[categoryId];
  if (!collection) {
    categoryVisibilityMap[categoryId] = CategoryVisibilityState.Hidden;
    return false;
  }

  if (
    collection.name
      .toLocaleLowerCase()
      .includes(searchValue.trim().toLocaleLowerCase())
  ) {
    categoryVisibilityMap[categoryId] = CategoryVisibilityState.All;
    return true;
  }

  let collectionVisibility = CategoryVisibilityState.Hidden;
  Object.keys(collection.contents).forEach((orcKey) => {
    const orc = collection.contents[orcKey];
    const oracle = moveMap[orc._id];
    if (oracle) {
      if (
        oracle &&
        oracle.name
          .toLocaleLowerCase()
          .includes(searchValue.trim().toLocaleLowerCase())
      ) {
        collectionVisibility = CategoryVisibilityState.Some;
        visibleMoves[oracle._id] = MoveVisibilityState.Visible;
      } else {
        visibleMoves[oracle._id] = MoveVisibilityState.Hidden;
      }
    }
  });

  Object.values(collection.collections).forEach((subCollection) => {
    const areSubCollectionsVisible = getMoveCategoryVisibility(
      searchValue,
      subCollection._id,
      moveCategoryMap,
      moveMap,
      categoryVisibilityMap,
      visibleMoves
    );
    if (areSubCollectionsVisible) {
      collectionVisibility = CategoryVisibilityState.Some;
    }
  });

  categoryVisibilityMap[categoryId] = collectionVisibility;

  return collectionVisibility !== CategoryVisibilityState.Hidden;
}
