import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";

import { HomebrewCollectionDocument } from "api-calls/homebrew/_homebrewCollection.type";

export function constructHomebrewCollectionPath() {
  return "/homebrew/homebrew/collections";
}

export function constructHomebrewCollectionDocPath(
  homebrewCollectionId: string,
) {
  return `${constructHomebrewCollectionPath()}/${homebrewCollectionId}`;
}

export function getHomebrewCollection() {
  return collection(
    firestore,
    constructHomebrewCollectionPath(),
  ) as CollectionReference<HomebrewCollectionDocument>;
}

export function getHomebrewCollectionDoc(homebrewCollectionId: string) {
  return doc(
    firestore,
    constructHomebrewCollectionDocPath(homebrewCollectionId),
  ) as DocumentReference<HomebrewCollectionDocument>;
}
