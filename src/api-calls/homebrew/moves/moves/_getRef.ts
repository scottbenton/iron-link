import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";

import { HomebrewMoveDocument } from "api-calls/homebrew/moves/moves/_homebrewMove.type";

export function constructHomebrewMoveCollectionPath() {
  return `homebrew/homebrew/moves`;
}

export function constructHomebrewMoveDocPath(moveId: string) {
  return `${constructHomebrewMoveCollectionPath()}/${moveId}`;
}

export function getHomebrewMoveCollection() {
  return collection(
    firestore,
    constructHomebrewMoveCollectionPath(),
  ) as CollectionReference<HomebrewMoveDocument>;
}

export function getHomebrewMoveDoc(moveId: string) {
  return doc(
    firestore,
    constructHomebrewMoveDocPath(moveId),
  ) as DocumentReference<HomebrewMoveDocument>;
}
