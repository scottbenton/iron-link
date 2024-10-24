import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";

import { HomebrewMoveCategoryDocument } from "api-calls/homebrew/moves/categories/_homebrewMoveCategory.type";

export function constructHomebrewMoveCategoryCollectionPath() {
  return `homebrew/homebrew/move_categories`;
}

export function constructHomebrewMoveCategoryDocPath(categoryId: string) {
  return `${constructHomebrewMoveCategoryCollectionPath()}/${categoryId}`;
}

export function getHomebrewMoveCategoryCollection() {
  return collection(
    firestore,
    constructHomebrewMoveCategoryCollectionPath(),
  ) as CollectionReference<HomebrewMoveCategoryDocument>;
}

export function getHomebrewMoveCategoryDoc(categoryId: string) {
  return doc(
    firestore,
    constructHomebrewMoveCategoryDocPath(categoryId),
  ) as DocumentReference<HomebrewMoveCategoryDocument>;
}
