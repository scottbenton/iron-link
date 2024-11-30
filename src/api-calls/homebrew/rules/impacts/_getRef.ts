import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";

import { HomebrewImpactCategoryDocument } from "api-calls/homebrew/rules/impacts/_homebrewImpacts.type";

import { firestore } from "config/firebase.config";

export function constructHomebrewImpactsCollectionPath() {
  return `homebrew/homebrew/impacts`;
}

export function constructHomebrewImpactsDocPath(impactCategoryId: string) {
  return `${constructHomebrewImpactsCollectionPath()}/${impactCategoryId}`;
}

export function getHomebrewImpactsCollection() {
  return collection(
    firestore,
    constructHomebrewImpactsCollectionPath(),
  ) as CollectionReference<HomebrewImpactCategoryDocument>;
}

export function getHomebrewImpactsDoc(impactCategoryId: string) {
  return doc(
    firestore,
    constructHomebrewImpactsDocPath(impactCategoryId),
  ) as DocumentReference<HomebrewImpactCategoryDocument>;
}
