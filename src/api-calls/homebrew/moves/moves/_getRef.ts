import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";

import { HomebrewMoveDocument } from "api-calls/homebrew/moves/moves/_homebrewMove.type";

import { firestore } from "config/firebase.config";

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
